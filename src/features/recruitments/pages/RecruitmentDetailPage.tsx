import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { getRecruitmentById, getRecruitmentErrorMessage } from "@/features/recruitments/api/recruitmentsApi";
import type { Recruitment, RecruitmentStatus } from "@/features/recruitments/types";

const STATUS_LABELS: Record<RecruitmentStatus, string> = {
  RECRUITING: "모집중",
  CLOSED: "모집마감",
  COMPLETED: "완료",
};

export default function RecruitmentDetailPage() {
  const { recruitmentId } = useParams();
  const [recruitment, setRecruitment] = useState<Recruitment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    const id = Number(recruitmentId);

    if (!recruitmentId || Number.isNaN(id)) {
      setErrorMessage("잘못된 모집글입니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    getRecruitmentById(id)
      .then((data) => {
        if (!active) return;
        setRecruitment(data);
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(getRecruitmentErrorMessage(error));
        setRecruitment(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [recruitmentId]);

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-40 md:pt-48">
          <Link
            to="/recruitments"
            className="inline-flex rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee"
          >
            목록으로 돌아가기
          </Link>

          {isLoading && <p className="mt-8 text-coffee/64">모집글을 불러오는 중입니다.</p>}
          {!isLoading && errorMessage && <p className="mt-8 font-bold text-caramel">{errorMessage}</p>}
          {!isLoading && !errorMessage && !recruitment && (
            <p className="mt-8 text-coffee/64">모집글을 찾을 수 없습니다.</p>
          )}
          {!isLoading && !errorMessage && recruitment && (
            <article className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 shadow-warm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-linen/60 px-3 py-1 text-xs font-bold text-coffee">
                  {STATUS_LABELS[recruitment.recruitmentStatus]}
                </span>
                <span className="text-xs font-bold text-coffee/58">조회 {recruitment.viewCount ?? 0}</span>
                {recruitment.createdAt && (
                  <span className="text-xs font-bold text-coffee/48">{recruitment.createdAt}</span>
                )}
              </div>
              <h1 className="mt-5 text-3xl font-bold">{recruitment.title}</h1>
              <p className="mt-6 whitespace-pre-wrap leading-7 text-coffee/72">{recruitment.description}</p>
            </article>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
