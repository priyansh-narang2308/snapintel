"use client";

import React from "react";
import { SerpApiAnalysisResult } from "@/lib/serpapi";

interface PriceMatrixProps {
  shopping: SerpApiAnalysisResult["shopping"];
  signals: SerpApiAnalysisResult["signals"];
}

export function PriceMatrix({ shopping, signals }: PriceMatrixProps) {
  return (
    <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-base font-bold text-zinc-900">
              Price Comparison
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              Powered by Google Shopping via SerpApi
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
            Lowest: {shopping.lowestPrice}
          </span>
        </div>

        {/* Price Spread Overview */}
        <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-zinc-50 rounded-xl border border-zinc-200/70 text-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Lowest</span>
            <span className="text-sm font-bold text-emerald-700">{shopping.lowestPrice}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Median</span>
            <span className="text-sm font-bold text-zinc-800">{shopping.medianPrice || "N/A"}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Highest</span>
            <span className="text-sm font-bold text-zinc-500">{shopping.highestPrice || "MSRP"}</span>
          </div>
        </div>

        {/* Merchant Listings */}
        <div className="mt-4 flex flex-col gap-2">
          {shopping.merchants.map((merchant, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-zinc-50/60 border border-zinc-200/70 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900">
                    {merchant.name}
                  </span>
                  {merchant.rating && (
                    <span className="text-xs text-zinc-500">
                      {merchant.rating} ★ {merchant.reviewsCount ? `(${merchant.reviewsCount})` : ""}
                    </span>
                  )}
                  {merchant.isLowest && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Lowest Price
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-500">
                  {merchant.delivery}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-zinc-900">
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
        <span>{shopping.merchantCount} Verified Merchants Tracked</span>
        <span>{signals.priceCoverage.differenceFromMedian}</span>
      </div>
    </div>
  );
}
