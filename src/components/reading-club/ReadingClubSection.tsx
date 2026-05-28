import { motion } from "framer-motion";
import { fadeUp } from "@/animations/motion";
import { readingClubs, type ReadingClub } from "@/data/home";

function ClubCard({ club }: { club: ReadingClub }) {
  return (
    <motion.article
      className="club-card h-full rounded-[1.7rem] border border-coffee/10 bg-ivory/74 p-4 shadow-warm backdrop-blur-xl"
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid gap-4 sm:grid-cols-[7.4rem_1fr]">
        <div
          className={`book-cover flex min-h-[10rem] items-end rounded-[1.15rem] bg-gradient-to-br ${club.coverTone} p-4 text-ivory shadow-soft`}
        >
          <span className="text-lg font-bold leading-tight">{club.title}</span>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-sm text-coffee/56">{club.author}</p>
            <h3 className="mt-1 text-2xl font-bold text-espresso">{club.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold text-coffee/68">
              <span className="rounded-full bg-linen/54 px-3 py-1">모집 {club.capacity}명</span>
              <span className="rounded-full bg-white/64 px-3 py-1">참여 {club.participants}명</span>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm font-bold text-coffee/62">
              <span>진행 상태</span>
              <span>{club.progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-coffee/10">
              <span
                className="block h-full rounded-full bg-[linear-gradient(90deg,#b17e4b,#66735b)]"
                style={{ width: `${club.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ReadingClubSection() {
  return (
    <section id="clubs" className="section-band px-4 py-24 md:py-28">
      <motion.div
        className="mx-auto max-w-6xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
      >
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-caramel">Reading clubs</p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-balance text-3xl font-bold leading-tight text-espresso md:text-5xl">
            지금 함께 읽고 있는 모임
          </h2>
          <p className="max-w-xl leading-7 text-coffee/68">
            책과 진도, 함께 읽는 사람의 온도를 한눈에 확인하고 차분하게 합류할 수
            있습니다.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {readingClubs.map((club) => (
            <ClubCard key={club.title} club={club} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
