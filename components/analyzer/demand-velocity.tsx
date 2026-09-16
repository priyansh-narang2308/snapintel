"use client";

import React from "react";
import { SerpApiAnalysisResult } from "@/lib/serpapi";
import { OpenRouterVerdict } from "@/lib/openrouter";

interface DemandVelocityProps {
  trends?: SerpApiAnalysisResult["trends"];
  scanTier: string;
  timingAdvice: OpenRouterVerdict["timingAdvice"];
}

export function DemandVelocity({ trends, scanTier, timingAdvice }: DemandVelocityProps) {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-base font-bold text-zinc-900">
              Demand Velocity
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              Powered by Google Trends via SerpApi
            </span>
          </div>
        </div>

        {trends ? (
          <>
            <div className="mt-6 flex flex-col items-center justify-center p-6 rounded-xl bg-zinc-50 border border-zinc-200/80 text-center">
              <span className="text-4xl font-bold text-zinc-900">
                {trends.interestScore}
                <span className="text-sm text-zinc-400 font-normal"> / 100</span>
              </span>
              <span className="mt-2 text-xs font-mono uppercase text-zinc-600">
                Status: {trends.momentum} ({trends.changePercentage > 0 ? "+" : ""}
                {trends.changePercentage}%)
              </span>
            </div>

            {/* Timeline mini-bars */}
            <div className="mt-6 flex items-end justify-between gap-2 h-16 px-2">
              {trends.timeline.map((point, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                >
                  <div
                    className="w-full bg-zinc-800 rounded-t-sm"
                    style={{ height: `${Math.max(point.value, 15)}%` }}
                  />
                  <span className="text-[10px] font-mono text-zinc-500">
                    {point.date}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-6 p-8 rounded-xl bg-zinc-50 text-center text-xs text-zinc-500 font-mono">
            Google Trends query omitted under current scan tier ({scanTier}). Select &apos;Deep&apos; tier to invoke.
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-100 text-xs text-zinc-600">
        <span className="font-semibold text-zinc-800">Timing: </span>
        {timingAdvice}
      </div>
    </div>
  );
}
