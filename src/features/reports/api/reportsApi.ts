import axios from "axios";
import type { CreateUserReportRequest, UserReport, UserReportListResponse } from "@/features/reports/types";

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

type UserReportResponse = {
  reportId?: number;
  id?: number;
  reporterId?: number;
  targetUserId?: number;
  reason?: string;
  status?: string;
  createdAt?: string;
};

type UserReportListApiResponse = {
  totalReports?: number;
  blacklistCount?: number;
  blacklisted?: boolean;
  reports?: UserReportResponse[];
  content?: UserReportResponse[];
  page?: number;
  number?: number;
  size?: number;
  totalPages?: number;
};

const reportsClient = axios.create({
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

function normalizeReport(data: UserReportResponse): UserReport {
  return {
    reportId: data.reportId ?? data.id ?? 0,
    reporterId: data.reporterId ?? 0,
    targetUserId: data.targetUserId ?? 0,
    reason: data.reason ?? "",
    status: data.status ?? "",
    createdAt: data.createdAt ?? "",
  };
}

function normalizeReportList(data: UserReportListApiResponse | undefined, page: number, size: number): UserReportListResponse {
  const reports = data?.reports ?? data?.content ?? [];

  return {
    totalReports: data?.totalReports ?? reports.length,
    blacklistCount: data?.blacklistCount ?? 0,
    blacklisted: data?.blacklisted ?? false,
    reports: reports.map(normalizeReport),
    page: data?.page ?? data?.number ?? page,
    size: data?.size ?? size,
    totalPages: data?.totalPages ?? 0,
  };
}

export function getReportErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const code = error.response?.data?.code;

    switch (code) {
      case "REPORT_ALREADY_EXISTS":
        return "이미 신고한 사용자입니다.";
      case "SELF_REPORT_NOT_ALLOWED":
        return "자기 자신은 신고할 수 없습니다.";
      case "CLUB_NOT_FINISHED":
        return "모임 종료 후 신고할 수 있습니다.";
      case "REPORT_NOT_ALLOWED":
        return "같은 완료 모임의 참여자만 신고할 수 있습니다.";
      case "USER_BLACKLISTED":
        return "블랙리스트 사용자는 신고할 수 없습니다.";
      case "FORBIDDEN":
        return "신고 목록을 조회할 권한이 없습니다.";
      case "USER_NOT_FOUND":
        return "사용자를 찾을 수 없습니다.";
      case "CLUB_NOT_FOUND":
        return "독서모임을 찾을 수 없습니다.";
      default:
        break;
    }

    if (error.response?.status === 401) return "로그인이 필요합니다.";
    if (error.response?.status === 403) return "신고 목록을 조회할 권한이 없습니다.";
    return error.response?.data?.message || "요청 처리 중 오류가 발생했습니다.";
  }

  return error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다.";
}

export async function createUserReport(payload: CreateUserReportRequest): Promise<UserReport> {
  const response = await reportsClient.post<ApiResponse<UserReportResponse>>("/api/reports", payload, {
    headers: getAuthHeaders(),
  });
  const data = unwrapApiResponse(response.data);

  return normalizeReport(data);
}

export async function getMyReports(page = 0, size = 20): Promise<UserReportListResponse> {
  const response = await reportsClient.get<ApiResponse<UserReportListApiResponse>>("/api/reports/me", {
    headers: getAuthHeaders(),
    params: { page, size },
  });
  const data = unwrapApiResponse(response.data);

  return normalizeReportList(data, page, size);
}

export async function getUserReports(userId: number, page = 0, size = 20): Promise<UserReportListResponse> {
  const response = await reportsClient.get<ApiResponse<UserReportListApiResponse>>(`/api/reports/user/${userId}`, {
    headers: getAuthHeaders(),
    params: { page, size },
  });
  const data = unwrapApiResponse(response.data);

  return normalizeReportList(data, page, size);
}
