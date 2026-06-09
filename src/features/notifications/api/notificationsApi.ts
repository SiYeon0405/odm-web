import axios from "axios";
import type { Notification, NotificationPage } from "@/features/notifications/types";

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

type NotificationResponse = {
  notificationId?: number;
  id?: number;
  title?: string;
  content?: string;
  notificationType?: string;
  type?: string;
  isRead?: boolean;
  read?: boolean;
  referenceId?: number | null;
  createdAt?: string;
};

type NotificationPageResponse = {
  content?: NotificationResponse[];
  notifications?: NotificationResponse[];
  data?: NotificationPageResponse;
  result?: NotificationPageResponse;
  totalPages?: number;
  totalElements?: number;
  number?: number;
  page?: number;
  size?: number;
};

type UnreadCountResponse = {
  count?: number;
  unreadCount?: number;
  data?: UnreadCountResponse | number;
  result?: UnreadCountResponse | number;
};

const notificationsClient = axios.create({
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

function normalizeNotification(data: NotificationResponse): Notification {
  return {
    notificationId: data.notificationId ?? data.id ?? 0,
    title: data.title ?? "",
    content: data.content ?? "",
    notificationType: data.notificationType ?? data.type ?? "",
    isRead: data.isRead ?? data.read ?? false,
    referenceId: data.referenceId,
    createdAt: data.createdAt ?? "",
  };
}

function normalizeNotificationPage(
  data: NotificationPageResponse | NotificationResponse[] | undefined,
  page: number,
  size: number,
): NotificationPage {
  if (!data) {
    return { content: [], totalPages: 0, totalElements: 0, number: page, size };
  }

  if (Array.isArray(data)) {
    return {
      content: data.map(normalizeNotification),
      totalPages: 1,
      totalElements: data.length,
      number: page,
      size,
    };
  }

  const pageData = data.content || data.notifications ? data : data.data ?? data.result ?? data;
  const content = pageData.content ?? pageData.notifications ?? [];

  return {
    content: content.map(normalizeNotification),
    totalPages: pageData.totalPages ?? 0,
    totalElements: pageData.totalElements ?? content.length,
    number: pageData.number ?? pageData.page ?? page,
    size: pageData.size ?? size,
  };
}

function normalizeUnreadCount(data: UnreadCountResponse | number | undefined): number {
  if (typeof data === "number") return data;
  if (!data) return 0;

  const nested = data.data ?? data.result;
  if (typeof nested === "number") return nested;
  if (nested) return normalizeUnreadCount(nested);

  return data.count ?? data.unreadCount ?? 0;
}

export function getNotificationErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "로그인이 필요합니다.";
    if (error.response?.status === 403) return "알림을 조회할 권한이 없습니다.";
    return error.response?.data?.message || error.message;
  }

  return error instanceof Error ? error.message : "알림 요청을 처리하지 못했습니다.";
}

export async function getNotifications(page = 0, size = 20): Promise<NotificationPage> {
  const response = await notificationsClient.get<ApiResponse<NotificationPageResponse> | NotificationPageResponse>(
    "/api/notifications",
    {
      headers: getAuthHeaders(),
      params: { page, size },
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeNotificationPage(payload, page, size);
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await notificationsClient.get<ApiResponse<UnreadCountResponse | number> | UnreadCountResponse | number>(
    "/api/notifications/unread-count",
    {
      headers: getAuthHeaders(),
    },
  );
  const payload = unwrapApiResponse(response.data);

  return normalizeUnreadCount(payload);
}

export async function markNotificationAsRead(notificationId: number): Promise<Notification | null> {
  const response = await notificationsClient.patch<ApiResponse<NotificationResponse> | NotificationResponse | undefined>(
    `/api/notifications/${notificationId}/read`,
    undefined,
    {
      headers: getAuthHeaders(),
    },
  );
  if (!response.data) return null;

  const payload = unwrapApiResponse(response.data);
  return payload ? normalizeNotification(payload) : null;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await notificationsClient.patch("/api/notifications/read-all", undefined, {
    headers: getAuthHeaders(),
  });
}
