import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { createUserRating, getRatingErrorMessage } from "@/features/ratings/api/ratingsApi";

export default function RatingCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clubId = useMemo(() => Number(searchParams.get("clubId")), [searchParams]);
  const targetUserId = useMemo(() => Number(searchParams.get("targetUserId")), [searchParams]);
  const [score, setScore] = useState("5");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const parsedScore = Number(score);
  const isValid =
    !Number.isNaN(clubId) &&
    clubId > 0 &&
    !Number.isNaN(targetUserId) &&
    targetUserId > 0 &&
    !Number.isNaN(parsedScore) &&
    Number.isInteger(parsedScore) &&
    parsedScore >= 1 &&
    parsedScore <= 5 &&
    comment.length <= 500;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");
    try {
      await createUserRating({
        clubId,
        targetUserId,
        score: parsedScore,
        comment: comment.trim() || undefined,
      });
      navigate("/ratings/me");
    } catch (error) {
      setMessage(getRatingErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-3xl px-4 pb-20 pt-40 md:pt-48">
          <Link to="/ratings/me" className="inline-flex rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee">
            내 평가로 돌아가기
          </Link>
          <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 shadow-warm">
            <h1 className="text-3xl font-bold">사용자 평가</h1>
            <p className="mt-3 text-sm font-bold text-coffee/58">
              모임 ID {Number.isNaN(clubId) ? "-" : clubId} · 대상 사용자 ID {Number.isNaN(targetUserId) ? "-" : targetUserId}
            </p>

            <label className="mt-6 block text-sm font-bold text-coffee/70" htmlFor="rating-score">
              점수
            </label>
            <input
              id="rating-score"
              type="number"
              min="1"
              max="5"
              value={score}
              onChange={(event) => setScore(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white/70 px-4 py-3 text-sm font-bold text-espresso outline-none transition focus:border-caramel"
            />

            <label className="mt-5 block text-sm font-bold text-coffee/70" htmlFor="rating-comment">
              코멘트
            </label>
            <textarea
              id="rating-comment"
              value={comment}
              maxLength={500}
              onChange={(event) => setComment(event.target.value)}
              className="mt-2 min-h-40 w-full rounded-2xl border border-coffee/10 bg-white/70 px-4 py-3 text-sm font-bold leading-7 text-espresso outline-none transition focus:border-caramel"
              placeholder="평가 내용을 입력하세요."
            />
            <p className="mt-2 text-right text-xs font-bold text-coffee/48">{comment.length}/500</p>

            {message && <p className="mt-4 font-bold text-caramel">{message}</p>}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="rounded-full bg-espresso px-5 py-3 text-sm font-bold text-cream disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "저장 중..." : "평가하기"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
