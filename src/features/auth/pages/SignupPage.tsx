import { Link, useNavigate } from "react-router-dom";
import AuthButton from "@/features/auth/components/AuthButton";
import AuthInput from "@/features/auth/components/AuthInput";
import AuthLayout from "@/features/auth/components/AuthLayout";
import AuthTabs from "@/features/auth/components/AuthTabs";
import PasswordInput from "@/features/auth/components/PasswordInput";
import ProfileImageUpload from "@/features/auth/components/ProfileImageUpload";
import { useSignupForm } from "@/features/auth/hooks/useAuthForm";

export default function SignupPage() {
  const navigate = useNavigate();
  const { values, updateValue, selectProfileImage, submit, isSubmitting, error } = useSignupForm(() => {
    navigate("/signup-complete", { replace: true });
  });

  return (
    <AuthLayout compactHeader>
      <AuthTabs current="signup" />
      <div className="auth-heading">
        <h1>독서 여정을 시작해요</h1>
        <p>읽고 기록하고 연결되는 나만의 조용한 공간을 만들어보세요.</p>
      </div>

      <form className="auth-form auth-signup-form" onSubmit={submit}>
        <AuthInput
          id="signup-email"
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="reader@odm.kr"
          value={values.email}
          onChange={(event) => updateValue("email", event.target.value)}
          required
        />
        <PasswordInput
          id="signup-password"
          autoComplete="new-password"
          placeholder="8자 이상의 비밀번호"
          minLength={8}
          value={values.password}
          onChange={(event) => updateValue("password", event.target.value)}
          required
        />
        <AuthInput
          id="signup-nickname"
          label="닉네임"
          type="text"
          autoComplete="nickname"
          placeholder="문장수집가"
          value={values.nickname}
          onChange={(event) => updateValue("nickname", event.target.value)}
          required
        />
        <ProfileImageUpload file={values.profileImage} onChange={selectProfileImage} />
        <label className="auth-field" htmlFor="signup-introduction">
          <span>소개</span>
          <textarea
            id="signup-introduction"
            className="auth-input auth-textarea"
            placeholder="좋아하는 책이나 독서 취향을 알려주세요."
            maxLength={200}
            value={values.introduction}
            onChange={(event) => updateValue("introduction", event.target.value)}
          />
          <small className="auth-count">{values.introduction.length}/200</small>
        </label>
        {error && <p className="auth-error">{error}</p>}
        <AuthButton disabled={isSubmitting}>
          {isSubmitting ? "가입 중..." : "Signup"}
        </AuthButton>
      </form>
      <p className="auth-switch">
        이미 계정이 있으신가요?
        <Link to="/login">로그인하기</Link>
      </p>
    </AuthLayout>
  );
}
