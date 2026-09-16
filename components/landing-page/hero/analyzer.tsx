/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SerpApiAnalysisResult } from "@/lib/serpapi";
import { OpenRouterVerdict } from "@/lib/openrouter";

interface DossierData {
  serp: SerpApiAnalysisResult;
  verdict: OpenRouterVerdict;
}

const DEMO_PRESETS = [
  {
    id: "airpods-max",
    name: "Apple AirPods Max",
    tag: "Tech • ANC Headphones",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "nike-retro",
    name: "Jordan 1 'Lost & Found'",
    tag: "Sneakers • High-Top OG",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "cerave-cleanser",
    name: "CeraVe Hydrating Cleanser",
    tag: "Skincare • Daily Wash",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80",
  },
];

export default function SnapIntelAnalyzer() {
  const [imageUrl, setImageUrl] = useState("");
  const [activeDemo, setActiveDemo] = useState<string | null>("airpods-max");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [dossier, setDossier] = useState<DossierData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingStages = [
    "Querying SerpApi Google Lens for visual matching...",
    "Extracting live multi-store prices via Google Shopping...",
    "Searching Reddit & tech forums for defect consensus...",
    "Generating grounded executive verdict via OpenRouter LLM...",
  ];

  React.useEffect(() => {
    handleRunAnalysis(undefined, "airpods-max");
  }, []);

  const handleRunAnalysis = async (customUrl?: string, demoKey?: string) => {
    const targetUrl = customUrl !== undefined ? customUrl : imageUrl;
    const targetDemo =
      demoKey !== undefined ? demoKey : activeDemo || undefined;

    if (!targetUrl && !targetDemo) {
      setError("Please paste an image URL or click a demo showcase.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingStep(0);

    const stageTimer = setInterval(() => {
      setLoadingStep((prev) =>
        prev < loadingStages.length - 1 ? prev + 1 : prev,
      );
    }, 600);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: targetUrl,
          demoKey: targetDemo,
        }),
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
    handleRunAnalysis(undefined, id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* 1. INPUT CARD */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
              Smart Cache Active (0 Credits Burned on Demos)
            </span>
          </div>

          {/* Search bar without icons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setActiveDemo(null);
              }}
              placeholder="Paste any product image or screenshot URL (https://...)"
              className="flex-1 h-12 px-4 bg-zinc-50 border border-zinc-300 focus:border-zinc-900 focus:bg-white rounded-xl text-zinc-900 placeholder-zinc-400 text-sm outline-none transition-colors"
            />
            <button
              onClick={() => handleRunAnalysis(imageUrl, undefined)}
              disabled={isLoading || (!imageUrl && !activeDemo)}
              className="h-12 px-6 bg-zinc-900 hover:bg-black text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
            >
              {isLoading ? "Analyzing..." : "Analyze Visual"}
            </button>
          </div>

          {/* One-click demo selection */}
          <div className="flex flex-col gap-2 pt-1 border-t border-zinc-100">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 pt-2">
              Instant Demo Samples:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DEMO_PRESETS.map((demo) => {
                const isSelected = activeDemo === demo.id && !imageUrl;
                return (
                  <button
                    key={demo.id}
                    onClick={() => selectDemo(demo.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-zinc-100 border-zinc-900 shadow-xs"
                        : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/60"
                    }`}
                  >
                    <img
                      src={demo.image}
                      alt={demo.name}
                      className="w-10 h-10 rounded-lg object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-zinc-900 truncate">
                        {demo.name}
                      </span>
                      <span className="text-xs text-zinc-500 truncate">
                        {demo.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LOADING INDICATOR */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-zinc-100 flex flex-col items-center justify-center gap-2 py-4"
            >
              <p className="text-sm font-medium text-zinc-800 animate-pulse">
                {loadingStages[loadingStep]}
              </p>
              <span className="text-xs text-zinc-400 font-mono">
                Step {loadingStep + 1} of {loadingStages.length}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* 2. INTELLIGENCE DOSSIER (WHITE THEMED WITH SILKY SMOOTH MOTION) */}
      <AnimatePresence mode="wait">
        {dossier && !isLoading && (
          <motion.div
            key={activeDemo || dossier.serp.entity.title}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="mt-8 flex flex-col gap-6"
          >
            {/* A. EXECUTIVE VERDICT CARD */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-4">
                {dossier.serp.entity.thumbnail && (
                  <img
                    src={dossier.serp.entity.thumbnail}
                    alt={dossier.serp.entity.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-zinc-200"
                  />
                )}
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Google Lens Identified
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-0.5">
                    {dossier.serp.entity.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500">
                    {dossier.serp.entity.category}
                  </p>
                </div>
              </div>

              {/* Pure Typographic Verdict Badge (No Icons) */}
              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <div
                  className={`px-4 py-2 rounded-xl font-bold text-sm sm:text-base border tracking-wide ${
                    dossier.verdict.verdict === "BUY NOW"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : dossier.verdict.verdict === "WAIT FOR SALE"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                >
                  {dossier.verdict.verdict}
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  Confidence: {dossier.verdict.confidenceScore}% •{" "}
                  {dossier.verdict.modelUsed}
                </span>
              </div>
            </div>

            {/* Executive Rationale */}
            <div className="mt-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <p className="text-sm sm:text-base text-zinc-800 font-normal leading-relaxed">
                <span className="font-semibold text-zinc-900">
                  Executive Brief:{" "}
                </span>
                {dossier.verdict.verdictRationale}
              </p>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {dossier.verdict.keyInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-50/50 border border-zinc-200/70 flex flex-col gap-1.5"
                >
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Point {idx + 1}
                  </span>
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* B. MULTI-ENGINE DOSSIER GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GOOGLE SHOPPING PRICE MATRIX */}
            <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <h3 className="text-base font-bold text-zinc-900">
                    Price Comparison (Google Shopping)
                  </h3>
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                    Lowest: {dossier.serp.shopping.lowestPrice}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {dossier.serp.shopping.merchants.map((merchant, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-zinc-50/60 border border-zinc-200/70 flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-900">
                            {merchant.name}
                          </span>
                          {merchant.badge && (
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">
                              {merchant.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-zinc-500">
                          {merchant.delivery}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-emerald-700">
                          {merchant.price}
                        </span>
                        <a
                          href={merchant.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-zinc-600 hover:text-zinc-900 underline font-medium"
                        >
                          Visit &rarr;
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>
                  {dossier.serp.shopping.merchantCount} Tracked Merchants
                </span>
                <span>
                  Spread: {dossier.serp.shopping.lowestPrice} -{" "}
                  {dossier.serp.shopping.highestPrice || "MSRP"}
                </span>
              </div>
            </div>

            {/* DEMAND VELOCITY */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <h3 className="text-base font-bold text-zinc-900">
                    Demand Velocity
                  </h3>
                  <span className="text-xs font-mono uppercase text-zinc-500">
                    Google Trends
                  </span>
                </div>

                <div className="mt-6 flex flex-col items-center justify-center p-6 rounded-xl bg-zinc-50 border border-zinc-200/80 text-center">
                  <span className="text-4xl font-bold text-zinc-900">
                    {dossier.serp.trends.interestScore}
                    <span className="text-sm text-zinc-400 font-normal">
                      {" "}
                      / 100
                    </span>
                  </span>
                  <span className="mt-2 text-xs font-mono uppercase text-zinc-600">
                    Status: {dossier.serp.trends.momentum} (
                    {dossier.serp.trends.changePercentage > 0 ? "+" : ""}
                    {dossier.serp.trends.changePercentage}%)
                  </span>
                </div>

                {/* Timeline mini-bars */}
                <div className="mt-6 flex items-end justify-between gap-2 h-16 px-2">
                  {dossier.serp.trends.timeline.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                    >
                      <div
                        className="w-full bg-zinc-800 rounded-t-sm"
                        style={{ height: `${point.value}%` }}
                      />
                      <span className="text-[10px] font-mono text-zinc-500">
                        {point.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 text-xs text-zinc-600">
                <span className="font-semibold text-zinc-800">Timing: </span>
                {dossier.verdict.timingAdvice}
              </div>
            </div>
          </div>

          {/* C. COMMUNITY DEFECT & FORUM INTEL */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-900">
                Community & Forum Consensus (Google Search)
              </h3>
              <span className="text-xs font-mono text-zinc-500">
                Reddit & Reviews
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {dossier.serp.webIntelligence.signals.map((signal, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-sm ${
                    signal.type === "warning"
                      ? "bg-amber-50/60 border-amber-200 text-amber-900"
                      : "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                  }`}
                >
                  <span className="text-[11px] font-mono uppercase tracking-wider block opacity-75 mb-1">
                    [{signal.source}]
                  </span>
                  <p className="font-normal leading-relaxed">{signal.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Relevant Discussions:
              </span>
              {dossier.serp.webIntelligence.discussions.map((d, idx) => (
                <a
                  key={idx}
                  href={d.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-zinc-50/60 border border-zinc-200/70 hover:border-zinc-400 flex items-center justify-between transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-900">
                      {d.title}
                    </span>
                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {d.snippet}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 ml-4 shrink-0">
                    &rarr;
                  </span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}
