import { motion } from "framer-motion";
import { fadeUp, gentleStagger } from "@/animations/motion";
import Button from "@/components/ui/Button";

const deskNotes = ["함께 읽는 진도", "문장 메모", "조용한 토론", "나의 서재"];

export default function HeroSection() {
  return (
    <section className="relative px-4 pb-20 pt-36 md:pb-28 md:pt-44 lg:flex lg:h-[100svh] lg:items-center lg:overflow-hidden lg:pb-0 lg:pt-32">
      <motion.div
        className="relative mx-auto grid min-h-[70svh] max-w-6xl items-center gap-10 lg:min-h-0 lg:w-full lg:grid-cols-[1fr_.92fr]"
        variants={gentleStagger}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl text-center lg:text-left">
          <motion.p
            variants={fadeUp}
            className="inline-flex rounded-full border border-coffee/10 bg-white/48 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel backdrop-blur-xl"
          >
            ODM web reading room
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-6 text-balance text-4xl font-bold leading-[1.12] text-espresso sm:text-5xl md:text-6xl"
          >
            혼자 읽던 독서를 함께 기록하다
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-coffee/74 lg:mx-0"
          >
            ODM은 온라인 독서모임과 기록을 한 흐름으로 이어, 문장과 감상이 사람
            사이의 조용한 대화가 되는 웹 독서 공간입니다.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <Button href="/clubs">독서모임 둘러보기</Button>
            <Button href="#community" variant="secondary">
              베스트 셀러 둘러보기
            </Button>
          </motion.div>
        </div>
        <motion.aside
          variants={fadeUp}
          className="home-reading-desk mx-auto w-full max-w-[31rem] rounded-[2rem] border border-coffee/10 bg-paper/78 p-5 shadow-premium backdrop-blur-2xl"
        >
          <div className="rounded-[1.55rem] bg-[#f7ead8]/90 p-5 shadow-inner-warm">
            <div className="flex items-center justify-between text-sm font-bold text-coffee/64">
              <span>오늘의 함께 읽기</span>
              <span className="rounded-full bg-matcha/14 px-3 py-1 text-matcha">Quiet live</span>
            </div>
            <div className="mt-5 rounded-[1.25rem] bg-espresso p-5 text-cream">
              <p className="text-sm text-cream/66">기록으로 이어지는 독서모임</p>
              <p className="mt-2 text-2xl font-bold">이방인</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/14">
                <motion.span
                  className="block h-full w-[68%] rounded-full bg-[linear-gradient(90deg,#d7ad72,#9cb38c)]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.15, delay: 0.5 }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {deskNotes.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-coffee/8 bg-white/56 px-4 py-4 text-sm font-bold text-coffee/76"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </section>
  );
}
