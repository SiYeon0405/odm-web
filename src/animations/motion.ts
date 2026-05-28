import type { Variants } from "framer-motion";

export const softEase = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: softEase },
  },
};

export const gentleStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.12,
    },
  },
};

export const floatLoop = (delay = 0) => ({
  y: [0, -10, 0],
  rotate: [0, delay > 0.4 ? 1.2 : -1.2, 0],
  transition: {
    delay,
    duration: 5.6,
    ease: "easeInOut" as const,
    repeat: Number.POSITIVE_INFINITY,
  },
});
