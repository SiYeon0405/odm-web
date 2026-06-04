import type { Recruitment, RecruitmentStatus } from "@/features/recruitments/types";

type RecruitmentCardProps = {
  recruitment: Recruitment;
  onClick: () => void;
};

const STATUS_LABELS: Record<RecruitmentStatus, string> = {
  RECRUITING: "모집중",
  CLOSED: "모집마감",
  COMPLETED: "완료",
};

export default function RecruitmentCard({ recruitment, onClick }: RecruitmentCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className="rounded-2xl border border-coffee/10 bg-ivory/70 p-5 shadow-warm transition hover:-translate-y-1 hover:shadow-premium"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-linen/60 px-3 py-1 text-xs font-bold text-coffee">
          {STATUS_LABELS[recruitment.recruitmentStatus]}
        </span>
        <span className="text-xs font-bold text-coffee/58">조회 {recruitment.viewCount ?? 0}</span>
      </div>
      <h2 className="mt-4 text-xl font-bold text-espresso">{recruitment.title}</h2>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-coffee/70">{recruitment.description}</p>
      {recruitment.createdAt && <p className="mt-4 text-xs font-bold text-coffee/48">{recruitment.createdAt}</p>}
    </article>
  );
}
