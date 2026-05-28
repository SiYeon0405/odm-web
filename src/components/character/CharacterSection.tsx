import { motion } from "framer-motion";
import bearBooksReading from "@/assets/bear_books_reading.png";
import bearProneReading from "@/assets/bear_prone_reading.png";
import bearReviewWriting from "@/assets/bear_review_writing.png";
import bearTeaReading from "@/assets/bear_tea_reading.png";
import { fadeUp, floatLoop } from "@/animations/motion";

type BearMoment = {
  label: string;
  image: string;
  className: string;
  delay: number;
};

const bearMoments: BearMoment[] = [
  { label: "독후감을 쓰는 ODM 곰", image: bearReviewWriting, className: "max-w-[13rem]", delay: 0 },
  { label: "엎드려서 책을 읽는 ODM 곰", image: bearProneReading, className: "max-w-[12rem]", delay: 0.45 },
  { label: "차를 마시며 책을 읽는 ODM 곰", image: bearTeaReading, className: "max-w-[14rem]", delay: 0.9 },
  { label: "책 위에 앉아 책 읽는 ODM 곰", image: bearBooksReading, className: "max-w-[12rem]", delay: 1.35 },
];

export default function CharacterSection() {
  return (
    <section className="section-band px-4 py-24 md:py-28">
      <motion.div
        className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.82fr_1.18fr]"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-caramel">ODM character</p>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-espresso md:text-5xl">
            같은 책상에 머무는 작은 독서 시간
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-coffee/68">
            ODM 곰들은 책을 읽고, 메모하고, 잠시 누워 쉬고, 다음 문장을 고민하는
            독서의 리듬을 그대로 보여줍니다.
          </p>
        </div>
        <div className="character-shelf grid gap-4 rounded-[2rem] border border-coffee/10 bg-ivory/68 p-5 shadow-premium backdrop-blur-xl sm:grid-cols-2 xl:grid-cols-4">
          {bearMoments.map((bear) => (
            <motion.figure
              key={bear.label}
              className="flex min-h-[14rem] items-center justify-center overflow-hidden rounded-[1.4rem] border border-coffee/8 bg-white/46 p-4"
              animate={floatLoop(bear.delay)}
            >
              <img
                src={bear.image}
                alt={bear.label}
                className={`h-auto w-full object-contain drop-shadow-[0_18px_28px_rgba(83,58,42,.16)] ${bear.className}`}
                draggable="false"
              />
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
