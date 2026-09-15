import React from "react";
import FeaturesHeader from "./features-header";
import FeatureCard from "./feature-card";
import MiniCardSection from "./mini-card-section";
import Tagline from "./tagline";

interface FeatureItem {
  title: string;
  desc: string;
  img: string;
  icon: string;
}

const FEATURES_DATA: FeatureItem[] = [
  {
    title: "Google Lens Visual Discovery",
    desc: "Instant computer-vision recognition. Pinpoint the exact model, SKU, or landmark from any uploaded image or camera snapshot with zero text required.",
    img: "/images/features/bitcoin.png",
    icon: "/images/features/earning.png",
  },
  {
    title: "Multi-Store Price Arbitrage",
    desc: "Google Shopping crawls real-time merchant inventories, finding the lowest available price, discount spreads, and delivery speeds across the web.",
    img: "/images/features/portfolio.png",
    icon: "/images/features/trading.png",
  },
  {
    title: "Web Sentiment & Defect Alerts",
    desc: "Deep Google Search synthesis scans Reddit, community teardowns, and safety records to flag known batch flaws and upcoming revision cycles.",
    img: "/images/features/ipo.png",
    icon: "/images/features/rocket.png",
  },
  {
    title: "Demand Velocity & AI Verdict",
    desc: "Google Trends data merged with OpenRouter AI reasoning delivers a definitive Buy, Wait, or Avoid recommendation with grounded proof.",
    img: "/images/features/tbc.png",
    icon: "/images/features/curve.png",
  },
];

const Features: React.FC = () => {
  return (
    <section className="px-2 sm:px-4 lg:px-6 w-full mt-10 sm:mt-16 lg:mt-20">
      <div className="h-fit w-full bg-[#0F0F0F] rounded-2xl sm:rounded-3xl lg:rounded-4xl px-4 sm:px-8 lg:px-12 xl:px-20">
        <FeaturesHeader />

        {/* Grid of Feature Cards */}
        <div className="border-4 sm:border-6 border-zinc-900 rounded-2xl sm:rounded-3xl lg:rounded-4xl grid grid-cols-1 lg:grid-cols-2 w-full mb-6 sm:mb-8 lg:mb-10 p-1 sm:p-2 gap-1 sm:gap-2">
          {FEATURES_DATA.map((item, idx) => (
            <FeatureCard key={idx} {...item} />
          ))}
        </div>

        {/* Center Showcase */}
        <Tagline />

        {/* Mini Feature Cards */}
        <MiniCardSection />
      </div>
    </section>
  );
};

export default Features;
