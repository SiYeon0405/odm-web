import axios from "axios";
import type {
  PageResponse,
  Recruitment,
  RecruitmentStatus,
  RecruitmentUpdateRequest,
} from "@/features/recruitments/types";

const ACCESS_TOKEN_KEY = "odm_accessToken";
const DEFAULT_BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

type ApiResponse<T> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
};

type RecruitmentResponse = Partial<Recruitment> & {
  id?: number;
  recruitmentPostId?: number;
  status?: RecruitmentStatus;
  content?: string;
};

type RecruitmentPageResponse = Partial<PageResponse<RecruitmentResponse>> & {
  recruitments?: RecruitmentResponse[];
};

type GetRecruitmentsParams = {
  page?: number;
  size?: number;
  status?: RecruitmentStatus;
};

const recruitmentsClient = axios.create({
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

function normalizeRecruitment(data: RecruitmentResponse): Recruitment {
  return {
    recruitmentId: data.recruitmentId ?? data.recruitmentPostId ?? data.id ?? 0,
    clubId: data.clubId,
    title: data.title ?? "",
    description: data.description ?? data.content ?? "",
    recruitmentStatus: data.recruitmentStatus ?? data.status ?? "RECRUITING",
    viewCount: data.viewCount,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function emptyRecruitmentPage(page = 0, size = 20): PageResponse<Recruitment> {
  return {
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: page,
    size,
  };
}

function normalizeRecruitmentPage(
  data: RecruitmentPageResponse | RecruitmentResponse[] | undefined,
  page: number,
  size: number,
): PageResponse<Recruitment> {
  if (!data) return emptyRecruitmentPage(page, size);

  if (Array.isArray(data)) {
    return {
      content: data.map(normalizeRecruitment),
      totalPages: 1,
      totalElements: data.length,
      number: page,
      size,
    };
  }

  const content = data.content ?? data.recruitments ?? [];
  if (!Array.isArray(content)) return emptyRecruitmentPage(page, size);

  return {
    content: content.map(normalizeRecruitment),
    totalPages: data.totalPages ?? 0,
    totalElements: data.totalElements ?? content.length,
    number: data.number ?? page,
    size: data.size ?? size,
  };
}

export function getRecruitmentErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const code = error.response?.data?.code;
    const message = error.response?.data?.message;

    switch (code) {
      case "RECRUITMENT_POST_NOT_FOUND":
        return "모집글을 찾을 수 없습니다.";
      case "RECRUITMENT_ALREADY_CLOSED":
        return "이미 종료된 모집글입니다.";
      case "RECRUITMENT_MODIFICATION_NOT_ALLOWED":
        return "수정할 수 없는 모집글입니다.";
      case "RECRUITMENT_ALREADY_COMPLETED":
        return "이미 완료된 모집글입니다.";
      case "FORBIDDEN":
        return "권한이 없습니다.";
      default:
        break;
    }

    switch (error.response?.status) {
      case 401:
        return "로그인이 필요합니다.";
      case 403:
        return "접근 권한이 없습니다.";
      case 404:
        return "모집글을 찾을 수 없습니다.";
      default:
        return message || "모집글 정보를 불러오지 못했습니다.";
    }
  }

  return error instanceof Error ? error.message : "모집글 정보를 불러오지 못했습니다.";
}

export async function getRecruitments(
  paramsOrPage: GetRecruitmentsParams | number = {},
  sizeArg = 20,
): Promise<PageResponse<Recruitment>> {
  const params = typeof paramsOrPage === "number" ? { page: paramsOrPage, size: sizeArg } : paramsOrPage;
  const page = params.page ?? 0;
  const size = params.size ?? 20;
  const response = await recruitmentsClient.get<ApiResponse<RecruitmentPageResponse> | RecruitmentPageResponse>(
    "/api/recruitments",
    {
      params,
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeRecruitmentPage(payload, page, size);
}

export async function getRecruitmentById(recruitmentId: number): Promise<Recruitment> {
  validateRecruitmentId(recruitmentId);

  const response = await recruitmentsClient.get<ApiResponse<RecruitmentResponse> | RecruitmentResponse>(
    `/api/recruitments/${recruitmentId}`,
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeRecruitment(payload);
}

export const getRecruitmentDetail = getRecruitmentById;

export async function updateRecruitment(
  recruitmentId: number,
  payload: RecruitmentUpdateRequest,
): Promise<Recruitment> {
  validateRecruitmentId(recruitmentId);
  validateRecruitmentPayload(payload);

  const response = await recruitmentsClient.put<ApiResponse<RecruitmentResponse> | RecruitmentResponse>(
    `/api/recruitments/${recruitmentId}`,
    payload,
    {
      headers: requireAuthHeaders(),
    },
  );
  const data = unwrapApiResponse(response.data);

  return normalizeRecruitment(data);
}

export async function closeRecruitment(recruitmentId: number): Promise<void> {
  validateRecruitmentId(recruitmentId);

  await recruitmentsClient.patch(`/api/recruitments/${recruitmentId}/close`, undefined, {
    headers: requireAuthHeaders(),
  });
}

function validateRecruitmentId(recruitmentId: number): void {
  if (!recruitmentId || Number.isNaN(recruitmentId) || recruitmentId <= 0) {
    throw new Error("유효한 모집글 ID가 필요합니다.");
  }
}

function validateRecruitmentPayload(payload: RecruitmentUpdateRequest): void {
  if (!payload.title.trim()) throw new Error("모집글 제목을 입력해주세요.");
  if (payload.title.length > 320) throw new Error("모집글 제목은 320자 이하로 입력해주세요.");
  if (!payload.description.trim()) throw new Error("모집글 내용을 입력해주세요.");
}
