import Button from "@/components/ui/Button";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import JoinedClubCard from "@/features/my-clubs/components/JoinedClubCard";
import { useJoinedClubs } from "@/features/my-clubs/hooks/useJoinedClubs";

export default function MyClubsPage() {
  const { isLoggedIn, user } = useAuth();
  const { clubs, isLoading } = useJoinedClubs();

  return (
    <>
      <main className="home-page min-h-screen overflow-hidden bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-36 md:pb-28 md:pt-44">
          <p className="inline-flex rounded-full border border-coffee/10 bg-white/48 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel">
            My reading clubs
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">내 독서모임</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-coffee/70">
            {isLoggedIn
              ? `${user?.nickname}님이 함께 읽고 있는 모임을 모았습니다.`
              : "로그인 후 참여한 독서모임을 확인할 수 있습니다."}
          </p>
          {!isLoggedIn ? (
            <div className="mt-12 rounded-[1.8rem] border border-coffee/10 bg-ivory/70 p-8 shadow-warm">
              <p className="mb-6 text-coffee/68">내 독서모임을 보려면 로그인이 필요합니다.</p>
              <Button href="/login" className="min-h-12 px-6 text-sm">
                로그인 하러가기
              </Button>
            </div>
          ) : isLoading ? (
            <p className="mt-12 text-coffee/64">참여한 모임을 불러오는 중입니다.</p>
          ) : clubs.length > 0 ? (
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {clubs.map((club) => (
                <JoinedClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[1.8rem] border border-coffee/10 bg-ivory/70 p-8 shadow-warm">
              <p className="mb-6 text-coffee/68">아직 참여한 모임이 없습니다.</p>
              <Button href="/clubs" className="min-h-12 px-6 text-sm">
                모임 둘러보기
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
