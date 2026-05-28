import type { ButtonHTMLAttributes } from "react";

type Provider = "google" | "kakao";

type SocialLoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  provider: Provider;
};

export default function SocialLoginButton({ provider, ...props }: SocialLoginButtonProps) {
  const config = {
    google: { mark: "G", label: "구글 로그인" },
    kakao: { mark: "K", label: "카카오 로그인" },
  }[provider];

  return (
    <button type="button" className={`auth-social auth-social-${provider}`} {...props}>
      <span className="auth-social-mark" aria-hidden="true">{config.mark}</span>
      {config.label}
    </button>
  );
}
