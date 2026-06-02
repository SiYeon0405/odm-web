import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

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

const bottomItems = [
  { label: "홈", href: "/home", icon: "home" },
  { label: "검색", href: "/search", icon: "search" },
  { label: "모임", href: "/clubs", icon: "users" },
  { label: "독서/기록", icon: "book" },
  { label: "마이페이지", href: "/mypage", icon: "user", active: true },
];

const iconPaths: Record<string, string> = {
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 13h4",
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22Zm16 0A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22Z",
  camera: "M14.5 5 13 3h-2L9.5 5H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-2.5 10a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7",
  home: "m3 11 9-8 9 8v10h-6v-6H9v6H3Z",
  search: "m20 20-4.4-4.4m2.4-4.1a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0",
  settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7-3.5 2-1-2-3-2.2.3-1.5-1.5.3-2.2-3-2-1 2-1.9 1.8 1.4 2.1-.6.8-2.2L12 3 9.9 1.4 8.1 3.2 8.7 5 7.2 6.5 5 6.2 3 9l2 1v2.1l-2 1 2 3 2.2-.4 1.5 1.5-.3 2.2 3 2 1.6-1.8 2.1-.6 1.8 1.4 2-1.8-.6-2.1 1.5-1.5 2.2.3Z",
  user: "M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8m13 10v-2a4 4 0 0 0-3-3.9m-3-12a4 4 0 0 1 0 7.8",
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
  const isLoggedIn = Boolean(accessToken && accessToken !== "mock-jwt-access-token");
  const nickname = window.localStorage.getItem("odm_nickname") || "회원";

  if (!isLoggedIn) {
    return (
      <main className="grid min-h-screen place-items-center bg-cream px-5 font-sans text-espresso">
        <section className="w-full max-w-[430px] rounded-[2rem] border border-coffee/10 bg-ivory/76 p-8 text-center shadow-premium">
          <h1 className="text-3xl font-bold">마이페이지</h1>
          <p className="mt-4 leading-7 text-coffee/68">마이페이지를 이용하려면 로그인이 필요합니다.</p>
          <Button href="/login" className="mt-7 w-full">로그인 하러가기</Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream font-sans text-espresso">
      <div className="mx-auto min-h-screen max-w-[430px] bg-[#fffaf1] px-5 pb-28 pt-7 shadow-[0_0_42px_rgba(83,58,42,.08)]">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">마이페이지</h1>
          <div className="flex items-center gap-2 text-coffee/68">
            <button type="button" aria-label="설정" className="grid size-10 place-items-center rounded-full bg-white/62"><Icon name="settings" /></button>
            <button type="button" aria-label="알림" className="grid size-10 place-items-center rounded-full bg-white/62"><Icon name="bell" /></button>
          </div>
        </header>

        <section className="mt-7 overflow-hidden rounded-[1.7rem] border border-coffee/8 bg-[#f5ead9] p-5 shadow-warm">
          <div className="flex gap-4">
            <div className="relative shrink-0">
              <div className="grid size-20 place-items-center rounded-full bg-[#d9c3a6] text-coffee/72"><Icon name="user" className="size-10" /></div>
              <span className="absolute bottom-0 right-0 grid size-7 place-items-center rounded-full border-2 border-[#f5ead9] bg-espresso text-cream"><Icon name="camera" className="size-4" /></span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold">{nickname}</h2>
              <p className="mt-2 text-sm leading-6 text-coffee/72">책은 나를 만드는 가장 조용한 시간입니다.</p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-coffee/52">
                <span>가입일 2026.05.25</span><span>회원번호 ODM-260525</span>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-4 border-t border-coffee/10 pt-5 text-center">
            {profileStats.map(([label, value]) => (
              <div key={label} className="border-r border-coffee/10 px-1 last:border-r-0">
                <p className="text-base font-bold text-espresso">{value}</p><p className="mt-1 text-[10px] leading-4 text-coffee/58">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <SectionTitle>독서 기록</SectionTitle>
          <div className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-2">
            {readingRecords.map((book) => (
              <article key={book.title} className="w-[126px] shrink-0">
                <div className={`h-40 rounded-[1rem] bg-gradient-to-br ${book.tone} p-3 shadow-soft`}>
                  <p className="mt-auto text-sm font-bold leading-5 text-ivory">{book.title}</p>
                </div>
                <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-5">{book.title}</h3><p className="mt-1 text-xs text-coffee/58">{book.author}</p>
                <div className="mt-3 h-1.5 rounded-full bg-linen"><div className="h-full rounded-full bg-caramel" style={{ width: `${book.progress}%` }} /></div>
                <p className="mt-1 text-right text-[11px] font-bold text-caramel">{book.progress}%</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8"><SectionTitle href="/my-clubs">참여 중인 모임</SectionTitle><div className="mt-4 h-28 rounded-[1.3rem] border border-dashed border-coffee/16 bg-[#f9f0e4]" /></section>
        <section className="mt-8"><SectionTitle>완료 된 모임</SectionTitle><div className="mt-4 h-28 rounded-[1.3rem] border border-dashed border-coffee/16 bg-[#f9f0e4]" /></section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[430px] items-center justify-around border-t border-coffee/10 bg-ivory/94 px-2 py-3 shadow-[0_-10px_30px_rgba(83,58,42,.06)] backdrop-blur-xl">
        {bottomItems.map((item) => {
          const content = <><Icon name={item.icon} className="size-5" /><span className="mt-1 text-[10px] font-bold">{item.label}</span></>;
          const className = `flex min-w-14 flex-col items-center ${item.active ? "text-caramel" : "text-coffee/58"}`;
          return item.href ? <Link key={item.label} to={item.href} className={className}>{content}</Link> : <button key={item.label} type="button" className={className}>{content}</button>;
        })}
      </nav>
    </main>
  );
}
