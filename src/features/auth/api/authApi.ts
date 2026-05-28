export type MockUser = {
  id: string;
  nickname: string;
  email?: string;
};

const ACCESS_TOKEN_KEY = "odm_accessToken";
const USER_KEY = "odm_user";
const MOCK_USER: MockUser = {
  id: "demo-reader",
  nickname: "문장수집가",
};

export type LoginPayload = {
  email: string;
  password: string;
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

type AuthResponse = {
  accessToken: string;
  user: MockUser;
};

function delay(duration = 500) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function createSession(user: MockUser): AuthResponse {
  const accessToken = "mock-jwt-access-token";
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("odm-auth-change"));
  return { accessToken, user };
}

export function getCurrentUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  if (!window.localStorage.getItem(ACCESS_TOKEN_KEY)) return null;

  const savedUser = window.localStorage.getItem(USER_KEY);
  return savedUser ? JSON.parse(savedUser) as MockUser : MOCK_USER;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  await delay();
  const nickname = payload.email.split("@")[0] || MOCK_USER.nickname;
  return createSession({ id: "mock-reader", email: payload.email, nickname });
}

export async function signup(payload: SignupPayload): Promise<MockUser> {
  await delay(650);
  return {
    id: "new-reader",
    email: payload.email,
    nickname: payload.nickname,
  };
}

export async function socialLogin(provider: SocialProvider): Promise<AuthResponse> {
  await delay();
  const nickname = provider === "kakao" ? "카카오 독서가" : "구글 독서가";
  return createSession({ id: `${provider}-reader`, nickname });
}

export function signInWithMockAccount(): MockUser {
  return createSession(MOCK_USER).user;
}

export function signOutMockAccount() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("odm-auth-change"));
}
