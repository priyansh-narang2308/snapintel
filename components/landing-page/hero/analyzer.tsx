/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ScanTier,
  DossierData,
  AnalyzerInput,
  DecisionCard,
  PriceMatrix,
  DemandVelocity,
  CommunityIntel,
  ComparisonCard,
} from "@/components/analyzer";

const LOADING_STAGES = [
  "Google Lens identifying visual entity & matches...",
  "Google Shopping aggregating real-time merchant prices...",
  "Google Search analyzing community reviews & defect reports...",
  "Synthesizing observable market signals & executive brief...",
];

export default function SnapIntelAnalyzer() {
  const [activeTab, setActiveTab] = useState<"single" | "compare">("single");
  const [scanTier, setScanTier] = useState<ScanTier>("smart");

  // Single analysis state
  const [imageUrl, setImageUrl] = useState("");
  const [activeDemo, setActiveDemo] = useState<string | null>("airpods-max");

  // Comparison state
  const [compareDemoA, setCompareDemoA] = useState("airpods-max");
  const [compareDemoB, setCompareDemoB] = useState("nike-retro");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [dossier, setDossier] = useState<DossierData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleRunAnalysis(undefined, "airpods-max", "smart");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRunAnalysis = async (
    customUrl?: string,
    demoKey?: string,
    tier: ScanTier = scanTier,
    compDemoKey?: string,
  ) => {
    const targetUrl = customUrl !== undefined ? customUrl : imageUrl;

    // If a real URL is provided, don't send demoKey — force a live SerpApi scan
    const targetDemo =
      targetUrl && targetUrl.startsWith("http")
        ? undefined
        : demoKey !== undefined
          ? demoKey
          : activeDemo || undefined;

    if (!targetUrl && !targetDemo) {
      setError("Please paste an image URL or choose a demo showcase.");
      return;
    }

    // Clear demo selection when doing a live URL scan
    if (targetUrl && targetUrl.startsWith("http")) {
      setActiveDemo(null);
    }

    setError(null);
    setIsLoading(true);
    setLoadingStep(0);

    const stageTimer = setInterval(() => {
      setLoadingStep((prev) =>
        prev < LOADING_STAGES.length - 1 ? prev + 1 : prev,
      );
    }, 600);

    try {
      const payload: any = {
        scanTier: tier,
      };

      // Only send one: either imageUrl for live scan, or demoKey for cached demo
      if (targetDemo) {
        payload.demoKey = targetDemo;
      } else {
        payload.imageUrl = targetUrl;
      }

      if (activeTab === "compare") {
        payload.compareDemoKey = compDemoKey || compareDemoB;
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to analyze visual asset.");
      }

      setDossier(json.data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to SnapIntel pipeline.");
    } finally {
      clearInterval(stageTimer);
      setIsLoading(false);
    }
  };

  const selectDemo = (id: string) => {
    setActiveDemo(id);
    setImageUrl("");
    handleRunAnalysis(undefined, id, scanTier);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-24">
      {/* 1. INPUT & CONTROL PANEL */}
      <AnalyzerInput
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scanTier={scanTier}
        setScanTier={setScanTier}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        activeDemo={activeDemo}
        selectDemo={selectDemo}
        compareDemoA={compareDemoA}
        setCompareDemoA={setCompareDemoA}
        compareDemoB={compareDemoB}
        setCompareDemoB={setCompareDemoB}
        isLoading={isLoading}
        loadingStep={loadingStep}
        loadingStages={LOADING_STAGES}
        error={error}
        onRunAnalysis={handleRunAnalysis}
        isCached={dossier?.serp.isCached}
        creditsUsed={dossier?.serp.creditsUsed}
      />

      {/* 2. INTELLIGENCE DOSSIER & COMPARISON DISPLAY */}
      <AnimatePresence mode="wait">
        {dossier && !isLoading && (
          <motion.div
            key={activeTab + (activeDemo || dossier.serp.entity.title)}
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="mt-8 flex flex-col gap-6"
          >
            {/* Trade-Off Verdict Card (When Comparison Mode Active) */}
            {activeTab === "compare" && dossier.comparison && (
              <ComparisonCard
                comparison={dossier.comparison}
                primarySerp={dossier.serp}
              />
            )}

            {/* A. Explainable Decision & Observable Signals */}
            <DecisionCard serp={dossier.serp} verdict={dossier.verdict} />

            {/* B. Multi-Engine Price & Demand Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PriceMatrix
                shopping={dossier.serp.shopping}
                signals={dossier.serp.signals}
              />
              <DemandVelocity
                trends={dossier.serp.trends}
                scanTier={dossier.serp.scanTier}
                timingAdvice={dossier.verdict.timingAdvice}
              />
            </div>

            {/* C. Community Defect & Web Consensus */}
            <CommunityIntel
              webIntelligence={dossier.serp.webIntelligence}
              signals={dossier.serp.signals}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
