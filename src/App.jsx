import { motion } from "framer-motion";
import Link from "next/link";
import odmLogo from "@/assets/ODM_logo_배경없.png";
import bearTable from "@/assets/bear-reading-table.png";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";

const navItems = [
  { label: "소개", href: "#why" },
  { label: "기능", href: "#features" },
  { label: "미리보기", href: "#preview" },
  { label: "알림", href: "#beta" },
];

const MotionLink = motion.create(Link);

const serviceCards = [
  {
    icon: "book",
    title: "온라인 독서모임",
    body: "시간과 장소의 부담 없이 같은 책을 읽는 사람들과 자연스럽게 만나요.",
  },
  {
    icon: "pen",
    title: "독서 기록 공유",
    body: "문장, 감상, 질문을 남기고 모임 안에서 따뜻하게 이어 봅니다.",
  },
  {
    icon: "shield",
    title: "안전한 커뮤니티",
    body: "온라인 중심의 참여 흐름과 기록 기반 프로필로 처음도 편안하게 시작해요.",
  },
  {
    icon: "spark",
    title: "감성적인 독서 경험",
    body: "책을 읽는 순간과 기록하는 시간을 차분한 인터페이스로 담아냅니다.",
  },
];

const featureCards = [
  {
    icon: "group",
    title: "독서모임 모집",
    keyword: "모집",
    body: "책, 일정, 분위기에 맞춰 온라인 모임을 만들고 참여할 수 있어요.",
  },
  {
    icon: "diary",
    title: "독서 다이어리 작성",
    keyword: "기록",
    body: "오늘의 문장과 감상을 나만의 다이어리처럼 차곡차곡 남깁니다.",
  },
  {
    icon: "progress",
    title: "독서 진행률 관리",
    keyword: "진도",
    body: "모임원들과 각자의 독서 흐름을 부드럽게 공유합니다.",
  },
  {
    icon: "review",
    title: "리뷰 및 감상 공유",
    keyword: "소통",
    body: "긴 서평부터 짧은 메모까지 책을 중심으로 대화를 이어요.",
  },
  {
    icon: "ai",
    title: "AI 기반 추천",
    keyword: "추천",
    body: "기록과 취향을 바탕으로 다음 책과 잘 맞는 모임을 제안합니다.",
  },
  {
    icon: "community",
    title: "커뮤니티 기능",
    keyword: "연결",
    body: "책장, 댓글, 피드로 독서가 혼자가 아닌 경험이 됩니다.",
  },
];

const problems = [
  "시간 맞추기 어려움",
  "거리 부담",
  "낯선 사람과의 오프라인 만남 부담",
  "기록이 남지 않음",
];

const solutions = [
  "온라인 기반 참여",
  "기록 중심 독서 경험",
  "감성 커뮤니티",
  "안전한 사용자 환경",
];

const previewScreens = [
  {
    title: "독서모임",
    tag: "Table",
    body: "모집 중인 책, 일정, 진행률을 한눈에 확인",
    rows: ["모순 함께 읽기", "밤의 여행자들", "작별하지 않는다"],
  },
  {
    title: "다이어리",
    tag: "Diary",
    body: "문장과 감상을 오늘의 기록으로 저장",
    rows: ["오늘의 문장", "떠오른 질문", "다음에 나눌 감상"],
  },
  {
    title: "커뮤니티",
    tag: "Community",
    body: "리뷰, 댓글, 책장으로 이어지는 대화",
    rows: ["인상 깊은 장면", "같이 읽는 사람들", "따뜻한 피드백"],
  },
  {
    title: "진행률",
    tag: "Progress",
    body: "각자의 속도와 모임의 리듬을 함께 관리",
    rows: ["1주차 64%", "2주차 38%", "완독 예정"],
  },
];

