"use client";

import HeroLogos from "./hero-logos";
import { motion } from "motion/react";
import HeroText from "./hero-text";
import Link from "next/link";
import WaitlistForm from "../waitlist/waitlist-form";

const SOCIALS = [
  {
    title: "Twitter",
    icon: "/images/socials/twitter.png",
    link: "https://x.com/athrix_codes",
  },
  {
    title: "GitHub",
    icon: "/images/socials/github.png",
    link: "https://github.com/Atharvsinh-codez/Project-1",
  },
];

const Hero = () => {
  return (
    <section className="relative h-fit w-full">
      {/* HERO TOP - Background + Floating Logos */}
      <div className="hero relative h-dvh w-full overflow-hidden">
        {/* Background image */}
        <img
          className="masked-img"
          src="/images/hero/hero-image.jpg"
          alt="Hero Background"
          loading="eager"
        />

        {/* Mask/Overlay */}
        <div className="hero-overlay" aria-hidden="true" />

        {/* Floating platform logos */}
        <HeroLogos />
      </div>

      {/* HERO CONTENT BELOW */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full pt-32 md:pt-60 gap-16 md:gap-40">
        <HeroText text="Creators Aren't Content, They're Assets" />
      </div>

      <div className="flex flex-col items-center justify-center my-30 gap-10">
        <h2 className="font-medium text-lg sm:text-2xl text-center">
          You&apos;ve been investing in creators emotionally.
          <br /> Try financially.
        </h2>
        <div className="w-full max-w-2xl px-5">
          <WaitlistForm variant="hero" showCounter={true} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
