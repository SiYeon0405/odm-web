import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthButton from "@/features/auth/components/AuthButton";
import AuthInput from "@/features/auth/components/AuthInput";
import AuthLayout from "@/features/auth/components/AuthLayout";
import PasswordInput from "@/features/auth/components/PasswordInput";
import { useLoginForm, useSignupForm } from "@/features/auth/hooks/useAuthForm";

type LoginLocationState = {
  from?: string;
};

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";
  const state = location.state as LoginLocationState | null;
  const destination = state?.from ?? "/home";
  const loginForm = useLoginForm(() => navigate(destination, { replace: true }));
  const signupForm = useSignupForm(() => navigate("/signup-complete", { replace: true }));
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const openLogin = () => navigate("/login", { state: location.state });
  const openSignup = () => navigate("/signup", { state: location.state });

  const submitSignup = (event: FormEvent<HTMLFormElement>) => {
    if (signupForm.values.password !== confirmPassword) {
      event.preventDefault();
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setPasswordError("");
    void signupForm.submit(event);
  };

  return (
    <AuthLayout wide>
      <div className={`auth-portal ${isSignup ? "is-signup" : ""}`}>
        <section className="auth-form-panel auth-login-panel" aria-hidden={isSignup}>
          <div className="auth-heading auth-heading-left">
            <p className="auth-kicker">Welcome Back</p>
            <h1>다시, 책상 앞에 앉아볼까요?</h1>
            <p>이어 읽던 책과 모임의 이야기가 기다리고 있어요.</p>
          </div>

          <form className="auth-form" onSubmit={loginForm.submit}>
            <AuthInput
              id="login-email"
              label="이메일"
              type="email"
              autoComplete="email"
              placeholder="reader@odm.kr"
              value={loginForm.values.email}
              onChange={(event) => loginForm.updateValue("email", event.target.value)}
              disabled={isSignup || loginForm.isSubmitting}
              required
            />
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
              value={loginForm.values.password}
              onChange={(event) => loginForm.updateValue("password", event.target.value)}
              disabled={isSignup || loginForm.isSubmitting}
              required
            />
            <div className="auth-options">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={loginForm.values.keepSignedIn}
                  onChange={(event) => loginForm.updateValue("keepSignedIn", event.target.checked)}
                  disabled={isSignup || loginForm.isSubmitting}
                />
                <span>로그인 상태 유지</span>
              </label>
              <button className="auth-link-button" type="button" disabled={isSignup}>
                비밀번호 찾기
              </button>
            </div>
            {loginForm.error && <p className="auth-error">{loginForm.error}</p>}
            <AuthButton disabled={isSignup || loginForm.isSubmitting}>
              {loginForm.isSubmitting ? "로그인 중..." : "로그인"}
            </AuthButton>
          </form>
        </section>

        <section className="auth-form-panel auth-signup-panel" aria-hidden={!isSignup}>
          <div className="auth-heading auth-heading-left">
            <p className="auth-kicker">Join ODM</p>
            <h1>새로운 독서 모임을 시작해요</h1>
            <p>취향이 닮은 독서가들과 문장으로 연결됩니다.</p>
          </div>

          <form className="auth-form auth-signup-form" onSubmit={submitSignup}>
            <AuthInput
              id="signup-email"
              label="이메일"
              type="email"
              autoComplete="email"
              placeholder="reader@odm.kr"
              value={signupForm.values.email}
              onChange={(event) => signupForm.updateValue("email", event.target.value)}
              disabled={!isSignup || signupForm.isSubmitting}
              required
            />
            <AuthInput
              id="signup-nickname"
              label="닉네임"
              type="text"
              autoComplete="nickname"
              placeholder="문장수집가"
              value={signupForm.values.nickname}
              onChange={(event) => signupForm.updateValue("nickname", event.target.value)}
              disabled={!isSignup || signupForm.isSubmitting}
              required
            />
            <div className="auth-password-row">
              <PasswordInput
                id="signup-password"
                label="비밀번호"
                autoComplete="new-password"
                placeholder="8자 이상"
                minLength={8}
                value={signupForm.values.password}
                onChange={(event) => signupForm.updateValue("password", event.target.value)}
                disabled={!isSignup || signupForm.isSubmitting}
                required
              />
              <PasswordInput
                id="signup-confirm-password"
                label="비밀번호 확인"
                autoComplete="new-password"
                placeholder="다시 입력"
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={!isSignup || signupForm.isSubmitting}
                required
              />
            </div>
            <label className="auth-field" htmlFor="signup-introduction">
              <span>소개</span>
              <textarea
                id="signup-introduction"
                className="auth-input auth-textarea"
                placeholder="좋아하는 책이나 독서 취향을 알려주세요."
                maxLength={200}
                value={signupForm.values.introduction}
                onChange={(event) => signupForm.updateValue("introduction", event.target.value)}
                disabled={!isSignup || signupForm.isSubmitting}
              />
              <small className="auth-count">{signupForm.values.introduction.length}/200</small>
            </label>
            {(passwordError || signupForm.error) && (
              <p className="auth-error">{passwordError || signupForm.error}</p>
            )}
            <AuthButton disabled={!isSignup || signupForm.isSubmitting}>
              {signupForm.isSubmitting ? "가입 중..." : "회원가입"}
            </AuthButton>
          </form>
        </section>

        <aside className="auth-story-panel">
          <div className="auth-story auth-story-signin">
            <p className="auth-story-label">Online Reading Community</p>
            <h2>혼자 읽던 독서를<br />함께 연결하다</h2>
            <p>ODM에서 새로운 독서모임을 시작하고, 오늘의 문장을 함께 나눠보세요.</p>
            <button className="auth-outline-button" type="button" onClick={openSignup}>
              ODM 시작하기
            </button>
          </div>
          <div className="auth-story auth-story-signup">
            <p className="auth-story-label">A Quiet Reading Room</p>
            <h2>책을 사랑하는 사람들이<br />머무는 공간</h2>
            <p>따뜻한 기록과 대화가 쌓이는 ODM에서 나만의 독서 시간을 이어가세요.</p>
            <button className="auth-outline-button" type="button" onClick={openLogin}>
              이미 계정이 있으신가요?
            </button>
          </div>
        </aside>
      </div>
    </AuthLayout>
  );
}
