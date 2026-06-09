import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { getRatingErrorMessage, getUserRatings } from "@/features/ratings/api/ratingsApi";
import type { UserRatingListResponse } from "@/features/ratings/types";

export default function UserRatingListPage() {
  const { userId } = useParams();
  const [ratingList, setRatingList] = useState<UserRatingListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    const id = Number(userId);

    if (!userId || Number.isNaN(id)) {
      setErrorMessage("사용자를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    getUserRatings(id)
      .then((data) => {
        if (active) setRatingList(data);
      })
      .catch((error) => {
        if (active) setErrorMessage(getRatingErrorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-40 md:pt-48">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-caramel">Ratings</p>
          <h1 className="mt-2 text-3xl font-bold">사용자 평가</h1>
          {ratingList && (
            <p className="mt-2 text-sm font-bold text-coffee/60">
              평균 {ratingList.averageScore}점 · 총 {ratingList.totalRatings}개
            </p>
          )}

          {isLoading && <p className="mt-8 text-coffee/64">평가를 불러오는 중입니다.</p>}
          {!isLoading && errorMessage && <p className="mt-8 font-bold text-caramel">{errorMessage}</p>}
          {!isLoading && !errorMessage && ratingList?.ratings.length === 0 && (
            <p className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 text-sm font-bold text-coffee/64">
              사용자 평가가 없습니다.
            </p>
          )}
          {!isLoading && !errorMessage && ratingList && ratingList.ratings.length > 0 && (
            <div className="mt-8 space-y-3">
              {ratingList.ratings.map((rating) => (
                <article key={rating.ratingId} className="rounded-2xl border border-coffee/10 bg-ivory/70 p-5 shadow-warm">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-coffee/58">
                    <span>평점 {rating.score}</span>
                    <span>작성자 ID {rating.reviewerId}</span>
                    {rating.createdAt && <span>{rating.createdAt}</span>}
                  </div>
                  {rating.comment && <p className="mt-3 whitespace-pre-wrap text-sm font-bold leading-6 text-coffee/72">{rating.comment}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
