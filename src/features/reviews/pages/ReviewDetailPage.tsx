import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import {
  bookmarkReview,
  deleteReview,
  getMyReviews,
  getReviewById,
  getReviewErrorMessage,
  getReviewLikeCount,
  likeReview,
  unbookmarkReview,
  unlikeReview,
  type Review,
} from "@/features/reviews/api/reviewsApi";

export default function ReviewDetailPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeSubmitting, setIsLikeSubmitting] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isBookmarkSubmitting, setIsBookmarkSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const id = Number(reviewId);

    if (!reviewId || Number.isNaN(id)) {
      setErrorMessage("발행된 독후감을 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    getReviewById(id)
      .then((data) => {
        if (!active) return;
        setReview(data);
        setLiked(false);
        setBookmarked(false);
        setLikeCount(data.likeCount ?? 0);
        getReviewLikeCount(id)
          .then((count) => {
            if (active) setLikeCount(count);
          })
          .catch(() => {
            // Keep the detail response count if the count endpoint is unavailable.
          });
        getMyReviews(0, 100)
          .then((myReviews) => {
            if (!active) return;
            setIsOwner(myReviews.content.some((myReview) => myReview.reviewId === data.reviewId));
          })
          .catch(() => {
            if (active) setIsOwner(false);
          });
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(getReviewErrorMessage(error));
        setReview(null);
        setIsOwner(false);
        setLiked(false);
        setBookmarked(false);
        setLikeCount(0);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reviewId]);

  const handleDeleteReview = async () => {
    const id = Number(reviewId);
    if (!reviewId || Number.isNaN(id) || isDeleteSubmitting) return;
    if (!window.confirm("독후감을 삭제하시겠습니까?")) return;

    setIsDeleteSubmitting(true);
    setErrorMessage("");
    try {
      await deleteReview(id);
      navigate("/users/me/reviews");
    } catch (error) {
      setErrorMessage(getReviewErrorMessage(error));
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const refreshLikeCount = async (id: number) => {
    try {
      setLikeCount(await getReviewLikeCount(id));
    } catch {
      // Keep the current optimistic count when refresh fails.
    }
  };

  const getErrorCode = (error: unknown) =>
    typeof error === "object" && error !== null && "response" in error
      ? (error as { response?: { data?: { code?: string } } }).response?.data?.code
      : undefined;

  const handleToggleLike = async () => {
    const id = Number(reviewId);
    if (!reviewId || Number.isNaN(id) || isLikeSubmitting) return;

    setIsLikeSubmitting(true);
    try {
      if (liked) {
        await unlikeReview(id);
        setLiked(false);
        setLikeCount((current) => Math.max(0, current - 1));
      } else {
        await likeReview(id);
        setLiked(true);
        setLikeCount((current) => current + 1);
      }
    } catch (error) {
      const code = getErrorCode(error);
      if (code === "REVIEW_LIKE_ALREADY_EXISTS") {
        setLiked(true);
        await refreshLikeCount(id);
      } else if (code === "REVIEW_LIKE_NOT_FOUND") {
        setLiked(false);
        await refreshLikeCount(id);
      } else {
        window.alert(getReviewErrorMessage(error));
      }
    } finally {
      setIsLikeSubmitting(false);
    }
  };

  const handleToggleBookmark = async () => {
    const id = Number(reviewId);
    if (!reviewId || Number.isNaN(id) || isBookmarkSubmitting) return;

    setIsBookmarkSubmitting(true);
    try {
      if (bookmarked) {
        await unbookmarkReview(id);
        setBookmarked(false);
      } else {
        await bookmarkReview(id);
        setBookmarked(true);
      }
    } catch (error) {
      const code = getErrorCode(error);
      if (code === "BOOKMARK_ALREADY_EXISTS") {
        setBookmarked(true);
      } else if (code === "BOOKMARK_NOT_FOUND") {
        setBookmarked(false);
      } else {
        window.alert(getReviewErrorMessage(error));
      }
    } finally {
      setIsBookmarkSubmitting(false);
    }
  };

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-40 md:pt-48">
          <Link
            to={review?.clubId ? `/clubs/${review.clubId}` : "/clubs"}
            className="inline-flex rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee"
          >
            모임으로 돌아가기
          </Link>

          {isLoading && <p className="mt-8 text-coffee/64">독후감을 불러오는 중입니다.</p>}
          {!isLoading && errorMessage && <p className="mt-8 font-bold text-caramel">{errorMessage}</p>}
          {!isLoading && !errorMessage && review && (
            <article className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 shadow-warm">
              {isOwner && (
                <div className="mb-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/reviews/${review.reviewId}/edit`)}
                    className="rounded-full border border-coffee/10 bg-white/70 px-4 py-2 text-sm font-bold text-coffee"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    disabled={isDeleteSubmitting}
                    className="rounded-full bg-caramel px-4 py-2 text-sm font-bold text-cream disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleteSubmitting ? "삭제 중..." : "삭제"}
                  </button>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-coffee/58">
                {review.writerNickname && <span>{review.writerNickname}</span>}
                {review.rating != null && <span>평점 {review.rating}</span>}
                {review.readPage != null && <span>읽은 페이지 {review.readPage}</span>}
                <button
                  type="button"
                  onClick={handleToggleLike}
                  disabled={isLikeSubmitting}
                  className="inline-flex items-center gap-1 text-xs font-bold text-coffee/58 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-pressed={liked}
                >
                  <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
                  <span>좋아요 {likeCount}</span>
                </button>
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  disabled={isBookmarkSubmitting}
                  className="inline-flex items-center gap-1 text-xs font-bold text-coffee/58 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-pressed={bookmarked}
                >
                  <span aria-hidden="true">{bookmarked ? "★" : "☆"}</span>
                  <span>{bookmarked ? "북마크됨" : "북마크"}</span>
                </button>
                {review.createdAt && <span className="text-coffee/48">{review.createdAt}</span>}
              </div>
              <h1 className="mt-5 text-3xl font-bold">{review.title}</h1>
              <p className="mt-6 whitespace-pre-wrap leading-7 text-coffee/72">{review.content}</p>
            </article>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
