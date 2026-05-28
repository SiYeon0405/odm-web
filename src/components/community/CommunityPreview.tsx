import { motion } from "framer-motion";
import { fadeUp } from "@/animations/motion";
import { readingNotes } from "@/data/home";

export default function CommunityPreview() {
  return (
    <section id="community" className="px-4 py-24 md:py-28">
      <motion.div
        className="mx-auto max-w-6xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
      >
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-caramel">Reading notes</p>
        <h2 className="mt-4 max-w-2xl text-balance text-3xl font-bold leading-tight text-espresso md:text-5xl">
          커뮤니티보다 독서 기록장에 가까운 대화
        </h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {readingNotes.map((note, index) => (
            <motion.article
              key={note.nickname}
              className="note-card rounded-[1.7rem] border border-coffee/10 bg-paper/76 p-6 shadow-warm backdrop-blur-xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="flex items-center justify-between gap-4 text-sm font-bold">
                <span className="text-espresso">{note.nickname}</span>
                <span className="rounded-full bg-linen/48 px-3 py-1 text-coffee/62">{note.pages}</span>
              </div>
              <blockquote className="mt-7 border-l border-caramel/42 pl-4 text-lg leading-8 text-coffee/78">
                {note.quote}
              </blockquote>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-caramel">
                <span aria-hidden="true">+</span>
                <span>공감 {note.likes}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
