"use client";

import HeroLogos from "./hero-logos";
import HeroText from "./hero-text";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-fit w-full">
      {/* HERO TOP - Background + Floating Logos */}
      <div className="hero relative h-dvh w-full overflow-hidden">
        <img
          className="masked-img"
          src="/images/hero/hero-image.jpg"
          alt="Hero Background"
          loading="eager"
        />

        <div className="hero-overlay" aria-hidden="true" />
        <HeroLogos />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full pt-32 md:pt-60 gap-16 md:gap-40">
        <HeroText text="See Anything. Research It Instantly." />
      </div>

      <div className="flex flex-col items-center justify-center my-30 gap-10">
        <h2 className="font-medium text-lg sm:text-2xl text-center text-zinc-900">
          You&apos;ve been researching products manually.
          <br /> Try autonomous visual intelligence.
        </h2>
        <div className="w-full max-w-md px-5 flex justify-center">
          <Link
            href="/app"
            className="w-full cursor-pointer sm:w-auto px-8 py-4 bg-linear-to-r from-[#FF2F00] via-[#F2723B] to-[#FF6B35] hover:from-[#FF2F00] hover:to-[#FF2F00] text-white font-semibold text-base sm:text-lg rounded-full shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 text-center flex items-center justify-center gap-2 group"
          >
            <span>Launch SnapIntel App</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
