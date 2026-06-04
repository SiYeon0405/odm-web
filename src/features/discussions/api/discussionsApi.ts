import axios from "axios";
import type { Discussion, PageResponse } from "@/features/discussions/types";

const ACCESS_TOKEN_KEY = "odm_accessToken";
const DEFAULT_BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

type ApiResponse<T> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
};

type DiscussionResponse = Partial<Discussion> & {
  id?: number;
  postId?: number;
  body?: string;
  description?: string;
  comments?: number;
  likes?: number;
};

type DiscussionPageResponse = Partial<PageResponse<DiscussionResponse>> & {
  discussions?: DiscussionResponse[];
  posts?: DiscussionResponse[];
};

type GetDiscussionsParams = {
  page?: number;
  size?: number;
};

const discussionsClient = axios.create({
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

function unwrapApiResponse<T>(responseData: ApiResponse<T> | T): T {
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    return (responseData as ApiResponse<T>).data as T;
  }

  return responseData as T;
}

function normalizeDiscussion(data: DiscussionResponse): Discussion {
  return {
    discussionId: data.discussionId ?? data.postId ?? data.id ?? 0,
    clubId: data.clubId,
    userId: data.userId,
    title: data.title ?? "",
    content: data.content ?? data.body ?? data.description ?? "",
    commentCount: data.commentCount ?? data.comments,
    likeCount: data.likeCount ?? data.likes,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function emptyDiscussionPage(page = 0, size = 20): PageResponse<Discussion> {
  return {
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: page,
    size,
  };
}

function normalizeDiscussionPage(
  data: DiscussionPageResponse | DiscussionResponse[] | undefined,
  page: number,
  size: number,
): PageResponse<Discussion> {
  if (!data) return emptyDiscussionPage(page, size);

  if (Array.isArray(data)) {
    return {
      content: data.map(normalizeDiscussion),
      totalPages: 1,
      totalElements: data.length,
      number: page,
      size,
    };
  }

  const content = data.content ?? data.discussions ?? data.posts ?? [];
  if (!Array.isArray(content)) return emptyDiscussionPage(page, size);

  return {
    content: content.map(normalizeDiscussion),
    totalPages: data.totalPages ?? 0,
    totalElements: data.totalElements ?? content.length,
    number: data.number ?? page,
    size: data.size ?? size,
  };
}

export function getDiscussionErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        return "로그인이 필요합니다.";
      case 403:
        return "접근 권한이 없습니다.";
      case 404:
        return "게시글을 찾을 수 없습니다.";
      default:
        return "게시글 정보를 불러오지 못했습니다.";
    }
  }

  return error instanceof Error ? error.message : "게시글 정보를 불러오지 못했습니다.";
}

export async function getDiscussionsByClubId(
  clubId: number,
  params: GetDiscussionsParams = {},
): Promise<PageResponse<Discussion>> {
  if (!clubId || Number.isNaN(clubId)) {
    throw new Error("잘못된 모임입니다.");
  }

  const page = params.page ?? 0;
  const size = params.size ?? 20;
  const response = await discussionsClient.get<ApiResponse<DiscussionPageResponse> | DiscussionPageResponse>(
    `/api/discussions/clubs/${clubId}`,
    {
      headers: getAuthHeaders(),
      params,
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeDiscussionPage(payload, page, size);
}

export async function getDiscussionById(discussionId: number): Promise<Discussion> {
  if (!discussionId || Number.isNaN(discussionId)) {
    throw new Error("잘못된 게시글입니다.");
  }

  const response = await discussionsClient.get<ApiResponse<DiscussionResponse> | DiscussionResponse>(
    `/api/discussions/${discussionId}`,
    {
      headers: getAuthHeaders(),
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeDiscussion(payload);
}
