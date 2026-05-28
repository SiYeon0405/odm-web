import { motion } from "framer-motion";
import { fadeUp } from "@/animations/motion";
import bearPeeking from "@/assets/bear_peeking.png";

const recordCards = [
  {
    title: "오늘의 문장",
    book: "모순",
    note: "선택하지 않은 삶도 내 안에 오래 남아 있었다.",
    meta: "하이라이트 7개",
  },
  {
    title: "읽기 루틴",
    book: "아몬드",
    note: "저녁 20분, 감상 메모 3줄을 차분히 채웠어요.",
    meta: "이번 주 4일 기록",
  },
  {
    title: "모임 질문",
    book: "어린 왕자",
    note: "내가 길들인 문장은 무엇이었을까?",
    meta: "답변 12개",
  },
];

export default function ReadingRecordSection() {
  return (
    <section id="records" className="px-4 py-24 md:py-28">
      <motion.div
        className="mx-auto max-w-6xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
      >
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-caramel">Reading record</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.02fr_.98fr] lg:items-end">
          <div>
            <h2 className="text-balance text-3xl font-bold leading-tight text-espresso md:text-5xl">
              완독보다 오래 남는 기록 카드
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-coffee/68">
              책을 읽은 날짜, 표시한 문장, 모임에서 생긴 질문을 부드러운 카드로
              모아 다음 대화를 준비합니다.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <motion.img
              src={bearPeeking}
              alt="기록을 살펴보는 ODM 곰"
              className="h-auto w-full max-w-[12rem] object-contain drop-shadow-[0_18px_30px_rgba(83,58,42,.14)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.4, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
              draggable="false"
            />
          </div>
        </div>
        <div className="mt-11 grid gap-5 lg:grid-cols-[1fr_.92fr]">
          <div className="grid gap-4">
            {recordCards.map((record, index) => (
              <motion.article
                key={record.title}
                className="lift-card rounded-[1.6rem] border border-coffee/10 bg-ivory/74 p-5 shadow-warm backdrop-blur-xl"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.62, delay: index * 0.08 }}
                whileHover={{ y: -5, scale: 1.01 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-linen/52 px-3 py-1 text-sm text-coffee/70">
                    {record.book}
                  </span>
                  <span className="text-sm text-caramel">{record.meta}</span>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-espresso">{record.title}</h3>
                <p className="mt-3 leading-7 text-coffee/72">{record.note}</p>
              </motion.article>
            ))}
          </div>
          <motion.aside
            className="note-card rounded-[2rem] border border-coffee/10 bg-paper/78 p-5 shadow-premium backdrop-blur-xl"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-[1.45rem] bg-white/52 p-5 shadow-inner-warm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-caramel">독후감</p>
                  <h3 className="mt-1 text-2xl font-bold text-espresso">나의 작은 리뷰</h3>
                </div>
                <span className="rounded-full bg-matcha/14 px-3 py-1 text-sm text-matcha">
                  저장됨
                </span>
              </div>
              <div className="mt-5 rounded-[1.2rem] border border-coffee/8 bg-ivory/82 p-4">
                <p className="text-sm font-bold text-coffee/58">작별하지 않는다</p>
                <p className="mt-3 min-h-[9rem] leading-8 text-coffee/76">
                  오래 붙잡고 있던 장면이 모임의 댓글을 만나 다시 열렸다. 완독의
                  감정보다 함께 되짚은 문장이 더 선명하게 남는다.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold text-coffee/64">
                <span className="rounded-full bg-linen/46 px-3 py-1">감상 메모</span>
                <span className="rounded-full bg-linen/46 px-3 py-1">문장 인용</span>
                <span className="rounded-full bg-linen/46 px-3 py-1">모임 공유</span>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}
