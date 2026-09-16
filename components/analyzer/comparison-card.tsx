"use client";

import React from "react";
import { ComparisonData } from "./types";
import { SerpApiAnalysisResult } from "@/lib/serpapi";

interface ComparisonCardProps {
  comparison: ComparisonData;
  primarySerp: SerpApiAnalysisResult;
}

export function ComparisonCard({ comparison, primarySerp }: ComparisonCardProps) {
  const { tradeoff, itemB } = comparison;

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">
            SnapIntel Trade-Off Verdict
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            Dual-Scan Multi-Engine Synthesis
          </span>
        </div>
        <span className="text-xs font-mono uppercase bg-zinc-100 px-2.5 py-1 rounded-md text-zinc-600 font-medium">
          Comparative Analysis
        </span>
      </div>

      {/* Primary recommendation statement */}
      <div className="mt-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-800 leading-relaxed font-medium">
        {tradeoff.recommendation}
      </div>

      {/* 3 Trade-Off Dimension Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {/* Price Winner */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70">
          <span className="text-xs font-mono uppercase text-zinc-400">
            Price Advantage
          </span>
          <p className="text-sm sm:text-base font-bold text-zinc-900 mt-1">
            {tradeoff.priceWinner === "A" ? primarySerp.entity.title : itemB.serp.entity.title}
          </p>
          <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
            Difference: ${tradeoff.priceDifference} lower
          </span>
        </div>

        {/* Web / Review Sentiment Winner */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70">
          <span className="text-xs font-mono uppercase text-zinc-400">
            Review Sentiment
          </span>
          <p className="text-sm sm:text-base font-bold text-zinc-900 mt-1">
            {tradeoff.reviewWinner === "A" ? primarySerp.entity.title : itemB.serp.entity.title}
          </p>
          <span className="text-xs text-zinc-600 block mt-0.5">
            Stronger verified forum consensus
          </span>
        </div>

        {/* Demand Momentum Winner */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70">
          <span className="text-xs font-mono uppercase text-zinc-400">
            Demand Momentum
          </span>
          <p className="text-sm sm:text-base font-bold text-zinc-900 mt-1">
            {tradeoff.demandWinner === "A" ? primarySerp.entity.title : itemB.serp.entity.title}
          </p>
          <span className="text-xs text-zinc-600 block mt-0.5">
            Higher Google Trends trajectory
          </span>
        </div>
      </div>
    </div>
  );
}
