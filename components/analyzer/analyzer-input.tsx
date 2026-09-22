"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScanTier, DEMO_PRESETS } from "./types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/motion/select";

interface AnalyzerInputProps {
  activeTab: "single" | "compare";
  setActiveTab: (tab: "single" | "compare") => void;
  scanTier: ScanTier;
  setScanTier: (tier: ScanTier) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  activeDemo: string | null;
  selectDemo: (id: string) => void;
  compareDemoA: string;
  setCompareDemoA: (id: string) => void;
  compareDemoB: string;
  setCompareDemoB: (id: string) => void;
  isLoading: boolean;
  loadingStep: number;
  loadingStages: string[];
  error: string | null;
  onRunAnalysis: (customUrl?: string, demoKey?: string, tier?: ScanTier, compDemoKey?: string, imageBase64?: string) => void;
  isCached?: boolean;
  creditsUsed?: number;
}

export function AnalyzerInput({
  activeTab,
  setActiveTab,
  scanTier,
  setScanTier,
  imageUrl,
  setImageUrl,
  activeDemo,
  selectDemo,
  compareDemoA,
  setCompareDemoA,
  compareDemoB,
  setCompareDemoB,
  isLoading,
  loadingStep,
  loadingStages,
  error,
  onRunAnalysis,
  isCached,
  creditsUsed,
}: AnalyzerInputProps) {
  const [imageBase64, setImageBase64] = React.useState<string | undefined>();
  const [isDragging, setIsDragging] = React.useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    // Clear other inputs
    setImageUrl("");
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        // Resize if too large (max 1200px width/height to stay < 500KB)
        const MAX_SIZE = 1200;
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
          setImageBase64(compressedBase64);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) processFile(file);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-6">
        {/* Top Controls: Mode & Scan Depth */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200">
            <button
              onClick={() => {
                setActiveTab("single");
                onRunAnalysis(undefined, activeDemo || "airpods-max", scanTier);
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "single"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Single Product Dossier
            </button>
            <button
              onClick={() => {
                setActiveTab("compare");
                onRunAnalysis(undefined, compareDemoA, scanTier, compareDemoB);
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "compare"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Visual Comparison (A vs B)
            </button>
          </div>

          {/* Tier Depth Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">Scan Depth:</span>
            <div className="inline-flex p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 text-xs font-medium">
              {(["quick", "smart", "deep"] as ScanTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    setScanTier(tier);
                    onRunAnalysis(imageUrl || undefined, activeDemo || undefined, tier);
                  }}
                  className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                    scanTier === tier
                      ? "bg-white text-zinc-900 font-semibold shadow-xs"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {tier}
                  {tier === "quick" ? " (2 calls)" : tier === "smart" ? " (3 calls)" : " (4 calls)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab 1: Single Mode Input */}
        {activeTab === "single" ? (
          <div className="flex flex-col gap-3">
            <div 
              className={`flex flex-col sm:flex-row gap-3 p-2 rounded-2xl border-2 transition-all ${isDragging ? "border-zinc-900 bg-zinc-50" : "border-transparent"}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <div className="flex-1 relative flex items-center">
                {imageBase64 && (
                  <div className="absolute left-2 w-10 h-10 rounded-lg overflow-hidden border border-zinc-200">
                    <img src={imageBase64} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
                <input
                  type="text"
                  value={imageBase64 ? "Local Screenshot Added" : imageUrl}
                  readOnly={!!imageBase64}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste URL, Ctrl+V screenshot, or Drag & Drop"
                  className={`w-full h-12 ${imageBase64 ? "pl-14 text-zinc-900 font-medium" : "px-4"} bg-zinc-50 border border-zinc-300 focus:border-zinc-900 focus:bg-white rounded-xl text-zinc-900 placeholder-zinc-400 text-sm outline-none transition-colors`}
                />
                {imageBase64 && (
                  <button 
                    onClick={() => setImageBase64(undefined)} 
                    className="absolute right-3 text-zinc-400 hover:text-red-500 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => onRunAnalysis(imageUrl, undefined, scanTier, undefined, imageBase64)}
                disabled={isLoading || (!imageUrl && !activeDemo && !imageBase64)}
                className="h-12 px-6 bg-zinc-900 hover:bg-black text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              >
                {isLoading ? "Running Scan..." : "Analyze Visual"}
              </button>
            </div>

            {/* Instant Demo Presets */}
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Instant Pre-Cached Showcases (0 API credits used):
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {isCached ? "CACHED RESULT: 0 API Credits" : `LIVE SEARCH: ${creditsUsed || 0} API Calls`}
                </span>
              </div>
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
        ) : (
          /* Tab 2: Comparison Mode with @beui/select Motion Dropdowns */
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product A Motion Select */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-mono uppercase text-zinc-500">
                  Product A (First Visual):
                </span>
                <Select
                  value={compareDemoA}
                  onValueChange={(val) => {
                    setCompareDemoA(val);
                    onRunAnalysis(undefined, val, scanTier, compareDemoB);
                  }}
                >
                  <SelectTrigger className="h-11 bg-zinc-50 border-zinc-300 text-zinc-900">
                    <SelectValue placeholder="Select Product A" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-zinc-200 rounded-xl shadow-lg">
                    {DEMO_PRESETS.map((demo) => (
                      <SelectItem key={demo.id} value={demo.id}>
                        {demo.name} ({demo.tag})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product B Motion Select */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-mono uppercase text-zinc-500">
                  Product B (Comparison Target):
                </span>
                <Select
                  value={compareDemoB}
                  onValueChange={(val) => {
                    setCompareDemoB(val);
                    onRunAnalysis(undefined, compareDemoA, scanTier, val);
                  }}
                >
                  <SelectTrigger className="h-11 bg-zinc-50 border-zinc-300 text-zinc-900">
                    <SelectValue placeholder="Select Product B" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-zinc-200 rounded-xl shadow-lg">
                    {DEMO_PRESETS.map((demo) => (
                      <SelectItem key={demo.id} value={demo.id}>
                        {demo.name} ({demo.tag})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <button
              onClick={() => onRunAnalysis(undefined, compareDemoA, scanTier, compareDemoB)}
              className="h-11 px-4 bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl cursor-pointer transition-colors"
            >
              Compare Products Side-by-Side
            </button>
          </div>
        )}
      </div>

      {/* Loading animation bar */}
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
  );
}
