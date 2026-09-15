import React from "react";
import FeatureMiniCard from "./mini-card";

const MiniCardSection: React.FC = () => {
  return (
    <div className="h-fit w-full flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8 relative -top-12 sm:-top-16 lg:-top-20 xl:-top-24 mb-12 sm:mb-16 lg:mb-20 px-2 sm:px-4">
      <FeatureMiniCard
        images={[
          "/images/features/feature11.jpg",
          "/images/features/feature12.jpg",
        ]}
        rotation="rotate-1 sm:rotate-2"
        title="Instant visual entity recognition powered by SerpApi Google Lens"
      />

      <FeatureMiniCard
        images={[
          "/images/features/feature21.webp",
          "/images/features/feature22.webp",
          "/images/features/feature23.png",
        ]}
        rotation="-rotate-1 sm:-rotate-3"
        title="Real-time price comparison across Amazon, Best Buy, and eBay"
      />

      <FeatureMiniCard
        images={["/images/logo/logo-icon.png"]}
        rotation="rotate-1 sm:rotate-4"
        title="Synthesized buying verdicts powered by free OpenRouter LLMs"
      />
    </div>
  );
};

export default MiniCardSection;
