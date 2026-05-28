import type { InputHTMLAttributes } from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function AuthInput({ id, label, ...props }: AuthInputProps) {
  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} className="auth-input" {...props} />
    </label>
  );
}
