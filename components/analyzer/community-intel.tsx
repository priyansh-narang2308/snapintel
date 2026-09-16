"use client";

import React from "react";
import { SerpApiAnalysisResult } from "@/lib/serpapi";

interface CommunityIntelProps {
  webIntelligence: SerpApiAnalysisResult["webIntelligence"];
  signals: SerpApiAnalysisResult["signals"];
}

export function CommunityIntel({ webIntelligence, signals }: CommunityIntelProps) {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div>
          <h3 className="text-base font-bold text-zinc-900">
            Community & Web Consensus
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            Powered by Google Search via SerpApi
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-500">
          Reddit & Forum Sources
        </span>
      </div>

      {/* Recurring Pros vs Recurring Concerns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold block mb-2">
            Recurring Strengths
          </span>
          <ul className="flex flex-col gap-1.5">
            {signals.webEvidence.recurringPros.map((pro, i) => (
              <li key={i} className="text-xs sm:text-sm text-zinc-800 flex items-start gap-2">
                <span className="text-emerald-600 font-bold">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold block mb-2">
            Recurring Concerns & Trade-Offs
          </span>
          <ul className="flex flex-col gap-1.5">
            {signals.webEvidence.recurringConcerns.map((con, i) => (
              <li key={i} className="text-xs sm:text-sm text-zinc-800 flex items-start gap-2">
                <span className="text-amber-600 font-bold">&minus;</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Relevant Discussions */}
      {webIntelligence.discussions.length > 0 && (
        <div className="mt-6 flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Verified Discussion Snippets:
          </span>
          {webIntelligence.discussions.map((d, idx) => (
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
      )}
    </div>
  );
}