const iconPaths = {
  book: "M7 5.5h7a3 3 0 0 1 3 3v10h-7a3 3 0 0 0-3 3v-16Zm0 0H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2",
  pen: "M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Zm10-13 4 4",
  shield: "M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z",
  spark: "M12 3l1.7 5.2L19 10l-5.3 1.8L12 17l-1.7-5.2L5 10l5.3-1.8L12 3Zm7 11 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z",
  group: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a5 5 0 0 1 10 0m-2-1a5 5 0 0 1 10 0",
  diary: "M6 4h10a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2Zm2 4h7M8 12h5",
  progress: "M4 19V5m0 14h16M8 15v-4m4 4V8m4 7v-6m4 6v-2",
  review: "M5 5h14v10H8l-3 4V5Zm4 4h6m-6 3h4",
  ai: "M12 4v3m0 10v3M4 12h3m10 0h3M8 8l-2-2m10 2 2-2M8 16l-2 2m10-2 2 2M9 9h6v6H9V9Z",
  community: "M7 8h10M7 12h7M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-5 3v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
};

function OdmLogo({ variant = "nav" }) {
  return (
    <img
      src={odmLogo.src ?? odmLogo}
      alt="ODM"
      className={`odm-logo odm-logo-${variant}`}
      draggable="false"
    />
  );
}

