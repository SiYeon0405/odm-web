import { motion } from "framer-motion";
import type { ComponentProps } from "react";

type JoinClubButtonProps = ComponentProps<typeof motion.button> & {
  isJoined?: boolean;
  isSubmitting?: boolean;
};

export default function JoinClubButton({
  isJoined = false,
  isSubmitting = false,
  className,
  disabled,
  ...buttonProps
}: JoinClubButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={isSubmitting || disabled}
      className={
        className ??
        "whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#3a251d_0%,#81543b_58%,#b17e4b_100%)] px-4 py-3 text-xs font-bold text-ivory shadow-[0_12px_26px_rgba(67,42,29,.24)] transition-shadow hover:shadow-[0_18px_34px_rgba(67,42,29,.34)] disabled:cursor-not-allowed disabled:opacity-70"
      }
      whileHover={isSubmitting ? undefined : { y: -2 }}
      whileTap={isSubmitting ? undefined : { scale: 0.98 }}
      {...buttonProps}
    >
      {isSubmitting ? "처리 중..." : isJoined ? "탈퇴하기" : "참여하기"}
    </motion.button>
  );
}
