import { motion } from "framer-motion";

export default function Button({ children, variant = "primary", className = "" }) {
  const styles =
    variant === "primary"
      ? "bg-espresso text-ivory shadow-soft hover:bg-coffee"
      : "border border-coffee/12 bg-ivory/46 text-espresso shadow-warm backdrop-blur-xl hover:border-coffee/22 hover:bg-ivory/72";

  return (
    <motion.a
      href="#start"
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-bold tracking-[-0.01em] transition duration-300 ${styles} ${className}`}
      whileHover={{ y: -3, scale: 1.018 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.a>
  );
}
