import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import {
  getReviewById,
  getReviewErrorMessage,
  updateReview,
  type Review,
} from "@/features/reviews/api/reviewsApi";

export default function ReviewEditPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<Review | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("");
  const [readPage, setReadPage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        setTitle(data.title);
        setContent(data.content);
        setRating(data.rating == null ? "" : String(data.rating));
        setReadPage(data.readPage == null ? "" : String(data.readPage));
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = Number(reviewId);
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const parsedRating = rating === "" ? null : Number(rating);
    const parsedReadPage = readPage === "" ? null : Number(readPage);

    if (
      !reviewId ||
      Number.isNaN(id) ||
      !trimmedTitle ||
      !trimmedContent ||
      (parsedRating !== null && (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5)) ||
      (parsedReadPage !== null && (Number.isNaN(parsedReadPage) || parsedReadPage < 0)) ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await updateReview(id, {
        title: trimmedTitle,
        content: trimmedContent,
        rating: parsedRating,
        readPage: parsedReadPage,
      });
      navigate(`/reviews/${id}`);
    } catch (error) {
      setErrorMessage(getReviewErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = isSubmitting || !title.trim() || !content.trim();

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-40 md:pt-48">
          <Link
            to={reviewId ? `/reviews/${reviewId}` : "/reviews"}
            className="inline-flex rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee"
          >
            상세로 돌아가기
          </Link>

          {isLoading && <p className="mt-8 text-coffee/64">독후감을 불러오는 중입니다.</p>}
          {!isLoading && errorMessage && !review && <p className="mt-8 font-bold text-caramel">{errorMessage}</p>}
          {!isLoading && review && (
            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 shadow-warm"
            >
              <h1 className="text-3xl font-bold">독후감 수정</h1>
              <label className="mt-6 block text-sm font-bold text-coffee/70" htmlFor="review-title">
                제목
              </label>
              <input
                id="review-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white/70 px-4 py-3 text-sm font-bold text-espresso outline-none transition focus:border-caramel"
                placeholder="독후감 제목을 입력하세요."
              />

              <label className="mt-5 block text-sm font-bold text-coffee/70" htmlFor="review-content">
                내용
              </label>
              <textarea
                id="review-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="mt-2 min-h-56 w-full rounded-2xl border border-coffee/10 bg-white/70 px-4 py-3 text-sm font-bold leading-7 text-espresso outline-none transition focus:border-caramel"
                placeholder="독후감 내용을 입력하세요."
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-coffee/70" htmlFor="review-rating">
                  평점
                  <input
                    id="review-rating"
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(event) => setRating(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white/70 px-4 py-3 text-sm font-bold text-espresso outline-none transition focus:border-caramel"
                  />
                </label>
                <label className="block text-sm font-bold text-coffee/70" htmlFor="review-read-page">
                  읽은 페이지
                  <input
                    id="review-read-page"
                    type="number"
                    min="0"
                    value={readPage}
                    onChange={(event) => setReadPage(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white/70 px-4 py-3 text-sm font-bold text-espresso outline-none transition focus:border-caramel"
                  />
                </label>
              </div>

              {errorMessage && <p className="mt-4 font-bold text-caramel">{errorMessage}</p>}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="rounded-full bg-espresso px-5 py-3 text-sm font-bold text-cream disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "저장 중..." : "저장하기"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
