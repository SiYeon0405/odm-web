import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { getReviewErrorMessage, getReviews, type Review, type ReviewPage } from "@/features/reviews/api/reviewsApi";

const PAGE_SIZE = 20;

export default function ReviewListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [reviewsPage, setReviewsPage] = useState<ReviewPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setErrorMessage("");
    getReviews(page, PAGE_SIZE)
      .then((data) => {
        if (!active) return;
        setReviewsPage(data);
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(getReviewErrorMessage(error));
        setReviewsPage(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page]);

  const reviews = (reviewsPage?.content ?? []).filter((review) => !review.status || review.status === "PUBLISHED");
  const totalPages = reviewsPage?.totalPages ?? 0;

  const openReview = (review: Review) => {
    if (review.reviewId) navigate(`/reviews/${review.reviewId}`);
  };

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-5xl px-4 pb-20 pt-40 md:pt-48">
          <h1 className="text-3xl font-bold">공개 독후감</h1>

          {isLoading && <p className="mt-8 text-coffee/64">독후감을 불러오는 중입니다.</p>}
          {!isLoading && errorMessage && <p className="mt-8 font-bold text-caramel">{errorMessage}</p>}
          {!isLoading && !errorMessage && reviews.length === 0 && (
            <p className="mt-8 text-coffee/64">공개된 독후감이 없습니다.</p>
          )}
          {!isLoading && !errorMessage && reviews.length > 0 && (
            <div className="mt-8 grid gap-5">
              {reviews.map((review) => (
                <button
                  key={review.reviewId}
                  type="button"
                  onClick={() => openReview(review)}
                  className="rounded-2xl border border-coffee/10 bg-ivory/70 p-5 text-left shadow-warm transition hover:-translate-y-0.5 hover:bg-ivory"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-coffee/58">
                    {review.writerNickname && <span>{review.writerNickname}</span>}
                    {review.rating != null && <span>평점 {review.rating}</span>}
                    {review.readPage != null && <span>읽은 페이지 {review.readPage}</span>}
                    {review.createdAt && <span>{review.createdAt}</span>}
                  </div>
                  <h2 className="mt-3 text-xl font-bold text-espresso">{review.title}</h2>
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
              disabled={page === 0 || isLoading}
              className="rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee disabled:cursor-not-allowed disabled:opacity-50"
            >
              이전
            </button>
            <span className="text-sm font-bold text-coffee/70">
              {page + 1} / {Math.max(totalPages, 1)}
            </span>
            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={isLoading || totalPages === 0 || page + 1 >= totalPages}
              className="rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee disabled:cursor-not-allowed disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
