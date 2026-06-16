import { motion } from "framer-motion";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fadeUp, gentleStagger } from "@/animations/motion";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ClubCard from "@/features/clubs/components/ClubCard";
import ClubFilterBar from "@/features/clubs/components/ClubFilterBar";
import ClubPagination from "@/features/clubs/components/ClubPagination";
import ClubSearchInput from "@/features/clubs/components/ClubSearchInput";
import JoinCompleteModal from "@/features/clubs/components/JoinCompleteModal";
import LoginRequiredModal from "@/features/clubs/components/LoginRequiredModal";
import { useClubs } from "@/features/clubs/hooks/useClubs";
import { useJoinClub } from "@/features/clubs/hooks/useJoinClub";
import type { Club } from "@/features/clubs/types";

type RecruitableClub = Club & {
  status?: string;
  recruitmentStatus?: string;
  startDate?: string;
};

function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const date = `${today.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${date}`;
}

function isRecruitableClub(club: Club, today: string) {
  const recruitableClub = club as RecruitableClub;
  const status = recruitableClub.status ?? recruitableClub.recruitmentStatus;
  const startDate = recruitableClub.startDate?.slice(0, 10) ?? "";

  return status === "RECRUITING" && startDate >= today;
}

export default function ClubsPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const {
    loginRequiredOpen,
    joinModalClub,
    requestJoin,
    closeLoginRequired,
    closeJoinModal,
  } = useJoinClub();
  const {
    clubs,
    isLoading,
    search,
    category,
    capacity,
    sort,
    page,
    pageCount,
    setSearch,
    setCategory,
    setCapacity,
    setSort,
    setPage,
  } = useClubs();
  const today = useMemo(getTodayDateKey, []);
  const visibleClubs = useMemo(
    () => clubs.filter((club) => isRecruitableClub(club, today)),
    [clubs, today],
  );

  const handleJoin = useCallback(
    (club: Club) => {
      requestJoin(club, isLoggedIn);
    },
    [isLoggedIn, requestJoin],
  );
  const handleClubOpen = useCallback(
    (club: Club) => {
      navigate(`/clubs/${club.id}`);
    },
    [navigate],
  );

  const handleLoginNavigation = useCallback(() => {
    closeLoginRequired();
    navigate("/login", { state: { from: "/clubs" } });
  }, [closeLoginRequired, navigate]);

  const handleJoinConfirmation = useCallback(() => {
    closeJoinModal();
    navigate("/my-clubs");
  }, [closeJoinModal, navigate]);

  return (
    <>
      <main className="home-page min-h-screen overflow-hidden bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <motion.section
          className="relative mx-auto max-w-6xl px-4 pb-20 pt-36 md:pb-28 md:pt-44"
          variants={gentleStagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="max-w-3xl">
            <p className="inline-flex rounded-full border border-coffee/10 bg-white/48 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel">
              Reading clubs
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-espresso sm:text-5xl">
              독서모임 둘러보기
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-coffee/70">
              함께 읽을 책과 마음에 닿는 모임을 찾아보세요. 문장을 기록하고 대화를
              이어갈 조용한 자리가 기다리고 있습니다.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-12 rounded-[1.75rem] border border-coffee/10 bg-paper/62 p-4 shadow-warm backdrop-blur-xl sm:p-6"
          >
            <ClubSearchInput value={search} onChange={setSearch} />
            <ClubFilterBar
              category={category}
              capacity={capacity}
              sort={sort}
              onCategoryChange={setCategory}
              onCapacityChange={setCapacity}
              onSortChange={setSort}
            />
          </motion.div>
          <motion.div variants={fadeUp} className="mt-10 flex items-center justify-between">
            <p className="text-sm font-bold text-coffee/62">
              현재 참여 가능한 모임 <span className="text-caramel">{visibleClubs.length}</span>개
            </p>
          </motion.div>
          {isLoading ? (
            <p className="mt-12 text-center text-coffee/60">모임을 불러오는 중입니다.</p>
          ) : visibleClubs.length > 0 ? (
            <motion.div variants={fadeUp} className="mt-6 grid gap-5 lg:grid-cols-2">
              {visibleClubs.map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  canJoin={isRecruitableClub(club, today)}
                  onJoin={handleJoin}
                  onOpen={handleClubOpen}
                />
              ))}
            </motion.div>
          ) : (
            <div className="mt-10 rounded-[1.7rem] border border-coffee/10 bg-ivory/64 p-12 text-center text-coffee/64">
              조건에 맞는 독서모임이 없습니다.
            </div>
          )}
          <ClubPagination page={page} pageCount={pageCount} onChange={setPage} />
        </motion.section>
      </main>
      <Footer />
      {loginRequiredOpen && (
        <LoginRequiredModal
          isOpen={loginRequiredOpen}
          onLogin={handleLoginNavigation}
          onClose={closeLoginRequired}
        />
      )}
      {joinModalClub && (
        <JoinCompleteModal
          club={joinModalClub}
          onConfirm={handleJoinConfirmation}
          onClose={closeJoinModal}
        />
      )}
    </>
  );
}
