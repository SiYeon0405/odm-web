import axios from "axios";
import type { Comment, PageResponse } from "@/features/comments/types";

const ACCESS_TOKEN_KEY = "odm_accessToken";
const DEFAULT_BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

type ApiResponse<T> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
};

type CommentResponse = Partial<Comment> & {
  id?: number;
  body?: string;
};

type CommentPageResponse = Partial<PageResponse<CommentResponse>> & {
  comments?: CommentResponse[];
};

type GetCommentsParams = {
  page?: number;
  size?: number;
};

type UpdateCommentRequest = {
  content: string;
};

const commentsClient = axios.create({
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

function normalizeComment(data: CommentResponse): Comment {
  return {
    commentId: data.commentId ?? data.id ?? 0,
    discussionId: data.discussionId,
    postId: data.postId,
    userId: data.userId,
    writerId: data.writerId,
    writerNickname: data.writerNickname,
    content: data.content ?? data.body ?? "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function emptyCommentPage(page = 0, size = 20): PageResponse<Comment> {
  return {
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: page,
    size,
  };
}

function normalizeCommentPage(
  data: CommentPageResponse | CommentResponse[] | undefined,
  page: number,
  size: number,
): PageResponse<Comment> {
  if (!data) return emptyCommentPage(page, size);

  if (Array.isArray(data)) {
    return {
      content: data.map(normalizeComment),
      totalPages: 1,
      totalElements: data.length,
      number: page,
      size,
    };
  }

  const content = data.content ?? data.comments ?? [];
  if (!Array.isArray(content)) return emptyCommentPage(page, size);

  return {
    content: content.map(normalizeComment),
    totalPages: data.totalPages ?? 0,
    totalElements: data.totalElements ?? content.length,
    number: data.number ?? page,
    size: data.size ?? size,
  };
}

export function getCommentErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        return "로그인이 필요합니다.";
      case 403:
        return "댓글 작성 권한이 없습니다.";
      case 404:
        return "게시글을 찾을 수 없습니다.";
      case 400:
        return "댓글 내용을 확인해주세요.";
      default:
        return "댓글 정보를 처리하지 못했습니다.";
    }
  }

  return error instanceof Error ? error.message : "댓글 정보를 처리하지 못했습니다.";
}

export async function getCommentsByDiscussionId(
  discussionId: number,
  params: GetCommentsParams = {},
): Promise<PageResponse<Comment>> {
  if (!discussionId || Number.isNaN(discussionId)) {
    throw new Error("잘못된 게시글입니다.");
  }

  const page = params.page ?? 0;
  const size = params.size ?? 20;
  const response = await commentsClient.get<ApiResponse<CommentPageResponse | CommentResponse[]> | CommentPageResponse>(
    `/api/discussions/${discussionId}/comments`,
    {
      headers: getAuthHeaders(),
      params,
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeCommentPage(payload, page, size);
}

export async function createComment(discussionId: number, content: string): Promise<Comment> {
  const trimmedContent = content.trim();
  if (!discussionId || Number.isNaN(discussionId)) {
    throw new Error("잘못된 게시글입니다.");
  }
  if (!trimmedContent) {
    throw new Error("댓글 내용을 확인해주세요.");
  }

  const response = await commentsClient.post<ApiResponse<CommentResponse> | CommentResponse>(
    `/api/discussions/${discussionId}/comments`,
    {
      discussionId,
      postId: discussionId,
      content: trimmedContent,
    },
    {
      headers: getAuthHeaders(),
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeComment(payload);
}

export async function updateComment(commentId: number, request: UpdateCommentRequest): Promise<Comment> {
  const trimmedContent = request.content.trim();
  if (!commentId || Number.isNaN(commentId)) {
    throw new Error("Invalid comment id.");
  }
  if (!trimmedContent) {
    throw new Error("?볤? ?댁슜???뺤씤?댁＜?몄슂.");
  }

  const response = await commentsClient.patch<ApiResponse<CommentResponse> | CommentResponse>(
    `/api/comments/${commentId}`,
    { content: trimmedContent },
    {
      headers: getAuthHeaders(),
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeComment(payload);
}
