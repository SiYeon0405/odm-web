import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import Button from "@/components/ui/Button";
import CancelParticipationModal from "@/features/clubs/components/CancelParticipationModal";
import { fetchClubById } from "@/features/clubs/api/clubsApi";
import type { Club } from "@/features/clubs/types";
import { cancelClubParticipation } from "@/features/my-clubs/api/myClubsApi";

export default function ClubDetailPage() {
  const { clubId } = useParams();
  const [club, setClub] = useState<Club | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [hasCancelled, setHasCancelled] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    let active = true;
    const id = Number(clubId);

    fetchClubById(id).then((data) => {
      if (active) {
        setClub(data);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [clubId]);

  useEffect(() => {
    if (!toastVisible) return;

    const timeoutId = window.setTimeout(() => setToastVisible(false), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [toastVisible]);

  const handleCancelParticipation = async () => {
    if (!club || club.hasStarted || isCancelling) return;

    setIsCancelling(true);
    await cancelClubParticipation(club.id);
    const updatedClub = await fetchClubById(club.id);
    setClub(updatedClub);
    setCancelModalOpen(false);
    setHasCancelled(true);
    setToastVisible(true);
    setIsCancelling(false);
  };

  return (
    <>
      <main className="home-page min-h-screen overflow-hidden bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-40 md:pt-48">
          {isLoading ? (
            <p className="text-center text-coffee/64">모임 정보를 불러오는 중입니다.</p>
          ) : club ? (
            <article className="rounded-[2rem] border border-coffee/10 bg-ivory/70 p-6 shadow-warm backdrop-blur-xl sm:p-9">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-caramel">Club preview</p>
              <div className="mt-6 flex flex-col gap-7 sm:flex-row">
                <img
                  src={club.thumbnail}
                  alt={`${club.title} 책 표지`}
                  className="h-64 w-44 rounded-[1.35rem] object-cover shadow-soft"
                />
                <div className="flex-1">
                  <span className="rounded-full bg-linen/52 px-3 py-1.5 text-xs font-bold text-coffee">
                    {club.category}
                  </span>
                  <h1 className="mt-5 text-3xl font-bold">{club.title}</h1>
                  <p className="mt-2 text-coffee/62">{club.author}</p>
                  <p className="mt-6 leading-7 text-coffee/72">{club.description}</p>
                  <p className="mt-6 text-sm font-bold text-coffee/70">{club.meetingLabel}</p>
                  <p className="mt-2 text-sm font-bold text-caramel">
                    현재 {club.members} / {club.maxMembers}명 참여 중
                  </p>
                </div>
              </div>
              <div className="mt-9 border-t border-coffee/10 pt-6">
                <p className="mb-5 text-sm text-coffee/62">
                  모임 신청 기능은 준비 중입니다. 현재는 상세 페이지 이동 흐름을 확인할 수 있습니다.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button href="/clubs" variant="secondary" className="min-h-12 px-6 text-sm">
                    목록으로 돌아가기
                  </Button>
                  <motion.button
                    type="button"
                    onClick={() => setCancelModalOpen(true)}
                    disabled={Boolean(club.hasStarted) || hasCancelled}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ae8175]/34 bg-[#c9a296]/40 px-6 py-3 text-sm font-bold leading-none text-[#70493f] shadow-[0_10px_24px_rgba(112,73,63,.08)] transition duration-200 hover:bg-[#b98a7d]/55 hover:text-[#633f36] disabled:cursor-not-allowed disabled:border-coffee/10 disabled:bg-linen/30 disabled:text-coffee/45 disabled:shadow-none"
                    whileHover={club.hasStarted || hasCancelled ? undefined : { y: -2 }}
                    whileTap={club.hasStarted || hasCancelled ? undefined : { scale: 0.98 }}
                  >
                    모임 참가 취소
                  </motion.button>
                </div>
                {club.hasStarted && (
                  <p className="mt-3 text-sm font-bold text-coffee/54">
                    모임 진행 중에는 취소할 수 없습니다
                  </p>
                )}
              </div>
            </article>
          ) : (
            <div className="rounded-[2rem] border border-coffee/10 bg-ivory/70 p-10 text-center shadow-warm">
              <h1 className="text-2xl font-bold">모임을 찾을 수 없습니다.</h1>
              <Button href="/clubs" variant="secondary" className="mt-7 min-h-12 px-6 text-sm">
                목록으로 돌아가기
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <CancelParticipationModal
        isOpen={cancelModalOpen}
        isSubmitting={isCancelling}
        onCancel={() => !isCancelling && setCancelModalOpen(false)}
        onConfirm={handleCancelParticipation}
      />
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            role="status"
            aria-live="polite"
            className="fixed bottom-7 left-1/2 z-[10000] -translate-x-1/2 rounded-full border border-coffee/12 bg-ivory/95 px-6 py-4 text-sm font-bold text-espresso shadow-premium backdrop-blur-md"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            모임 참가가 취소되었습니다.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
