import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { createReview, getReviewErrorMessage, publishReview } from "@/features/reviews/api/reviewsApi";

export default function ReviewCreatePage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [readPage, setReadPage] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdReviewId, setCreatedReviewId] = useState<number | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = Number(clubId);
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const parsedRating = rating === "" ? null : Number(rating);
    const parsedReadPage = readPage === "" ? null : Number(readPage);

    if (
      !clubId ||
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
    setCreatedReviewId(null);

    try {
      const createdReview = await createReview({
        clubId: id,
        title: trimmedTitle,
        content: trimmedContent,
        rating: parsedRating,
        readPage: parsedReadPage,
      });
      setCreatedReviewId(createdReview.reviewId);

      try {
        const publishedReview = await publishReview(createdReview.reviewId);
        navigate(`/reviews/${publishedReview.reviewId || createdReview.reviewId}`);
      } catch (error) {
        setErrorMessage(`독후감은 생성되었지만 발행하지 못했습니다. ${getReviewErrorMessage(error)}`);
      }
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
            to={clubId ? `/clubs/${clubId}` : "/clubs"}
            className="inline-flex rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee"
          >
            모임으로 돌아가기
          </Link>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 shadow-warm"
          >
            <h1 className="text-3xl font-bold">독후감 작성</h1>
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

            {createdReviewId && (
              <p className="mt-4 font-bold text-coffee/70">독후감이 생성되었습니다. 리뷰 ID: {createdReviewId}</p>
            )}
            {errorMessage && <p className="mt-4 font-bold text-caramel">{errorMessage}</p>}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Link
                to={clubId ? `/clubs/${clubId}` : "/clubs"}
                className="rounded-full border border-coffee/10 bg-white/70 px-5 py-3 text-sm font-bold text-coffee"
              >
                목록으로 돌아가기
              </Link>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="rounded-full bg-espresso px-5 py-3 text-sm font-bold text-cream disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "작성 중..." : "작성하고 발행하기"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
