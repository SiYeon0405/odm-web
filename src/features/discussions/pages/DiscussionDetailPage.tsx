import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import CommentForm from "@/features/comments/components/CommentForm";
import CommentList from "@/features/comments/components/CommentList";
import { createComment, getCommentErrorMessage, getCommentsByDiscussionId } from "@/features/comments/api/commentsApi";
import type { Comment } from "@/features/comments/types";
import {
  deleteDiscussion,
  getDiscussionById,
  getDiscussionErrorMessage,
  likeDiscussion,
  unlikeDiscussion,
} from "@/features/discussions/api/discussionsApi";
import type { Discussion } from "@/features/discussions/types";

export default function DiscussionDetailPage() {
  const { discussionId } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentsErrorMessage, setCommentsErrorMessage] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isLikeSubmitting, setIsLikeSubmitting] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

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
        setLiked(false);
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
      try {
        const updatedDiscussion = await getDiscussionById(id);
        setDiscussion(updatedDiscussion);
      } catch {
        // Keep the current discussion header if refreshing the count fails.
      }
    } catch (error) {
      setCommentsErrorMessage(getCommentErrorMessage(error));
      throw error;
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleToggleLike = async () => {
    const id = Number(discussionId);
    if (!discussionId || Number.isNaN(id) || isLikeSubmitting) return;

    setIsLikeSubmitting(true);
    try {
      if (liked) {
        await unlikeDiscussion(id);
      } else {
        await likeDiscussion(id);
      }

      const updatedDiscussion = await getDiscussionById(id);
      setDiscussion(updatedDiscussion);
      setLiked((currentLiked) => !currentLiked);
    } catch {
      // Keep the current server-rendered like count on failed like requests.
    } finally {
      setIsLikeSubmitting(false);
    }
  };

  const handleDeleteDiscussion = async () => {
    const id = Number(discussionId);
    if (!discussionId || Number.isNaN(id) || isDeleteSubmitting) return;
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

    setIsDeleteSubmitting(true);
    setErrorMessage("");
    try {
      await deleteDiscussion(id);
      if (discussion?.clubId) {
        navigate(`/clubs/${discussion.clubId}/discussions`);
      } else {
        navigate(-1);
      }
    } catch (error) {
      setErrorMessage(getDiscussionErrorMessage(error));
    } finally {
      setIsDeleteSubmitting(false);
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
              <div className="mb-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/discussions/${discussion.discussionId}/edit`)}
                  className="rounded-full border border-coffee/10 bg-white/70 px-4 py-2 text-sm font-bold text-coffee"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={handleDeleteDiscussion}
                  disabled={isDeleteSubmitting}
                  className="rounded-full bg-caramel px-4 py-2 text-sm font-bold text-cream disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleteSubmitting ? "삭제 중..." : "삭제"}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-coffee/58">댓글 {discussion.commentCount ?? 0}</span>
                <button
                  type="button"
                  onClick={handleToggleLike}
                  disabled={isLikeSubmitting}
                  className="inline-flex items-center gap-1 text-xs font-bold text-coffee/58 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-pressed={liked}
                >
                  <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
                  <span>좋아요 {discussion.likeCount ?? 0}</span>
                </button>
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
