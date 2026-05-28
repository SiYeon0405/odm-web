import { Link } from "react-router-dom";

type AuthTabsProps = {
  current: "login" | "signup";
};

export default function AuthTabs({ current }: AuthTabsProps) {
  return (
    <nav className="auth-tabs" aria-label="인증 메뉴">
      <Link className={current === "login" ? "active" : ""} to="/login" aria-current={current === "login" ? "page" : undefined}>
        Login
      </Link>
      <Link className={current === "signup" ? "active" : ""} to="/signup" aria-current={current === "signup" ? "page" : undefined}>
        Signup
      </Link>
    </nav>
  );
}
