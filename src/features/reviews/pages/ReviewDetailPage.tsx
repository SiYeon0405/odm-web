import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { getReviewById, getReviewErrorMessage, type Review } from "@/features/reviews/api/reviewsApi";

export default function ReviewDetailPage() {
  const { reviewId } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(getReviewErrorMessage(error));
        setReview(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reviewId]);

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
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-coffee/58">
                {review.writerNickname && <span>{review.writerNickname}</span>}
                {review.rating != null && <span>평점 {review.rating}</span>}
                {review.readPage != null && <span>읽은 페이지 {review.readPage}</span>}
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
