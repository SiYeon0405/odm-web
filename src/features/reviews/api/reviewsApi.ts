import axios from "axios";
import type { ReviewUpdateRequest } from "@/features/reviews/types";

const ACCESS_TOKEN_KEY = "odm_accessToken";
const DEFAULT_BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

type ApiResponse<T> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
};

type ReviewResponse = {
  reviewId?: number;
  id?: number;
  clubId?: number;
  bookId?: number;
  userId?: number;
  writerId?: number;
  writerNickname?: string;
  authorNickname?: string;
  title?: string;
  content?: string;
  rating?: number | null;
  readPage?: number | null;
  likeCount?: number;
  likes?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ReviewPageResponse = {
  content?: ReviewResponse[];
  reviews?: ReviewResponse[];
  data?: ReviewPageResponse;
  result?: ReviewPageResponse;
  totalPages?: number;
  totalElements?: number;
  number?: number;
  page?: number;
  size?: number;
};

export type Review = {
  reviewId: number;
  clubId?: number;
  bookId?: number;
  userId?: number;
  writerNickname?: string;
  title: string;
  content: string;
  rating?: number | null;
  readPage?: number | null;
  likeCount?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewPage = {
  content: Review[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};

type CreateReviewRequest = {
  clubId: number;
  title: string;
  content: string;
  rating?: number | null;
  readPage?: number | null;
};

const reviewsClient = axios.create({
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
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    return (responseData as ApiResponse<T>).data as T;
  }

  return responseData as T;
}

function normalizeReview(data: ReviewResponse): Review {
  return {
    reviewId: data.reviewId ?? data.id ?? 0,
    clubId: data.clubId,
    bookId: data.bookId,
    userId: data.userId ?? data.writerId,
    writerNickname: data.writerNickname ?? data.authorNickname,
    title: data.title ?? "",
    content: data.content ?? "",
    rating: data.rating,
    readPage: data.readPage,
    likeCount: data.likeCount ?? data.likes,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function normalizeReviewPage(data: ReviewPageResponse | ReviewResponse[] | undefined, page: number, size: number): ReviewPage {
  if (!data) {
    return { content: [], totalPages: 0, totalElements: 0, number: page, size };
  }

  if (Array.isArray(data)) {
    return {
      content: data.map(normalizeReview),
      totalPages: 1,
      totalElements: data.length,
      number: page,
      size,
    };
  }

  const pageData = data.content || data.reviews ? data : data.data ?? data.result ?? data;
  const content = pageData.content ?? pageData.reviews ?? [];
  return {
    content: content.map(normalizeReview),
    totalPages: pageData.totalPages ?? 0,
    totalElements: pageData.totalElements ?? content.length,
    number: pageData.number ?? pageData.page ?? page,
    size: pageData.size ?? size,
  };
}

export function getReviewErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const code = error.response?.data?.code;

    switch (code) {
      case "CLUB_NOT_FINISHED":
        return "독서모임이 종료된 후 독후감을 작성할 수 있습니다.";
      case "NOT_CLUB_MEMBER":
        return "모임 참여자만 독후감을 작성할 수 있습니다.";
      case "EMPTY_REVIEW_TITLE":
        return "독후감 제목을 입력해주세요.";
      case "EMPTY_REVIEW_CONTENT":
        return "독후감 내용을 입력해주세요.";
      case "INVALID_REVIEW_RATING":
        return "평점은 1점부터 5점까지 입력할 수 있습니다.";
      case "INVALID_READ_PAGE":
        return "읽은 페이지는 0 이상이어야 합니다.";
      case "CLUB_NOT_FOUND":
        return "독서모임을 찾을 수 없습니다.";
      case "REVIEW_NOT_FOUND":
        return "발행된 독후감을 찾을 수 없습니다.";
      case "REVIEW_ACCESS_DENIED":
        return "독후감을 수정하거나 삭제할 권한이 없습니다.";
      case "REVIEW_ALREADY_DELETED":
        return "이미 삭제된 독후감입니다.";
      case "REVIEW_LIKE_ALREADY_EXISTS":
        return "이미 좋아요한 독후감입니다.";
      case "REVIEW_LIKE_NOT_FOUND":
        return "좋아요한 독후감이 아닙니다.";
      case "BOOKMARK_ALREADY_EXISTS":
        return "이미 북마크한 독후감입니다.";
      case "BOOKMARK_NOT_FOUND":
        return "북마크한 독후감이 아닙니다.";
      default:
        break;
    }

    if (error.response?.status === 404) return "발행된 독후감을 찾을 수 없습니다.";
    if (error.response?.status === 401) return "로그인이 필요합니다.";
    if (error.response?.status === 403) return "접근 권한이 없습니다.";
  }

  return error instanceof Error ? error.message : "독후감 요청을 처리하지 못했습니다.";
}

export async function createReview(request: CreateReviewRequest): Promise<Review> {
  const response = await reviewsClient.post<ApiResponse<ReviewResponse> | ReviewResponse>("/api/reviews", request, {
    headers: requireAuthHeaders(),
  });
  const payload = unwrapApiResponse(response.data);

  return normalizeReview(payload);
}

export async function publishReview(reviewId: number): Promise<Review> {
  const response = await reviewsClient.patch<ApiResponse<ReviewResponse> | ReviewResponse>(
    `/api/reviews/${reviewId}/publish`,
    undefined,
    {
      headers: requireAuthHeaders(),
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeReview(payload);
}

export async function updateReview(reviewId: number, request: ReviewUpdateRequest): Promise<Review> {
  const response = await reviewsClient.put<ApiResponse<ReviewResponse> | ReviewResponse>(
    `/api/reviews/${reviewId}`,
    request,
    {
      headers: requireAuthHeaders(),
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeReview(payload);
}

export async function deleteReview(reviewId: number): Promise<void> {
  await reviewsClient.delete(`/api/reviews/${reviewId}`, {
    headers: requireAuthHeaders(),
  });
}

export async function likeReview(reviewId: number): Promise<void> {
  await reviewsClient.post(`/api/reviews/${reviewId}/likes`, undefined, {
    headers: requireAuthHeaders(),
  });
}

export async function unlikeReview(reviewId: number): Promise<void> {
  await reviewsClient.delete(`/api/reviews/${reviewId}/likes`, {
    headers: requireAuthHeaders(),
  });
}

export async function getReviewLikeCount(reviewId: number): Promise<number> {
  const response = await reviewsClient.get<ApiResponse<number>>(`/api/reviews/${reviewId}/likes/count`, {
    headers: requireAuthHeaders(),
  });

  return response.data.data ?? 0;
}

export async function bookmarkReview(reviewId: number): Promise<void> {
  await reviewsClient.post(`/api/bookmarks/reviews/${reviewId}`, undefined, {
    headers: requireAuthHeaders(),
  });
}

export async function unbookmarkReview(reviewId: number): Promise<void> {
  await reviewsClient.delete(`/api/bookmarks/reviews/${reviewId}`, {
    headers: requireAuthHeaders(),
  });
}

export async function getReviewById(reviewId: number): Promise<Review> {
  const response = await reviewsClient.get<ApiResponse<ReviewResponse> | ReviewResponse>(`/api/reviews/${reviewId}`);
  const payload = unwrapApiResponse(response.data);

  return normalizeReview(payload);
}

export async function getReviews(page = 0, size = 20): Promise<ReviewPage> {
  const response = await reviewsClient.get<ApiResponse<ReviewPageResponse> | ReviewPageResponse>("/api/reviews", {
    params: { page, size },
  });
  const payload = unwrapApiResponse(response.data);

  return normalizeReviewPage(payload, page, size);
}

export async function getClubReviews(clubId: number, page = 0, size = 20): Promise<ReviewPage> {
  const response = await reviewsClient.get<ApiResponse<ReviewPageResponse> | ReviewPageResponse>(
    `/api/clubs/${clubId}/reviews`,
    {
      params: { page, size },
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeReviewPage(payload, page, size);
}

export async function getMyReviews(page = 0, size = 20): Promise<ReviewPage> {
  const response = await reviewsClient.get<ApiResponse<ReviewPageResponse> | ReviewPageResponse>(
    "/api/users/me/reviews",
    {
      headers: requireAuthHeaders(),
      params: { page, size },
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeReviewPage(payload, page, size);
}
