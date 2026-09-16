/* eslint-disable @next/next/no-img-element */
"use client";

import HeroLogos from "./hero-logos";
import HeroText from "./hero-text";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen w-full overflow-hidden flex flex-col justify-center py-20">
      {/* HERO BACKGROUND - Strictly confined to hero section bounds */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <img
          className="masked-img"
          src="/images/hero/hero-image.jpg"
          alt="Hero Background"
          loading="eager"
        />

        <div className="hero-overlay" aria-hidden="true" />
        <HeroLogos />
      </div>

      {/* Main Headline */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full pt-16 md:pt-20 gap-8">
        <HeroText text="Point. Scan. Decide." />
      </div>

      {/* Subtext and Liquid Metal Button lifted up */}
      <div className="relative z-10 flex flex-col items-center justify-center my-6 md:my-8 gap-5">
        <h2 className="font-medium text-base sm:text-xl md:text-2xl text-center text-zinc-800 max-w-xl px-4">
          Turn any product photo into an instant market intelligence dossier.
          <br /> Powered by multi-engine SerpApi orchestration.
        </h2>
        <div className="flex justify-center px-4">
          <Link href="/app" className="inline-block cursor-pointer">
            <LiquidMetalButton
              size="lg"
              borderWidth={3}
              icon={
                <ArrowRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              }
              metalConfig={{
                colorBack: "#1c1917",
                colorTint: "#f97316",
                speed: 0.6,
                repetition: 4,
                distortion: 0.15,
              }}
            >
              <span className="text-base sm:text-lg font-semibold tracking-tight">
                Launch SnapIntel
              </span>
            </LiquidMetalButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
