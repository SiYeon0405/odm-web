import { motion } from "framer-motion";
import type { MouseEventHandler } from "react";

type JoinClubButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function JoinClubButton({ onClick }: JoinClubButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#3a251d_0%,#81543b_58%,#b17e4b_100%)] px-4 py-3 text-xs font-bold text-ivory shadow-[0_12px_26px_rgba(67,42,29,.24)] transition-shadow hover:shadow-[0_18px_34px_rgba(67,42,29,.34)]"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      모임 참가하기
    </motion.button>
  );
}
