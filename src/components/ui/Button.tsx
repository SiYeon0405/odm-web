import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "quiet";

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  className?: string;
};

const MotionLink = motion.create(Link);

const variants: Record<ButtonVariant, string> = {
  primary:
    "home-button-primary bg-[linear-gradient(135deg,#3a251d_0%,#81543b_48%,#d7ad72_100%)] text-ivory shadow-[0_22px_54px_rgba(67,42,29,.32)]",
  secondary:
    "home-button-secondary border border-coffee/16 bg-ivory/82 text-espresso shadow-warm backdrop-blur-xl",
  quiet: "home-button-quiet border border-coffee/10 bg-white/44 text-coffee backdrop-blur-xl",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <MotionLink
      to={href}
      className={`home-button inline-flex min-h-14 items-center justify-center rounded-full px-7 py-3 text-base font-bold leading-none ${variants[variant]} ${className}`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </MotionLink>
  );
}
