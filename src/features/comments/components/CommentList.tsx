import type { Comment } from "@/features/comments/types";

type CommentListProps = {
  comments: Comment[];
  isLoading?: boolean;
  error?: string;
};

export default function CommentList({ comments, isLoading = false, error = "" }: CommentListProps) {
  if (isLoading) {
    return <p className="mt-4 text-sm text-coffee/64">댓글을 불러오는 중입니다.</p>;
  }

  if (error) {
    return <p className="mt-4 text-sm font-bold text-caramel">{error}</p>;
  }

  if (comments.length === 0) {
    return <p className="mt-4 text-sm text-coffee/64">등록된 댓글이 없습니다.</p>;
  }

  return (
    <div className="mt-5 space-y-3">
      {comments.map((comment) => (
        <article key={comment.commentId} className="rounded-2xl border border-coffee/10 bg-ivory/70 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-coffee/50">
            <span>{comment.writerNickname || "작성자"}</span>
            {comment.createdAt && <span>{comment.createdAt}</span>}
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-coffee/72">{comment.content}</p>
        </article>
      ))}
    </div>
  );
}
