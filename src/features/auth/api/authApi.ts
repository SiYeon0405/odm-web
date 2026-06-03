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

export interface UserProfile {
  userId: number;
  email: string;
  nickname: string;
  introduction: string | null;
  profileImage: string | null;
  createdAt: string;
}

export type UpdateMyProfileRequest = {
  nickname: string;
  introduction: string | null;
};

export type MyClub = {
  id?: number;
  clubId?: number;
  name?: string;
  title?: string;
  description?: string;
  status?: string;
  [key: string]: unknown;
};

export type MyPost = {
  id?: number;
  postId?: number;
  title?: string;
  content?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export type MyReview = {
  id?: number;
  reviewId?: number;
  title?: string;
  bookTitle?: string;
  content?: string;
  createdAt?: string;
  [key: string]: unknown;
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

function getAuthHeaders() {
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken || accessToken === MOCK_ACCESS_TOKEN) return null;

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

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

export async function getMyProfile(): Promise<UserProfile | null> {
  const headers = getAuthHeaders();
  if (!headers) return null;

  const response = await authClient.get<ApiResponse<UserProfile>>("/api/users/me", {
    headers,
  });

  return response.data.data;
}

export async function updateMyProfile(payload: UpdateMyProfileRequest): Promise<UserProfile> {
  const headers = getAuthHeaders();
  if (!headers) throw new Error("로그인이 필요합니다.");

  const response = await authClient.put<ApiResponse<UserProfile>>("/api/users/me", payload, {
    headers,
  });

  window.localStorage.setItem(NICKNAME_KEY, response.data.data.nickname);
  window.dispatchEvent(new Event("odm-auth-change"));

  return response.data.data;
}

export async function uploadMyProfileImage(image: File): Promise<UserProfile> {
  const headers = getAuthHeaders();
  if (!headers) throw new Error("로그인이 필요합니다.");

  const formData = new FormData();
  formData.append("image", image);

  const response = await authClient.post<ApiResponse<UserProfile>>("/api/users/me/profile-image", formData, {
    headers,
  });

  return response.data.data;
}

export async function fetchMyClubs(page = 0, size = 20): Promise<MyClub[]> {
  const headers = getAuthHeaders();
  if (!headers) return [];

  const response = await authClient.get<ApiResponse<MyClub[] | { clubs?: MyClub[]; content?: MyClub[] }>>("/api/users/me/clubs", {
    headers,
    params: { page, size },
  });

  const data = response.data.data;
  return Array.isArray(data) ? data : data.clubs || data.content || [];
}

export async function fetchMyPosts(page = 0, size = 20): Promise<MyPost[]> {
  const headers = getAuthHeaders();
  if (!headers) return [];

  const response = await authClient.get<ApiResponse<MyPost[] | { posts?: MyPost[]; content?: MyPost[] }>>("/api/users/me/posts", {
    headers,
    params: { page, size },
  });

  const data = response.data.data;
  return Array.isArray(data) ? data : data.posts || data.content || [];
}

export async function fetchMyReviews(page = 0, size = 20): Promise<MyReview[]> {
  const headers = getAuthHeaders();
  if (!headers) return [];

  const response = await authClient.get<ApiResponse<{ reviews?: MyReview[] } | MyReview[]>>("/api/users/me/reviews", {
    headers,
    params: { page, size },
  });

  const data = response.data.data;
  return Array.isArray(data) ? data : data.reviews || [];
}

export async function deleteMyAccount(): Promise<ApiResponse<unknown>> {
  const headers = getAuthHeaders();
  if (!headers) throw new Error("로그인이 필요합니다.");

  const response = await authClient.delete<ApiResponse<unknown>>("/api/users/me", {
    headers,
  });

  signOutMockAccount();
  return response.data;
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
