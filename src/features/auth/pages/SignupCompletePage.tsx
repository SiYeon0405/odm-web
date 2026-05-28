import { useNavigate } from "react-router-dom";
import AuthButton from "@/features/auth/components/AuthButton";
import AuthLayout from "@/features/auth/components/AuthLayout";

export default function SignupCompletePage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <section className="auth-complete">
        <span className="auth-complete-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m6 12 4 4 8-9" />
          </svg>
        </span>
        <h1>회원가입이 완료되었습니다!</h1>
        <p>로그인하여 ODM 서비스를 이용해보세요.</p>
        <AuthButton onClick={() => navigate("/login", { replace: true })}>Login</AuthButton>
      </section>
    </AuthLayout>
  );
}
