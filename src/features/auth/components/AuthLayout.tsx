import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import OdmLogo from "@/components/shared/OdmLogo";
import "@/features/auth/styles/auth.css";

type AuthLayoutProps = {
  children: ReactNode;
  compactHeader?: boolean;
  wide?: boolean;
};

export default function AuthLayout({
  children,
  compactHeader = false,
  wide = false,
}: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <div className="auth-grid" aria-hidden="true" />
      <section className={`auth-shell ${compactHeader ? "auth-shell-compact" : ""} ${wide ? "auth-shell-wide" : ""}`}>
        <header className="auth-brand">
          <Link to="/" aria-label="ODM 홈으로 이동">
            <OdmLogo className="auth-logo" />
          </Link>
        </header>
        <div className={`auth-card ${wide ? "auth-card-wide" : ""}`}>{children}</div>
        <p className="auth-copyright">A quiet reading community, ODM</p>
      </section>
    </main>
  );
}
