import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import CommentForm from "@/features/comments/components/CommentForm";
import CommentList from "@/features/comments/components/CommentList";
import { createComment, getCommentErrorMessage, getCommentsByDiscussionId } from "@/features/comments/api/commentsApi";
import type { Comment } from "@/features/comments/types";
import { getDiscussionById, getDiscussionErrorMessage } from "@/features/discussions/api/discussionsApi";
import type { Discussion } from "@/features/discussions/types";

export default function DiscussionDetailPage() {
  const { discussionId } = useParams();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentsErrorMessage, setCommentsErrorMessage] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const id = Number(discussionId);

    if (!discussionId || Number.isNaN(id)) {
      setErrorMessage("잘못된 게시글입니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    getDiscussionById(id)
      .then((data) => {
        if (!active) return;
        setDiscussion(data);
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(getDiscussionErrorMessage(error));
        setDiscussion(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [discussionId]);

  const loadComments = async (id: number) => {
    setIsCommentsLoading(true);
    setCommentsErrorMessage("");
    try {
      const commentsPage = await getCommentsByDiscussionId(id, { page: 0, size: 20 });
      setComments(commentsPage.content);
    } catch (error) {
      setCommentsErrorMessage(getCommentErrorMessage(error));
      setComments([]);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  useEffect(() => {
    const id = Number(discussionId);
    if (!discussionId || Number.isNaN(id)) return;

    loadComments(id);
  }, [discussionId]);

  const handleCreateComment = async (content: string) => {
    const id = Number(discussionId);
    if (!discussionId || Number.isNaN(id) || isCommentSubmitting) return;

    setIsCommentSubmitting(true);
    setCommentsErrorMessage("");
    try {
      await createComment(id, content);
      await loadComments(id);
    } catch (error) {
      setCommentsErrorMessage(getCommentErrorMessage(error));
      throw error;
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-40 md:pt-48">
          <Link
            to={discussion?.clubId ? `/clubs/${discussion.clubId}/discussions` : "/clubs"}
            className="inline-flex rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee"
          >
            목록으로 돌아가기
          </Link>

          {isLoading && <p className="mt-8 text-coffee/64">게시글을 불러오는 중입니다.</p>}
          {!isLoading && errorMessage && <p className="mt-8 font-bold text-caramel">{errorMessage}</p>}
          {!isLoading && !errorMessage && !discussion && (
            <p className="mt-8 text-coffee/64">게시글을 찾을 수 없습니다.</p>
          )}
          {!isLoading && !errorMessage && discussion && (
            <article className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 shadow-warm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-coffee/58">댓글 {discussion.commentCount ?? 0}</span>
                <span className="text-xs font-bold text-coffee/58">좋아요 {discussion.likeCount ?? 0}</span>
                {discussion.createdAt && (
                  <span className="text-xs font-bold text-coffee/48">{discussion.createdAt}</span>
                )}
              </div>
              <h1 className="mt-5 text-3xl font-bold">{discussion.title}</h1>
              <p className="mt-6 whitespace-pre-wrap leading-7 text-coffee/72">{discussion.content}</p>
            </article>
          )}
          {!isLoading && !errorMessage && discussion && (
            <section className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 shadow-warm">
              <h2 className="text-xl font-bold">댓글</h2>
              <CommentForm onSubmit={handleCreateComment} isSubmitting={isCommentSubmitting} />
              <CommentList comments={comments} isLoading={isCommentsLoading} error={commentsErrorMessage} />
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