function LineIcon({ name, className = "" }) {
  return (
    <svg className={`line-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  );
}

function GlowButton({ children, href = "#beta", variant = "primary", size = "cta" }) {
  const styles =
    variant === "primary"
      ? "cta-button-primary bg-[linear-gradient(135deg,#5d35ff_0%,#3185ff_44%,#f07d3b_100%)] text-white"
      : variant === "secondary"
        ? "cta-button-secondary border border-white/75 bg-ivory/88 text-espresso backdrop-blur-xl"
      : variant === "cream"
        ? "cta-button-cream bg-ivory text-espresso shadow-[0_16px_38px_rgba(83,58,42,.22)]"
        : "border border-coffee/15 bg-white/54 text-espresso shadow-warm backdrop-blur-xl";
  const sizing =
    size === "compact"
      ? "min-h-[3.35rem] px-7 text-base"
      : "min-h-[4.15rem] px-9 py-4 text-[1.05rem] sm:min-h-[4.45rem] sm:px-11 sm:text-lg";
  const className = `cta-button inline-flex items-center justify-center rounded-full font-bold leading-none transition duration-300 ${sizing} ${styles}`;
  const motionProps = {
    whileHover: { y: -4, scale: 1.03 },
    whileTap: { scale: 0.98 },
  };

  if (href.startsWith("/")) {
    return (
      <MotionLink href={href} className={className} {...motionProps}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.a
      href={href}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.a>
  );
}

function Navbar() {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 py-4"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-coffee/10 bg-ivory/82 px-4 py-3 shadow-warm backdrop-blur-2xl md:px-6">
        <a href="#" aria-label="ODM 홈" className="shrink-0">
          <OdmLogo />
        </a>
        <div className="hidden items-center gap-8 text-sm font-bold text-coffee/76 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-espresso">
              {item.label}
            </a>
          ))}
        </div>
        <GlowButton href="/home" variant="cream" size="compact">
          시작하기
        </GlowButton>
      </nav>
    </motion.header>
  );
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cream">
      <div className="paper-grain" />
      <div className="page-lines" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-section relative flex min-h-[92svh] items-center overflow-hidden px-4 pb-16 pt-28 md:pt-32">
      <div className="hero-warm-halo absolute inset-x-0 top-0 h-[720px]" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="text-center lg:text-left">
          <motion.div
            className="mb-5 flex justify-center lg:justify-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
          >
            <OdmLogo variant="hero" />
          </motion.div>
          <motion.p
            className="mb-5 inline-flex rounded-full border border-coffee/10 bg-white/52 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel backdrop-blur-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
          >
            Online reading community
          </motion.p>
          <motion.h1
            className="text-balance text-4xl font-bold leading-[1.1] text-espresso sm:text-5xl md:text-6xl lg:text-[4.05rem]"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            혼자 읽던 독서를
            <br />
            함께 기록하고 연결하다
          </motion.h1>
          <motion.p
            className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-coffee/76 lg:mx-0"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.18 }}
          >
            ODM은 온라인 기반 독서모임 플랫폼으로, 사람들과 함께 읽고 기록하며
            소통할 수 있는 공간입니다.
          </motion.p>
          <motion.div
            className="cta-group mt-8 flex flex-col justify-center gap-5 sm:flex-row lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25 }}
          >
            <GlowButton href="/home">ODM 시작하기</GlowButton>
            <GlowButton href="#beta" variant="secondary">
              앱출시 알림받기
            </GlowButton>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual mx-auto w-full max-w-[560px]"
          initial={{ opacity: 0, y: 36, rotate: 1.2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative rounded-[2.2rem] border border-coffee/10 bg-ivory/58 p-5 shadow-premium backdrop-blur-2xl">
            <div className="rounded-[1.7rem] bg-paper/96 p-5 shadow-inner-warm">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-bold text-coffee/70">오늘의 모임</span>
                <span className="rounded-full bg-matcha/14 px-3 py-1 text-xs font-bold text-matcha">Live</span>
              </div>
              <div className="rounded-[1.35rem] bg-espresso p-5 text-cream shadow-soft">
                <p className="text-sm text-cream/70">함께 읽는 책</p>
                <p className="mt-2 text-2xl font-bold">달콤 쌉싸름한 초콜릿</p>
                <div className="mt-5 h-2 rounded-full bg-white/16">
                  <motion.div
                    className="h-full w-[72%] rounded-full bg-gradient-to-r from-caramel to-[#8fd1a0]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.7 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {["문장 공유", "감상 기록", "진도 체크", "모임 피드"].map((item, index) => (
                  <motion.div
                    key={item}
                    className="rounded-2xl border border-coffee/8 bg-white/54 p-4 text-sm font-bold text-coffee/78"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.45 + index * 0.08 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceIntro() {
  return (
    <section id="why" className="section-band px-4 py-24 md:py-32">
      <SectionHeading
        kicker="Why ODM"
        title="왜 ODM인가요?"
        body="책을 읽는 행위가 기록으로 남고, 기록이 다시 사람과 연결되는 온라인 독서 공간을 만듭니다."
      />
      <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {serviceCards.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.08}>
            <motion.article className="lift-card h-full rounded-[1.6rem] border border-coffee/10 bg-ivory/72 p-6 shadow-warm backdrop-blur-xl">
              <div className="icon-badge">
                <LineIcon name={card.icon} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-espresso">{card.title}</h3>
              <p className="mt-3 leading-7 text-coffee/72">{card.body}</p>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="px-4 py-24 md:py-32">
      <SectionHeading
        kicker="Core Features"
        title="함께 읽고 기록하기 위한 핵심 기능"
        body="모집부터 다이어리, 진행률, 추천과 커뮤니티까지 독서모임의 흐름을 하나의 경험으로 이어줍니다."
      />
      <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.06}>
            <motion.article className="feature-card h-full rounded-[1.8rem] border border-coffee/10 bg-ivory/76 p-6 shadow-warm backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="icon-badge">
                  <LineIcon name={feature.icon} />
                </div>
                <span className="rounded-full bg-caramel/14 px-3 py-1 text-xs font-bold text-caramel">
                  {feature.keyword}
                </span>
              </div>
              <h3 className="mt-7 text-2xl font-bold text-espresso">{feature.title}</h3>
              <p className="mt-3 leading-7 text-coffee/72">{feature.body}</p>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className="section-band px-4 py-24 md:py-32">
      <SectionHeading
        kicker="Before / After"
        title="기존 독서모임의 불편함"
        body="ODM은 오프라인 독서모임의 부담을 덜고, 온라인에서 남는 기록과 안전한 연결을 중심에 둡니다."
      />
      <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="compare-panel compare-before rounded-[2rem] border border-stone-300/60 bg-white/48 p-7 shadow-warm backdrop-blur-xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">Before</p>
            <h3 className="mt-3 text-3xl font-bold text-stone-700">기존 문제</h3>
            <ul className="mt-7 space-y-3">
              {problems.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-2xl bg-stone-100/80 px-4 py-4 text-stone-600">
                  <span className="compare-dot bg-stone-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="compare-panel compare-after rounded-[2rem] border border-caramel/20 bg-[linear-gradient(145deg,rgba(255,248,237,.9),rgba(231,207,171,.72))] p-7 shadow-premium backdrop-blur-xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-caramel">After ODM</p>
            <h3 className="mt-3 text-3xl font-bold text-espresso">ODM 해결 방식</h3>
            <ul className="mt-7 space-y-3">
              {solutions.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-2xl bg-white/62 px-4 py-4 text-coffee">
                  <span className="compare-dot bg-caramel shadow-[0_0_20px_rgba(177,126,75,.35)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PreviewScreen({ screen, index }) {
  return (
    <Reveal delay={index * 0.08}>
      <motion.article className="mockup-card rounded-[1.8rem] border border-coffee/10 bg-ivory/78 p-3 shadow-premium backdrop-blur-2xl">
        <div className="rounded-[1.35rem] bg-paper p-4 shadow-inner-warm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#e98572]" />
              <span className="size-2.5 rounded-full bg-[#e8c167]" />
              <span className="size-2.5 rounded-full bg-[#7eb785]" />
            </div>
            <span className="rounded-full bg-linen/60 px-3 py-1 text-xs font-bold text-coffee/70">{screen.tag}</span>
          </div>
          <h3 className="text-2xl font-bold text-espresso">{screen.title}</h3>
          <p className="mt-2 min-h-[3.5rem] text-sm leading-6 text-coffee/70">{screen.body}</p>
          <div className="mt-5 space-y-3">
            {screen.rows.map((row, rowIndex) => (
              <div key={row} className="rounded-2xl border border-coffee/8 bg-white/58 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-coffee/78">{row}</span>
                  <span className="h-2 w-16 overflow-hidden rounded-full bg-linen">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-caramel to-matcha"
                      style={{ width: `${54 + rowIndex * 16}%` }}
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

function ServicePreview() {
  return (
    <section id="preview" className="px-4 py-24 md:py-32">
      <SectionHeading
        kicker="Product Preview"
        title="서비스 미리보기"
        body="실제 앱을 떠올릴 수 있도록 독서모임, 다이어리, 커뮤니티, 진행률 화면을 mockup으로 구성했습니다."
      />
      <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-4">
        {previewScreens.map((screen, index) => (
          <PreviewScreen key={screen.title} screen={screen} index={index} />
        ))}
      </div>
      <Reveal className="mx-auto mt-14 flex max-w-6xl justify-center">
        <motion.img
          src={bearTable.src ?? bearTable}
          alt="ODM 독서모임 일러스트"
          className="w-full max-w-[560px] object-contain drop-shadow-[0_24px_42px_rgba(83,58,42,.12)]"
          draggable="false"
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.35 }}
        />
      </Reveal>
    </section>
  );
  
}

function BetaCta() {
  return (
    <section id="beta" className="px-4 py-24 md:py-36">
      <Reveal>
        <div className="beta-panel mx-auto max-w-6xl overflow-hidden rounded-[2.4rem] border border-white/10 bg-espresso px-6 py-16 text-center text-cream shadow-premium md:px-12 md:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-caramel">Coming Soon</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-bold leading-tight md:text-6xl">
            ODM은 현재 개발 중입니다
          </h2>
          <p className="mt-6 text-xl font-bold text-cream/80">2026년 7월 베타 출시 예정</p>
          <div className="cta-group mt-10 flex flex-col justify-center gap-5 sm:flex-row">
            <GlowButton href="/home">
              ODM 시작하기
            </GlowButton>
            <GlowButton href="mailto:hello.psyeon@gmail.com?subject=ODM 출시 알림 신청" variant="secondary">
              앱출시 알림받기
            </GlowButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-espresso px-4 py-12 text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="py-1">
          <OdmLogo variant="footer" />
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-bold text-cream/72">
          <a href="mailto:hello.psyeon@gmail.com" className="transition hover:text-cream">hello.psyeon@gmail.com</a>
          <a href="https://github.com" className="transition hover:text-cream">GitHub</a>
          <a href="#why" className="transition hover:text-cream">팀 소개</a>
        </div>
        <p className="text-sm text-cream/50">Copyright 2026 ODM. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream font-sans text-espresso">
      <AmbientBackground />
      <Navbar />
      <Hero />
      <ServiceIntro />
      <Features />
      <ProblemSolution />
      <ServicePreview />
      <BetaCta />
      <Footer />
    </main>
  );
}
