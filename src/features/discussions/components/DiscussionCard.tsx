import type { Discussion } from "@/features/discussions/types";

type DiscussionCardProps = {
  discussion: Discussion;
  onClick: () => void;
};

export default function DiscussionCard({ discussion, onClick }: DiscussionCardProps) {
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
        <span className="text-xs font-bold text-coffee/58">댓글 {discussion.commentCount ?? 0}</span>
        <span className="text-xs font-bold text-coffee/58">좋아요 {discussion.likeCount ?? 0}</span>
      </div>
      <h2 className="mt-4 text-xl font-bold text-espresso">{discussion.title}</h2>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-coffee/70">{discussion.content}</p>
      {discussion.createdAt && <p className="mt-4 text-xs font-bold text-coffee/48">{discussion.createdAt}</p>}
    </article>
  );
}
