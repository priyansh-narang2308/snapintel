import { SerpApiAnalysisResult, ScanTier } from "@/lib/serpapi";
import { OpenRouterVerdict } from "@/lib/openrouter";

export interface ComparisonData {
  itemB: {
    serp: SerpApiAnalysisResult;
    verdict: OpenRouterVerdict;
  };
  tradeoff: {
    priceWinner: "A" | "B";
    priceDifference: string;
    demandWinner: "A" | "B";
    reviewWinner: "A" | "B";
    recommendation: string;
  };
}

export interface DossierData {
  serp: SerpApiAnalysisResult;
  verdict: OpenRouterVerdict;
  comparison?: ComparisonData | null;
}

export interface DemoPreset {
  id: string;
  name: string;
  tag: string;
  image: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
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

export type { ScanTier };
