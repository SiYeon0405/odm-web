import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { getReportErrorMessage, getUserReports } from "@/features/reports/api/reportsApi";
import type { UserReportListResponse } from "@/features/reports/types";

export default function UserReportListPage() {
  const { userId } = useParams();
  const [reportList, setReportList] = useState<UserReportListResponse | null>(null);
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

    getUserReports(id)
      .then((data) => {
        if (active) setReportList(data);
      })
      .catch((error) => {
        if (active) setErrorMessage(getReportErrorMessage(error));
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
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-caramel">Reports</p>
          <h1 className="mt-2 text-3xl font-bold">사용자 피신고 목록</h1>
          {reportList && (
            <p className="mt-2 text-sm font-bold text-coffee/60">
              총 {reportList.totalReports}건 · 블랙리스트 {reportList.blacklistCount}회
            </p>
          )}

          {isLoading && <p className="mt-8 text-coffee/64">신고 목록을 불러오는 중입니다.</p>}
          {!isLoading && errorMessage && <p className="mt-8 font-bold text-caramel">{errorMessage}</p>}
          {!isLoading && !errorMessage && reportList?.reports.length === 0 && (
            <p className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 text-sm font-bold text-coffee/64">
              신고 내역이 없습니다.
            </p>
          )}
          {!isLoading && !errorMessage && reportList && reportList.reports.length > 0 && (
            <div className="mt-8 space-y-3">
              {reportList.reports.map((report) => (
                <article key={report.reportId} className="rounded-2xl border border-coffee/10 bg-ivory/70 p-5 shadow-warm">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-coffee/58">
                    <span>{report.status}</span>
                    <span>신고자 ID {report.reporterId}</span>
                    {report.createdAt && <span>{report.createdAt}</span>}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm font-bold leading-6 text-coffee/72">{report.reason}</p>
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
