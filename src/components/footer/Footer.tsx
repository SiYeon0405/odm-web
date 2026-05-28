import OdmLogo from "@/components/shared/OdmLogo";

export default function Footer() {
  return (
    <footer className="w-full bg-[#2B160F] px-6 py-12 font-sans text-cream sm:px-8 md:py-14">
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
        <OdmLogo invert className="!h-auto !w-[7.25rem] sm:!w-[7.75rem]" />
        <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-cream/80">
          <a href="mailto:hello.psyeon@gmail.com" className="transition-colors hover:text-cream">
            hello.psyeon@gmail.com
          </a>
          <a href="https://github.com" className="transition-colors hover:text-cream">
            GitHub
          </a>
        </div>
        <p className="text-sm text-cream/56 md:justify-self-end md:text-right">
          Copyright 2026 ODM. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
