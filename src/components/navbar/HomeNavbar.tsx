import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { softEase } from "@/animations/motion";
import OdmLogo from "@/components/shared/OdmLogo";
import Button from "@/components/ui/Button";

const menuItems = [
  { label: "홈", href: "#clubs" },
  { label: "책 검색", href: "#records" },
  { label: "독서 모임", href: "#community" },
  { label: "내 독서모임", href: "/my-clubs" },
];

export default function HomeNavbar() {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 py-4"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.72, ease: softEase }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-coffee/10 bg-ivory/72 px-4 py-3 shadow-warm backdrop-blur-2xl md:px-6">
        <Link to="/" aria-label="ODM 랜딩으로 이동" className="shrink-0">
          <OdmLogo className="home-navbar-logo h-10 w-[5.8rem] md:w-[6.6rem]" />
        </Link>
        <div className="hidden items-center gap-7 text-sm font-bold text-coffee/74 lg:flex">
          {menuItems.map((item) =>
            item.href.startsWith("/") || item.label === "홈" ? (
              <Link
                key={item.label}
                to={item.label === "홈" ? "/home" : item.href}
                className="transition hover:text-espresso"
              >
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className="transition hover:text-espresso">
                {item.label}
              </a>
            ),
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button href="/login" variant="secondary" className="min-h-11 px-6 text-sm max-[374px]:!px-3">
            로그인
          </Button>
          <Button href="/" variant="secondary" className="min-h-11 px-6 text-sm max-[374px]:!px-3">
            랜딩으로
          </Button>
        </div>
      </nav>
    </motion.header>
  );
}
