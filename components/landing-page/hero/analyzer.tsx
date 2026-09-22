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
    tier: ScanTier = "smart",
    compDemoKey?: string,
    imageBase64?: string,
  ) => {
    const targetUrl = customUrl !== undefined ? customUrl : imageUrl;

    // If a real URL is provided, don't send demoKey — force a live SerpApi scan
    const targetDemo =
      targetUrl && targetUrl.startsWith("http")
        ? undefined
        : demoKey !== undefined
          ? demoKey
          : activeDemo || undefined;

    if (!targetUrl && !targetDemo && !imageBase64) {
      setError("Please paste an image URL, choose a demo, or upload an image.");
      return;
    }

    // Clear demo selection when doing a live URL/upload scan
    if ((targetUrl && targetUrl.startsWith("http")) || imageBase64) {
      setActiveDemo(null);
    }

    setError(null);
    setIsLoading(true);
    setLoadingStep(0);

    const stageTimer = setInterval(() => {
      setLoadingStep((prev) =>
        prev < LOADING_STAGES.length - 1 ? prev + 1 : prev,
      );
    }, 3500);

    try {
      const payload: any = {
        scanTier: tier,
      };

      // Only send one: either imageUrl/imageBase64 for live scan, or demoKey for cached demo
      if (imageBase64) {
        payload.imageBase64 = imageBase64;
      } else if (targetDemo) {
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

      {/* LOADING MODAL */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50/80 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white border border-zinc-200/80 shadow-2xl rounded-[2rem] p-8 max-w-md w-full flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-transparent pointer-events-none" />
              <img
                src="/loader.gif"
                alt="Analyzing..."
                className="w-40 h-40 object-cover mb-6 rounded-2xl shadow-sm relative z-10"
              />
              <h3 className="text-lg font-bold text-zinc-900 mb-2 relative z-10">
                Synthesizing Intelligence
              </h3>
              <p className="text-sm font-medium text-zinc-500 h-10 flex items-center justify-center relative z-10">
                {LOADING_STAGES[loadingStep]}
              </p>
              
              <div className="w-full mt-6 bg-zinc-100 rounded-full h-1.5 overflow-hidden relative z-10">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-zinc-900"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${((loadingStep + 1) / LOADING_STAGES.length) * 100}%`,
                  }}
                  transition={{ ease: "easeInOut", duration: 0.5 }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 mt-4 uppercase tracking-widest relative z-10">
                Phase {loadingStep + 1} of {LOADING_STAGES.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
