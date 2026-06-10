import axios from "axios";
import type { Bookmark, BookmarkPage } from "@/features/bookmarks/types";

const ACCESS_TOKEN_KEY = "odm_accessToken";
const DEFAULT_BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

type ApiResponse<T> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
};

type BookmarkResponse = Partial<Bookmark> & {
  id?: number;
  postId?: number;
  reviewId?: number;
  bookmarkedAt?: string;
};

type BookmarkPageResponse = Partial<BookmarkPage> & {
  bookmarks?: BookmarkResponse[];
  bookmarkedPosts?: BookmarkResponse[];
  bookmarkedReviews?: BookmarkResponse[];
};

type GetBookmarksParams = {
  page?: number;
  size?: number;
};

const bookmarksClient = axios.create({
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

function normalizeBookmark(data: BookmarkResponse): Bookmark {
  return {
    bookmarkId: data.bookmarkId ?? data.id ?? 0,
    targetId: data.targetId ?? data.postId ?? data.reviewId,
    targetType: data.targetType ?? (data.postId ? "POST" : data.reviewId ? "REVIEW" : undefined),
    title: data.title,
    createdAt: data.createdAt ?? data.bookmarkedAt,
  };
}

function normalizeBookmarkPage(
  data: BookmarkPageResponse | BookmarkResponse[] | undefined,
  page: number,
  size: number,
): BookmarkPage {
  if (!data) {
    return { content: [], totalPages: 0, totalElements: 0, number: page, size };
  }

  if (Array.isArray(data)) {
    return {
      content: data.map(normalizeBookmark),
      totalPages: 1,
      totalElements: data.length,
      number: page,
      size,
    };
  }

  const content = data.content ?? data.bookmarks ?? [...(data.bookmarkedPosts ?? []), ...(data.bookmarkedReviews ?? [])];

  return {
    content: content.map(normalizeBookmark),
    totalPages: data.totalPages ?? 0,
    totalElements: data.totalElements ?? content.length,
    number: data.number ?? page,
    size: data.size ?? size,
  };
}

function validateId(id: number, label: string): void {
  if (!id || Number.isNaN(id) || id <= 0) {
    throw new Error(`Invalid ${label} id.`);
  }
}

export async function bookmarkDiscussion(postId: number): Promise<void> {
  validateId(postId, "post");

  await bookmarksClient.post(`/api/bookmarks/posts/${postId}`, undefined, {
    headers: requireAuthHeaders(),
  });
}

export async function unbookmarkDiscussion(postId: number): Promise<void> {
  validateId(postId, "post");

  await bookmarksClient.delete(`/api/bookmarks/posts/${postId}`, {
    headers: requireAuthHeaders(),
  });
}

export async function bookmarkReview(reviewId: number): Promise<void> {
  validateId(reviewId, "review");

  await bookmarksClient.post(`/api/bookmarks/reviews/${reviewId}`, undefined, {
    headers: requireAuthHeaders(),
  });
}

export async function unbookmarkReview(reviewId: number): Promise<void> {
  validateId(reviewId, "review");

  await bookmarksClient.delete(`/api/bookmarks/reviews/${reviewId}`, {
    headers: requireAuthHeaders(),
  });
}

export async function getMyBookmarks(params: GetBookmarksParams = {}): Promise<BookmarkPage> {
  const page = params.page ?? 0;
  const size = params.size ?? 20;
  const response = await bookmarksClient.get<ApiResponse<BookmarkPageResponse> | BookmarkPageResponse>(
    "/api/bookmarks/me",
    {
      headers: requireAuthHeaders(),
      params: { page, size },
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeBookmarkPage(payload, page, size);
}
