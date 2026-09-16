"use client";

import React from "react";
import { SerpApiAnalysisResult } from "@/lib/serpapi";
import { OpenRouterVerdict } from "@/lib/openrouter";

interface DecisionCardProps {
  serp: SerpApiAnalysisResult;
  verdict: OpenRouterVerdict;
}

export function DecisionCard({ serp, verdict }: DecisionCardProps) {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-4">
          {serp.entity.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={serp.entity.thumbnail}
              alt={serp.entity.title}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-zinc-200 shrink-0"
            />
          )}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              IDENTIFICATION · Powered by Google Lens via SerpApi
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-0.5">
              {serp.entity.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              {serp.entity.category}
            </p>
          </div>
        </div>

        {/* Pure Typographic Verdict Badge (No Icons) */}
        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          <div
            className={`px-5 py-2.5 rounded-xl font-bold text-base sm:text-lg border tracking-wider uppercase ${
              serp.decision.verdict === "BUY"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : serp.decision.verdict === "WAIT"
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-rose-50 text-rose-800 border-rose-300"
            }`}
          >
            SNAPINTEL DECISION: {serp.decision.verdict}
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {serp.isCached
              ? "Cached Result (0 Credits)"
              : `Live Search (${serp.creditsUsed} Credits)`}
          </span>
        </div>
      </div>

      {/* Observable Signals Bar (No Fake "94% AI Confidence") */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
          <span className="text-[11px] font-mono uppercase text-zinc-400 block">
            Identification
          </span>
          <span className="text-sm font-bold text-zinc-900 mt-0.5 block">
            {serp.signals.identification.level}
          </span>
          <span className="text-[11px] text-zinc-500 truncate block">
            {serp.signals.identification.label}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
          <span className="text-[11px] font-mono uppercase text-zinc-400 block">
            Price Coverage
          </span>
          <span className="text-sm font-bold text-zinc-900 mt-0.5 block">
            {serp.signals.priceCoverage.level}
          </span>
          <span className="text-[11px] text-zinc-500 truncate block">
            {serp.shopping.merchantCount} Merchants Tracked
          </span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
          <span className="text-[11px] font-mono uppercase text-zinc-400 block">
            Web Evidence
          </span>
          <span className="text-sm font-bold text-zinc-900 mt-0.5 block">
            {serp.signals.webEvidence.level}
          </span>
          <span className="text-[11px] text-zinc-500 truncate block">
            {serp.webIntelligence.discussions.length} Discussions Analyzed
          </span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
          <span className="text-[11px] font-mono uppercase text-zinc-400 block">
            Demand Signal
          </span>
          <span className="text-sm font-bold text-zinc-900 mt-0.5 block">
            {serp.signals.demandSignal.level}
          </span>
          <span className="text-[11px] text-zinc-500 truncate block">
            Google Trends Momentum
          </span>
        </div>
      </div>

      {/* Explainable Decision: WHY */}
      <div className="mt-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
          Why {serp.decision.verdict}?
        </span>
        <p className="text-sm sm:text-base text-zinc-900 font-medium leading-relaxed">
          {serp.decision.oneLinerWhy}
        </p>
      </div>

      {/* Executive Brief (AI Synthesis of Evidence) */}
      <div className="mt-4 p-4 rounded-xl bg-white border border-zinc-200/90 shadow-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
          Executive Brief (AI Evidence Synthesis · {verdict.modelUsed})
        </span>
        <p className="text-sm text-zinc-700 leading-relaxed">
          {verdict.executiveBrief}
        </p>
      </div>

      {/* Key Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {verdict.keyDrivers.map((driver, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-zinc-50/60 border border-zinc-200/70 flex flex-col gap-1"
          >
            <span className="text-[10px] font-mono uppercase text-zinc-400">
              Factor {idx + 1}
            </span>
            <p className="text-xs sm:text-sm text-zinc-800 leading-normal">
              {driver}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
