import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { createUserReport, getReportErrorMessage } from "@/features/reports/api/reportsApi";

export default function ReportCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clubId = useMemo(() => Number(searchParams.get("clubId")), [searchParams]);
  const targetUserId = useMemo(() => Number(searchParams.get("targetUserId")), [searchParams]);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const trimmedReason = reason.trim();
  const isValid =
    !Number.isNaN(clubId) &&
    clubId > 0 &&
    !Number.isNaN(targetUserId) &&
    targetUserId > 0 &&
    trimmedReason.length > 0 &&
    reason.length <= 500;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");
    try {
      await createUserReport({
        clubId,
        targetUserId,
        reason: trimmedReason,
      });
      navigate("/reports/me");
    } catch (error) {
      setMessage(getReportErrorMessage(error));
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
          <Link to="/reports/me" className="inline-flex rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee">
            내 신고로 돌아가기
          </Link>
          <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 shadow-warm">
            <h1 className="text-3xl font-bold">사용자 신고</h1>
            <p className="mt-3 text-sm font-bold text-coffee/58">
              모임 ID {Number.isNaN(clubId) ? "-" : clubId} · 대상 사용자 ID {Number.isNaN(targetUserId) ? "-" : targetUserId}
            </p>

            <label className="mt-6 block text-sm font-bold text-coffee/70" htmlFor="report-reason">
              신고 사유
            </label>
            <textarea
              id="report-reason"
              value={reason}
              maxLength={500}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 min-h-40 w-full rounded-2xl border border-coffee/10 bg-white/70 px-4 py-3 text-sm font-bold leading-7 text-espresso outline-none transition focus:border-caramel"
              placeholder="신고 사유를 입력하세요."
            />
            <p className="mt-2 text-right text-xs font-bold text-coffee/48">{reason.length}/500</p>

            {message && <p className="mt-4 font-bold text-caramel">{message}</p>}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="rounded-full bg-espresso px-5 py-3 text-sm font-bold text-cream disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "접수 중..." : "신고하기"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
