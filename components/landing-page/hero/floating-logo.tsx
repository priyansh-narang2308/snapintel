"use client";

import { motion } from "motion/react";

interface FloatingLogoProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  animateY?: number;
  animateX?: number;
  rotate?: number;
  duration?: number;
  initialShadow?: string;
  deepShadow?: string;
}

const FloatingLogo = ({
  src,
  alt,
  className,
  style,
  animateY = 20,
  animateX = 8,
  rotate = 8,
  duration = 5,
}: FloatingLogoProps) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={`${className} filter drop-shadow-xl`}
      style={style}
      initial={{
        rotate: -rotate,
      }}
      animate={{
        y: [0, -animateY, 0],
        x: [0, animateX, 0],
        rotate: [-rotate, -rotate + 6, -rotate],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

export default FloatingLogo;
