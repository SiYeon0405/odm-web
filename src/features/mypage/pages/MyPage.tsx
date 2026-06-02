import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import Button from "@/components/ui/Button";
import { getMyProfile, type UserProfile } from "@/features/auth/api/authApi";

const readingRecords = [
  { title: "스즈메의 문단속", author: "신카이 마코토", progress: 75, tone: "from-[#60463b] to-[#c18b67]" },
  { title: "불편한 편의점 2", author: "김호연 지음", progress: 50, tone: "from-[#4f665b] to-[#d3bd88]" },
  { title: "자몽살구클럽", author: "한로로 지음", progress: 100, tone: "from-[#d67f63] to-[#f0be76]" },
  { title: "나의 일이 보여서 미치겠어요", author: "정진호 지음", progress: 25, tone: "from-[#666078] to-[#b8a7c7]" },
];

const profileStats = [
  ["총 독서 권 수", "24권"],
  ["총 독서 시간", "168h"],
  ["작성한 리뷰", "12개"],
  ["참여한 모임", "8개"],
];

const iconPaths: Record<string, string> = {
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 13h4",
  camera: "M14.5 5 13 3h-2L9.5 5H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-2.5 10a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7",
  settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7-3.5 2-1-2-3-2.2.3-1.5-1.5.3-2.2-3-2-1 2-1.9 1.8 1.4 2.1-.6.8-2.2L12 3 9.9 1.4 8.1 3.2 8.7 5 7.2 6.5 5 6.2 3 9l2 1v2.1l-2 1 2 3 2.2-.4 1.5 1.5-.3 2.2 3 2 1.6-1.8 2.1-.6 1.8 1.4 2-1.8-.6-2.1 1.5-1.5 2.2.3Z",
  user: "M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
};

function Icon({ name, className = "size-5" }: { name: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  );
}

function SectionTitle({ children, href }: { children: ReactNode; href?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-bold text-espresso">{children}</h2>
      {href ? <Link to={href} className="text-xs font-bold text-caramel">전체 보기 &gt;</Link> : <span className="text-xs font-bold text-caramel">전체 보기 &gt;</span>}
    </div>
  );
}

