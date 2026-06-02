import axios from "axios";

export type MockUser = {
  id: string;
  nickname: string;
  email?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
  profileImage: null;
  introduction: string | null;
};

export type UserResponse = {
  userId: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  introduction: string | null;
  mannerScore: number;
  blacklistCount: number;
  createdAt: string;
  updatedAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  tokenType: string;
  accessToken: string;
};

export type LoginPayload = LoginRequest & {
  keepSignedIn: boolean;
};

export type SignupPayload = {
  email: string;
  password: string;
  nickname: string;
  profileImage: File | null;
  introduction: string;
};

export type SocialProvider = "google" | "kakao";

type AuthResponse = LoginResponse & {
  user: MockUser;
};

const ACCESS_TOKEN_KEY = "odm_accessToken";
const NICKNAME_KEY = "odm_nickname";
const USER_KEY = "odm_user";
const MOCK_ACCESS_TOKEN = "mock-jwt-access-token";
const DEFAULT_BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

const authClient = axios.create({
  baseURL: BASE_URL,
});

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message || error.message;
  }

  return error instanceof Error ? error.message : "요청 처리 중 문제가 발생했습니다.";
}

function reportError(error: unknown): never {
  window.alert(getErrorMessage(error));
  throw error;
}

export function getCurrentUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken || accessToken === MOCK_ACCESS_TOKEN) return null;

  return {
    id: "authenticated-reader",
    nickname: window.localStorage.getItem(NICKNAME_KEY) || "회원",
  };
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const request: LoginRequest = {
      email: payload.email,
      password: payload.password,
    };
    const response = await authClient.post<ApiResponse<LoginResponse>>("/api/auth/login", request);
    const { accessToken, tokenType } = response.data.data;
    const user = {
      id: "authenticated-reader",
      email: payload.email,
      nickname: window.localStorage.getItem(NICKNAME_KEY) || "회원",
    };

    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("odm-auth-change"));

    return { accessToken, tokenType, user };
  } catch (error) {
    reportError(error);
  }
}

export async function signup(payload: SignupPayload): Promise<UserResponse> {
  try {
    const request: SignupRequest = {
      email: payload.email,
      password: payload.password,
      nickname: payload.nickname,
      profileImage: null,
      introduction: payload.introduction.trim() || null,
    };
    const response = await authClient.post<ApiResponse<UserResponse>>("/api/users/signup", request);

    window.localStorage.setItem(NICKNAME_KEY, response.data.data.nickname);
    return response.data.data;
  } catch (error) {
    reportError(error);
  }
}

export async function socialLogin(_provider: SocialProvider): Promise<AuthResponse> {
  throw new Error("소셜 로그인 API는 아직 연결되지 않았습니다.");
}

export function signOutMockAccount() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(NICKNAME_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("odm-auth-change"));
}
