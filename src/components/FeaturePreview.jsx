import { motion } from "framer-motion";

const rows = [
  {
    title: "도서 검색",
    status: "책 선택",
    description: "베스트셀러와 원하는 도서를 찾아요.",
    width: "w-[58%]",
  },
  {
    title: "모임 참여",
    status: "읽는 중",
    description: "진도와 감상을 함께 공유해요.",
    width: "w-[72%]",
  },
  {
    title: "독후감 작성",
    status: "기록 완료",
    description: "읽은 책과 생각을 프로필에 남겨요.",
    width: "w-[86%]",
  },
];

const flowItems = ["도서 선택", "모임 만들기", "진도 공유", "문장 나눔", "독후감 기록", "프로필 저장"];

export function FeaturePreviewCard({ title, children, className = "" }) {
  return (
    <motion.article
      className={`feature-glass-card relative rounded-[1.35rem] border border-coffee/10 bg-ivory/82 p-5 shadow-warm backdrop-blur-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="text-base font-bold text-espresso">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-coffee/76">{children}</p>
    </motion.article>
  );
}

export function FeatureRow({ title, status, description, width }) {
  return (
    <div className="relative overflow-hidden rounded-[1.15rem] border border-brown/10 bg-white/64 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.74)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-espresso">{title}</p>
        <span className="shrink-0 rounded-full bg-linen/60 px-2.5 py-1 text-[0.7rem] font-bold text-coffee/78">
          {status}
        </span>
      </div>
      <p className="mt-1.5 text-xs leading-5 text-coffee/74">{description}</p>
      <div className="mt-3 h-1.5 rounded-full bg-linen/60">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r from-caramel via-[#9f865d] to-matcha ${width}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}

export default function FeaturePreview() {
  return (
    <section className="feature-preview relative px-4 py-20 md:py-28" aria-labelledby="feature-preview-title">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="relative overflow-hidden rounded-[2.4rem] border border-coffee/10 bg-[linear-gradient(145deg,rgba(255,248,237,.94),rgba(248,239,226,.9)_48%,rgba(234,215,189,.74))] p-4 shadow-premium md:p-7 lg:p-8"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="feature-preview-grain" />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="grid content-between gap-5">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
                <FeaturePreviewCard title="도서 선택">
                  읽고 싶은 책을 고르고 독서모임을 시작해요.
                </FeaturePreviewCard>

                <motion.article
                  className="feature-quote-card relative rounded-[1.45rem] border border-coffee/10 bg-paper/88 p-6 shadow-warm backdrop-blur-2xl"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="whitespace-pre-line text-2xl font-bold leading-tight tracking-[-0.035em] text-espresso">
                    {"같은 페이지에서\n만나요."}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-coffee/76">문장과 감상을 나누는 온라인 독서모임</p>
                </motion.article>
              </div>

              <motion.article
                className="relative rounded-[1.35rem] border border-coffee/10 bg-espresso p-6 text-cream shadow-soft"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                <p id="feature-preview-title" className="text-base font-bold">ODM Notes</p>
                <p className="mt-2 text-sm leading-6 text-cream/78">함께 읽는 기록이 쌓이는 공간</p>
              </motion.article>

              <div className="grid gap-3 rounded-[1.45rem] border border-coffee/10 bg-ivory/58 p-4 shadow-warm backdrop-blur-xl">
                {flowItems.map((item, index) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white/56 px-4 py-3 text-sm font-bold text-coffee/78"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: index * 0.05 }}
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-caramel/14 text-[0.7rem] text-caramel">
                      {index + 1}
                    </span>
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="feature-main-panel relative z-10 rounded-[2rem] border border-white/70 bg-ivory/94 p-3 shadow-premium backdrop-blur-2xl md:p-4"
              initial={{ opacity: 0, y: 36, rotate: 0.6 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-[1.6rem] bg-paper/96 p-4 shadow-inner-warm sm:p-5 md:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold text-brown/68">Tonight</p>
                    <h3 className="mt-1 text-xl font-bold leading-tight text-espresso md:text-2xl">조용한 밤의 독서모임</h3>
                  </div>
                  <span className="w-fit rounded-full bg-matcha/14 px-3 py-1 text-xs font-bold text-matcha">Live</span>
                </div>

                <div className="space-y-3">
                  {rows.map((row) => (
                    <FeatureRow key={row.title} {...row} />
                  ))}
                </div>

                <div className="mt-5 rounded-[1.4rem] bg-espresso p-5 text-cream shadow-soft">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cream/68">SHARED LINE</p>
                  <p className="mt-2 text-base font-bold leading-7 tracking-[-0.02em]">함께 읽으면 한 문장이 오래 머뭅니다.</p>
                  <p className="mt-2 text-xs leading-5 text-cream/76">문장 공유 · 진도 기록 · 감상 나눔</p>
                </div>

                <div className="mt-5 grid gap-3 text-xs leading-5 text-coffee/72 sm:grid-cols-3">
                  <div className="rounded-2xl border border-coffee/8 bg-white/48 p-3">책 선택에서 모임 시작까지 자연스럽게 이어져요.</div>
                  <div className="rounded-2xl border border-coffee/8 bg-white/48 p-3">읽는 속도와 감상을 같은 공간에 남겨요.</div>
                  <div className="rounded-2xl border border-coffee/8 bg-white/48 p-3">독후감과 독서 기록은 프로필에 차곡차곡 쌓여요.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
