import { useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

export default function PasswordInput({ id, label = "비밀번호", ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <span className="auth-password">
        <input id={id} className="auth-input" type={isVisible ? "text" : "password"} {...props} />
        <button
          type="button"
          className="auth-eye"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          {isVisible ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 3 21 21M10.6 10.7a2 2 0 0 0 2.7 2.7M9.4 5.3A10.7 10.7 0 0 1 12 5c5.8 0 9 7 9 7a16.8 16.8 0 0 1-3.4 4.1M6.1 6.2C4.1 7.7 3 12 3 12s3.2 7 9 7c1.1 0 2.2-.3 3.1-.7" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12s3.2-7 9-7 9 7 9 7-3.2 7-9 7-9-7-9-7Z" />
              <circle cx="12" cy="12" r="2.7" />
            </svg>
          )}
        </button>
      </span>
    </label>
  );
}
