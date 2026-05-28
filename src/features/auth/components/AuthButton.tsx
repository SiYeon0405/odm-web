import type { ButtonHTMLAttributes } from "react";

export default function AuthButton({
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`auth-submit ${className}`} {...props}>
      {children}
    </button>
  );
}
