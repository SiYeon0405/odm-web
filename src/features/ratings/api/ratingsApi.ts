import axios from "axios";
import type { CreateUserRatingRequest, UserRating, UserRatingListResponse } from "@/features/ratings/types";

const ACCESS_TOKEN_KEY = "odm_accessToken";
const DEFAULT_BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

type ApiResponse<T> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
  result?: T;
};

type UserRatingResponse = {
  ratingId?: number;
  id?: number;
  reviewerId?: number;
  targetUserId?: number;
  score?: number;
  comment?: string;
  createdAt?: string;
};

type UserRatingListApiResponse = {
  averageScore?: number;
  totalRatings?: number;
  ratings?: UserRatingResponse[];
  content?: UserRatingResponse[];
  totalPages?: number;
  page?: number;
  number?: number;
  size?: number;
};

const ratingsClient = axios.create({
  baseURL: BASE_URL,
});

function getAuthHeaders() {
  if (typeof window === "undefined") return undefined;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken) return undefined;

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

function requireAuthHeaders() {
  const headers = getAuthHeaders();
  if (headers) return headers;

  throw new Error("로그인이 필요합니다.");
}

function unwrapApiResponse<T>(responseData: ApiResponse<T> | T): T {
  if (responseData && typeof responseData === "object") {
    if ("data" in responseData && (responseData as ApiResponse<T>).data !== undefined) {
      return (responseData as ApiResponse<T>).data as T;
    }
    if ("result" in responseData && (responseData as ApiResponse<T>).result !== undefined) {
      return (responseData as ApiResponse<T>).result as T;
    }
  }

  return responseData as T;
}

function normalizeRating(data: UserRatingResponse): UserRating {
  return {
    ratingId: data.ratingId ?? data.id ?? 0,
    reviewerId: data.reviewerId ?? 0,
    targetUserId: data.targetUserId ?? 0,
    score: data.score ?? 0,
    comment: data.comment,
    createdAt: data.createdAt ?? "",
  };
}

function normalizeRatingList(data: UserRatingListApiResponse | undefined, page: number, size: number): UserRatingListResponse {
  const ratings = data?.ratings ?? data?.content ?? [];

  return {
    averageScore: data?.averageScore ?? 0,
    totalRatings: data?.totalRatings ?? ratings.length,
    ratings: ratings.map(normalizeRating),
    totalPages: data?.totalPages ?? 0,
    page: data?.page ?? data?.number ?? page,
    size: data?.size ?? size,
  };
}

export function getRatingErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const code = error.response?.data?.code;

    switch (code) {
      case "RATING_ALREADY_EXISTS":
        return "이미 평가한 사용자입니다.";
      case "SELF_RATING_NOT_ALLOWED":
        return "자기 자신은 평가할 수 없습니다.";
      case "CLUB_NOT_FINISHED":
        return "모임 종료 후 평가할 수 있습니다.";
      case "INVALID_RATING_SCORE":
        return "평점은 1점부터 5점까지 입력할 수 있습니다.";
      case "RATING_NOT_ALLOWED":
        return "사용자를 평가할 권한이 없습니다.";
      case "USER_NOT_FOUND":
        return "사용자를 찾을 수 없습니다.";
      case "CLUB_NOT_FOUND":
        return "독서모임을 찾을 수 없습니다.";
      default:
        break;
    }

    if (error.response?.status === 401) return "로그인이 필요합니다.";
    if (error.response?.status === 403) return "사용자를 평가할 권한이 없습니다.";
    return error.response?.data?.message || error.message;
  }

  return error instanceof Error ? error.message : "사용자 평가 요청을 처리하지 못했습니다.";
}

export async function createUserRating(payload: CreateUserRatingRequest): Promise<UserRating> {
  const response = await ratingsClient.post<ApiResponse<UserRatingResponse>>("/api/ratings", payload, {
    headers: requireAuthHeaders(),
  });
  const data = unwrapApiResponse(response.data);

  return normalizeRating(data);
}

export async function getMyRatings(page = 0, size = 20): Promise<UserRatingListResponse> {
  const response = await ratingsClient.get<ApiResponse<UserRatingListApiResponse>>("/api/ratings/me", {
    headers: requireAuthHeaders(),
    params: { page, size },
  });
  const data = unwrapApiResponse(response.data);

  return normalizeRatingList(data, page, size);
}

export async function getUserRatings(userId: number, page = 0, size = 20): Promise<UserRatingListResponse> {
  const response = await ratingsClient.get<ApiResponse<UserRatingListApiResponse>>(`/api/ratings/user/${userId}`, {
    params: { page, size },
  });
  const data = unwrapApiResponse(response.data);

  return normalizeRatingList(data, page, size);
}
