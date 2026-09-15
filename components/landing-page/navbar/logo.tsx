import { motion } from "motion/react";
import Link from "next/link";

const Logo = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="flex gap-3 items-center"
  >
    <Link href="/" className="flex items-center gap-3">
      <span
        className="text-white font-semibold text-xl tracking-tight"
        style={{ fontFamily: "var(--font-figtree), system-ui, sans-serif" }}
      >
        SnapIntel
      </span>
    </Link>
  </motion.div>
);

export default Logo;