export default function MyPage() {
  const accessToken = window.localStorage.getItem("odm_accessToken");
  const hasAccessToken = Boolean(accessToken && accessToken !== "mock-jwt-access-token");
  const [isLoggedIn, setIsLoggedIn] = useState(hasAccessToken);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(hasAccessToken);
  const nickname = profile?.nickname || window.localStorage.getItem("odm_nickname") || "회원";
  const introduction = profile?.introduction || "책은 나를 만드는 가장 조용한 시간입니다.";
  const createdAt = profile?.createdAt ? profile.createdAt.slice(0, 10).replaceAll("-", ".") : "2026.05.25";
  const userId = profile?.userId ? `ODM-${profile.userId}` : "ODM-260525";

  useEffect(() => {
    if (!hasAccessToken) {
      setIsLoading(false);
      return;
    }

    getMyProfile()
      .then((data) => setProfile(data))
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          setIsLoggedIn(false);
        }
      })
      .finally(() => setIsLoading(false));
  }, [hasAccessToken]);

  if (!isLoggedIn) {
    return (
      <>
        <main className="home-page min-h-screen bg-cream px-4 pb-24 pt-40 font-sans text-espresso">
          <div className="home-ambient" aria-hidden="true" />
          <HomeNavbar />
          <section className="relative mx-auto max-w-6xl rounded-[2rem] border border-coffee/10 bg-ivory/76 p-8 text-center shadow-premium">
            <h1 className="text-3xl font-bold">마이페이지</h1>
            <p className="mt-4 leading-7 text-coffee/68">마이페이지를 이용하려면 로그인이 필요합니다.</p>
            <Button href="/login" className="mt-7">로그인 하러가기</Button>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-6xl px-4 pb-24 pt-36 md:pt-44">
          <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-caramel">My page</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">마이페이지</h1>
              <p className="mt-5 text-lg leading-8 text-coffee/70">나의 독서 기록과 모임 활동을 한눈에 확인해보세요.</p>
            </div>
          <div className="flex items-center gap-2 text-coffee/68">
              <button type="button" aria-label="설정" className="grid size-12 place-items-center rounded-full border border-coffee/10 bg-white/62 shadow-warm"><Icon name="settings" /></button>
              <button type="button" aria-label="알림" className="grid size-12 place-items-center rounded-full border border-coffee/10 bg-white/62 shadow-warm"><Icon name="bell" /></button>
          </div>
        </header>

          <section className="mt-10 grid gap-8 overflow-hidden rounded-[2rem] border border-coffee/8 bg-[#f5ead9]/92 p-6 shadow-warm lg:grid-cols-[1fr_1.05fr] lg:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
                {profile?.profileImage ? <img src={profile.profileImage} alt="" className="size-28 rounded-full object-cover" /> : <div className="grid size-28 place-items-center rounded-full bg-[#d9c3a6] text-coffee/72"><Icon name="user" className="size-14" /></div>}
                <span className="absolute bottom-1 right-1 grid size-9 place-items-center rounded-full border-2 border-[#f5ead9] bg-espresso text-cream"><Icon name="camera" className="size-5" /></span>
            </div>
            <div className="min-w-0">
                <h2 className="text-3xl font-bold">{nickname}</h2>
                {profile?.email ? <p className="mt-1 text-sm text-coffee/58">{profile.email}</p> : null}
                <p className="mt-3 leading-7 text-coffee/72">{introduction}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-coffee/52">
                <span>가입일 {createdAt}</span><span>회원번호 {userId}</span>
                {isLoading ? <span aria-live="polite">프로필 불러오는 중...</span> : null}
              </div>
            </div>
          </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {profileStats.map(([label, value]) => (
                <div key={label} className="rounded-[1.2rem] border border-coffee/8 bg-white/52 p-4 text-center">
                  <p className="text-xl font-bold text-espresso">{value}</p><p className="mt-2 text-xs leading-4 text-coffee/58">{label}</p>
              </div>
            ))}
          </div>
          </section>

          <section className="mt-10 rounded-[2rem] border border-coffee/8 bg-ivory/66 p-6 shadow-warm lg:p-8">
          <SectionTitle>독서 기록</SectionTitle>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {readingRecords.map((book) => (
                <article key={book.title} className="rounded-[1.4rem] border border-coffee/8 bg-white/52 p-4">
                  <div className={`grid h-52 place-items-end rounded-[1rem] bg-gradient-to-br ${book.tone} p-4 shadow-soft`}>
                    <p className="text-base font-bold leading-6 text-ivory">{book.title}</p>
                </div>
                  <h3 className="mt-4 line-clamp-2 font-bold leading-6">{book.title}</h3><p className="mt-1 text-sm text-coffee/58">{book.author}</p>
                <div className="mt-3 h-1.5 rounded-full bg-linen"><div className="h-full rounded-full bg-caramel" style={{ width: `${book.progress}%` }} /></div>
                  <p className="mt-2 text-right text-xs font-bold text-caramel">{book.progress}%</p>
              </article>
            ))}
          </div>
        </section>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-coffee/8 bg-ivory/66 p-6 shadow-warm"><SectionTitle href="/my-clubs">참여 중인 모임</SectionTitle><div className="mt-5 h-36 rounded-[1.3rem] border border-dashed border-coffee/16 bg-[#f9f0e4]" /></section>
            <section className="rounded-[2rem] border border-coffee/8 bg-ivory/66 p-6 shadow-warm"><SectionTitle>완료 된 모임</SectionTitle><div className="mt-5 h-36 rounded-[1.3rem] border border-dashed border-coffee/16 bg-[#f9f0e4]" /></section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
