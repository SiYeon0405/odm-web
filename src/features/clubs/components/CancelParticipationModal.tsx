import ModalShell from "@/features/clubs/components/ModalShell";

type CancelParticipationModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function CancelParticipationModal({
  isOpen,
  isSubmitting,
  onCancel,
  onConfirm,
}: CancelParticipationModalProps) {
  return (
    <ModalShell isOpen={isOpen} onClose={onCancel} titleId="cancel-participation-title">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-caramel">Participation</p>
      <h2 id="cancel-participation-title" className="mt-4 text-xl font-bold leading-8 text-espresso">
        정말 이 독서모임 참가를 취소하시겠습니까?
      </h2>
      <p className="mt-3 leading-7 text-coffee/68">
        취소 후에는 내 독서모임 목록에서 제거됩니다.
      </p>
      <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-coffee/14 bg-ivory px-5 py-3.5 text-sm font-bold text-coffee transition duration-200 hover:bg-linen/42"
        >
          돌아가기
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="rounded-full border border-[#a9786b]/28 bg-[#c9a296]/44 px-5 py-3.5 text-sm font-bold text-[#70493f] shadow-[0_10px_22px_rgba(112,73,63,.10)] transition duration-200 hover:bg-[#b98a7d]/56 disabled:cursor-not-allowed disabled:opacity-55"
        >
          참가 취소하기
        </button>
      </div>
    </ModalShell>
  );
}
