import ModalShell from "@/features/clubs/components/ModalShell";

type LoginRequiredModalProps = {
  isOpen: boolean;
  onLogin: () => void;
  onClose: () => void;
};

export default function LoginRequiredModal({ isOpen, onLogin, onClose }: LoginRequiredModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleId="login-required-title">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-caramel">ODM clubs</p>
      <h2 id="login-required-title" className="mt-4 text-2xl font-bold text-espresso">
        로그인 필요
      </h2>
      <p className="mt-4 leading-7 text-coffee/68">독서모임에 참여하려면 로그인이 필요합니다.</p>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row-reverse">
        <button
          type="button"
          onClick={onLogin}
          className="rounded-full bg-espresso px-5 py-3.5 text-sm font-bold text-ivory transition hover:-translate-y-0.5 hover:bg-coffee"
        >
          로그인 하기
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-coffee/12 bg-white/52 px-5 py-3.5 text-sm font-bold text-coffee transition hover:bg-paper"
        >
          닫기
        </button>
      </div>
    </ModalShell>
  );
}
