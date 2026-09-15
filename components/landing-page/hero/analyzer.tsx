/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Camera,
  Search,
  ExternalLink,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  Eye,
  Layers,
  Flame,
} from "lucide-react";
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

  // Auto-load first demo on mount
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

    // Simulate multi-engine dispatch progress animation
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
    <div id="analyzer" className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* INPUT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-zinc-950/80 backdrop-blur-xl border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden"
      >
        {/* Subtle orange ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col gap-6">
          {/* Top Label & Credit Shield */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Live Multi-Engine Pipeline • SerpApi + OpenRouter
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>Credit Guard: Smart Caching Active</span>
            </div>
          </div>

          {/* Input Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
                <Camera className="w-5 h-5 text-orange-400" />
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setActiveDemo(null);
                }}
                placeholder="Paste any product image or screenshot URL (e.g. https://...)..."
                className="w-full h-14 pl-12 pr-4 bg-zinc-900/90 border border-zinc-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl text-white placeholder-zinc-500 text-sm sm:text-base transition-all outline-none"
              />
            </div>
            <button
              onClick={() => handleRunAnalysis(imageUrl, undefined)}
              disabled={isLoading || (!imageUrl && !activeDemo)}
              className="h-14 px-8 bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Visuals...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Visual</span>
                </>
              )}
            </button>
          </div>

          {/* ONE-CLICK SHOWCASE CHIPS */}
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">
              Or test instant 1-click demo showcases (0 credits consumed):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DEMO_PRESETS.map((demo) => {
                const isSelected = activeDemo === demo.id && !imageUrl;
                return (
                  <button
                    key={demo.id}
                    onClick={() => selectDemo(demo.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group ${
                      isSelected
                        ? "bg-zinc-800 border-orange-500/80 shadow-md shadow-orange-500/10"
                        : "bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60"
                    }`}
                  >
                    <img
                      src={demo.image}
                      alt={demo.name}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-700/60 shrink-0"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold text-white truncate group-hover:text-orange-300 transition-colors">
                        {demo.name}
                      </span>
                      <span className="text-xs text-zinc-400 truncate">
                        {demo.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LOADING RADAR STATE */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 pt-6 border-t border-zinc-800 flex flex-col items-center justify-center gap-4 py-8"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
                <Eye className="w-6 h-6 text-orange-400 absolute animate-pulse" />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm font-medium text-white animate-pulse">
                  {loadingStages[loadingStep]}
                </p>
                <span className="text-xs text-zinc-500 font-mono">
                  Engine {loadingStep + 1} of {loadingStages.length} in progress
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </motion.div>

      {/* INTELLIGENCE DOSSIER RESULTS */}
      <AnimatePresence>
        {dossier && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 flex flex-col gap-6"
          >
            {/* 1. EXECUTIVE VERDICT HERO CARD */}
            <div className="relative bg-[#0F0F0F] border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
                <div className="flex items-center gap-4">
                  {dossier.serp.entity.thumbnail && (
                    <img
                      src={dossier.serp.entity.thumbnail}
                      alt={dossier.serp.entity.title}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-zinc-700 shadow-md"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400">
                      <span>Detected Visual Entity</span>
                      <span>•</span>
                      <span>Google Lens Verified</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
                      {dossier.serp.entity.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                      {dossier.serp.entity.category}
                    </p>
                  </div>
                </div>

                {/* Verdict Badge */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2">
                  <div
                    className={`px-5 py-2.5 rounded-2xl font-bold text-base sm:text-lg flex items-center gap-2 shadow-lg ${
                      dossier.verdict.verdict === "BUY NOW"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-emerald-500/20"
                        : dossier.verdict.verdict === "WAIT FOR SALE"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-amber-500/20"
                          : "bg-red-500/20 text-red-400 border border-red-500/50 shadow-red-500/20"
                    }`}
                  >
                    {dossier.verdict.verdict === "BUY NOW" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                    <span>{dossier.verdict.verdict}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    Confidence: {dossier.verdict.confidenceScore}% • Synthesized
                    by {dossier.verdict.modelUsed}
                  </span>
                </div>
              </div>

              {/* Rationale Headline */}
              <div className="mt-6 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <p className="text-base sm:text-lg text-zinc-200 font-medium leading-relaxed">
                  💡{" "}
                  <span className="text-white font-semibold">
                    Executive Rationale:{" "}
                  </span>
                  {dossier.verdict.verdictRationale}
                </p>
              </div>

              {/* 3 Key Takeaways Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {dossier.verdict.keyInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-2"
                  >
                    <span className="text-xs font-mono uppercase text-orange-400">
                      Insight {idx + 1}
                    </span>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. THREE MULTI-ENGINE DOSSIER SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* GOOGLE SHOPPING PRICE MATRIX */}
              <div className="lg:col-span-2 bg-[#0F0F0F] border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="w-5 h-5 text-orange-400" />
                      <h3 className="text-lg font-bold text-white">
                        Live Price Arbitrage (Google Shopping)
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Lowest: {dossier.serp.shopping.lowestPrice}
                    </span>
                  </div>

                  {/* Merchant Listings */}
                  <div className="mt-4 flex flex-col gap-2.5">
                    {dossier.serp.shopping.merchants.map((merchant, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/70 hover:border-zinc-700 flex items-center justify-between transition-colors"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {merchant.name}
                            </span>
                            {merchant.badge && (
                              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                {merchant.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-zinc-400">
                            {merchant.delivery}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold text-emerald-400">
                            {merchant.price}
                          </span>
                          <a
                            href={merchant.link}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>
                    Tracked {dossier.serp.shopping.merchantCount} verified
                    merchants
                  </span>
                  <span>
                    Spread: {dossier.serp.shopping.lowestPrice} -{" "}
                    {dossier.serp.shopping.highestPrice || "MSRP"}
                  </span>
                </div>
              </div>

              {/* DEMAND VELOCITY & TRENDS */}
              <div className="bg-[#0F0F0F] border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="w-5 h-5 text-orange-400" />
                      <h3 className="text-lg font-bold text-white">
                        Demand Velocity
                      </h3>
                    </div>
                    <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">
                      Google Trends
                    </span>
                  </div>

                  <div className="mt-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">
                      {dossier.serp.trends.interestScore}
                      <span className="text-lg text-zinc-500 font-normal">
                        /100
                      </span>
                    </span>
                    <span
                      className={`mt-2 text-xs font-mono uppercase px-3 py-1 rounded-full ${
                        dossier.serp.trends.momentum === "surging"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : dossier.serp.trends.momentum === "declining"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      Momentum: {dossier.serp.trends.momentum} (
                      {dossier.serp.trends.changePercentage > 0 ? "+" : ""}
                      {dossier.serp.trends.changePercentage}%)
                    </span>
                  </div>

                  {/* Mini-bars timeline */}
                  <div className="mt-6 flex items-end justify-between gap-2 h-20 px-2">
                    {dossier.serp.trends.timeline.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                      >
                        <div
                          className="w-full bg-linear-to-t from-orange-600 to-amber-400 rounded-t-md transition-all duration-500"
                          style={{ height: `${point.value}%` }}
                        />
                        <span className="text-[10px] font-mono text-zinc-500">
                          {point.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
                  <p>
                    <span className="text-white font-semibold">
                      Timing Guidance:{" "}
                    </span>
                    {dossier.verdict.timingAdvice}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. COMMUNITY CONSENSUS & DEFECT ALERTS */}
            <div className="bg-[#0F0F0F] border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-white">
                    Reddit & Forum Intelligence (Google Search)
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  Unfiltered Community Consensus
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {dossier.serp.webIntelligence.signals.map((signal, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      signal.type === "warning"
                        ? "bg-amber-950/20 border-amber-800/50 text-amber-200"
                        : "bg-emerald-950/20 border-emerald-800/50 text-emerald-200"
                    }`}
                  >
                    {signal.type === "warning" ? (
                      <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-mono uppercase tracking-wider opacity-70">
                        {signal.source}
                      </span>
                      <p className="text-sm font-medium leading-relaxed">
                        {signal.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discussions */}
              <div className="mt-6 flex flex-col gap-2.5">
                <span className="text-xs font-mono uppercase text-zinc-400">
                  Featured Community Discussions:
                </span>
                {dossier.serp.webIntelligence.discussions.map((d, idx) => (
                  <a
                    key={idx}
                    href={d.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-white group-hover:text-orange-300 transition-colors">
                        {d.title}
                      </span>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {d.snippet}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white shrink-0 ml-4 transition-colors" />
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
