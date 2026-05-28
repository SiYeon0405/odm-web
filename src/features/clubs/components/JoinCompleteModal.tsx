import type { Club } from "@/features/clubs/types";
import ModalShell from "@/features/clubs/components/ModalShell";

type JoinCompleteModalProps = {
  club: Club | null;
  onConfirm: () => void;
  onClose: () => void;
};

export default function JoinCompleteModal({ club, onConfirm, onClose }: JoinCompleteModalProps) {
  return (
    <ModalShell isOpen={club !== null} onClose={onClose} titleId="join-complete-title">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-caramel">Welcome</p>
      <h2 id="join-complete-title" className="mt-4 text-2xl font-bold text-espresso">
        모임 참가 완료
      </h2>
      <p className="mt-4 leading-7 text-coffee/68">
        <strong className="text-espresso">{club?.title}</strong> 독서모임 참여가 완료되었습니다.
      </p>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row-reverse">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-[linear-gradient(135deg,#3a251d,#81543b_58%,#b17e4b)] px-5 py-3.5 text-sm font-bold text-ivory transition hover:-translate-y-0.5 hover:brightness-105"
        >
          내 독서모임으로 이동
        </button>
      </div>
    </ModalShell>
  );
}
