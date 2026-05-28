import Reveal from "@/components/Reveal.jsx";

export default function SectionHeading({ kicker, title, body, align = "center" }) {
  return (
    <Reveal className={`mx-auto max-w-3xl ${align === "left" ? "mx-0 text-left" : "text-center"}`}>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-caramel">{kicker}</p>
      <h2 className="text-balance text-3xl font-bold leading-tight text-espresso md:text-5xl">{title}</h2>
      {body && <p className="mt-5 text-base leading-8 text-coffee/72 md:text-lg">{body}</p>}
    </Reveal>
  );
}
