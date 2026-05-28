import { useState, type ChangeEvent, type FormEvent } from "react";
import { login, signup, socialLogin, type SocialProvider } from "@/features/auth/api/authApi";

export type LoginFormValues = {
  email: string;
  password: string;
  keepSignedIn: boolean;
};

export type SignupFormValues = {
  email: string;
  password: string;
  nickname: string;
  profileImage: File | null;
  introduction: string;
};

const initialLoginValues: LoginFormValues = {
  email: "",
  password: "",
  keepSignedIn: false,
};

const initialSignupValues: SignupFormValues = {
  email: "",
  password: "",
  nickname: "",
  profileImage: null,
  introduction: "",
};

export function useLoginForm(onComplete: () => void) {
  const [values, setValues] = useState<LoginFormValues>(initialLoginValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateValue = <Key extends keyof LoginFormValues>(key: Key, value: LoginFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(values);
      onComplete();
    } catch {
      setError("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitSocial = async (provider: SocialProvider) => {
    setError("");
    setIsSubmitting(true);
    try {
      await socialLogin(provider);
      onComplete();
    } catch {
      setError("소셜 로그인 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, updateValue, submit, submitSocial, isSubmitting, error };
}

export function useSignupForm(onComplete: () => void) {
  const [values, setValues] = useState<SignupFormValues>(initialSignupValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateValue = <Key extends keyof SignupFormValues>(key: Key, value: SignupFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const selectProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
    updateValue("profileImage", event.target.files?.[0] ?? null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signup(values);
      onComplete();
    } catch {
      setError("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, updateValue, selectProfileImage, submit, isSubmitting, error };
}
