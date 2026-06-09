import axios from "axios";
import type { Club } from "@/features/clubs/types";

const MEMBER_ADJUSTMENTS_KEY = "odm_clubMemberAdjustments";
const ACCESS_TOKEN_KEY = "odm_accessToken";
const MOCK_ACCESS_TOKEN = "mock-jwt-access-token";
const DEFAULT_BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

type ApiResponse<T> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
};

type ClubDetailResponse = {
  id?: number;
  clubId?: number;
  title?: string;
  name?: string;
  clubName?: string;
  description?: string;
  introduction?: string;
  content?: string;
  leaderName?: string;
  ownerName?: string;
  hostName?: string;
  managerName?: string;
  recruitmentStatus?: string;
  status?: string;
  members?: number;
  memberCount?: number;
  currentMembers?: number;
  currentMemberCount?: number;
  maxMembers?: number;
  capacity?: number;
  maxParticipants?: number;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  imageUrl?: string;
  coverImage?: string;
  bookTitle?: string;
  bookId?: number;
  bookAuthor?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  hasStarted?: boolean;
  isJoined?: boolean;
  book?: {
    title?: string;
    author?: string;
    thumbnail?: string;
    coverImage?: string;
    imageUrl?: string;
  };
};

export type ClubMemberResponse = {
  id?: number;
  clubId?: number;
  userId?: number;
  role?: string;
  joinedAt?: string;
};

type ClubPageResponse = {
  content?: ClubDetailResponse[];
  totalElements?: number;
  totalPages?: number;
};

type ClubMembersPageResponse = {
  content?: ClubMemberResponse[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
};

export type ClubDetail = Club & {
  leaderName?: string;
  recruitmentStatus?: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookCover?: string;
  startDate?: string;
  endDate?: string;
  bookId?: number;
};

export type ClubPage = {
  clubs: Club[];
  totalElements: number;
  totalPages: number;
};

export type ClubMember = {
  id: number;
  clubId?: number;
  userId?: number;
  role?: string;
  joinedAt?: string;
};

export type ClubMemberPage = {
  members: ClubMember[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

export type ClubCreatePayload = {
  title: string;
  description: string;
  maxMembers: number;
  startDate: string;
  endDate: string;
  bookId: number;
};

export type ClubUpdatePayload = ClubCreatePayload & {
  status: string;
};

const clubsClient = axios.create({
  baseURL: BASE_URL,
});

function getAuthHeaders() {
  if (typeof window === "undefined") return undefined;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken || accessToken === MOCK_ACCESS_TOKEN) return undefined;

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

function getMemberAdjustments(): Record<number, number> {
  if (typeof window === "undefined") return {};

  const storedValue = window.localStorage.getItem(MEMBER_ADJUSTMENTS_KEY);
  if (!storedValue) return {};

  try {
    const adjustments = JSON.parse(storedValue);
    return typeof adjustments === "object" && adjustments !== null ? adjustments : {};
  } catch {
    return {};
  }
}

export function adjustClubMemberCount(clubId: number, amount: number): void {
  if (typeof window === "undefined") return;

  const adjustments = getMemberAdjustments();
  adjustments[clubId] = (adjustments[clubId] ?? 0) + amount;
  window.localStorage.setItem(MEMBER_ADJUSTMENTS_KEY, JSON.stringify(adjustments));
}

export async function fetchClubs(page = 0, size = 20): Promise<ClubPage> {
  const response = await clubsClient.get<ApiResponse<ClubPageResponse>>("/api/clubs", {
    headers: getAuthHeaders(),
    params: { page, size },
  });
  const payload = response.data.data;
  const content = payload?.content ?? [];

  return {
    clubs: content.map(normalizeClubDetail),
    totalElements: payload?.totalElements ?? content.length,
    totalPages: payload?.totalPages ?? 0,
  };
}

export const getClubs = fetchClubs;

export async function getMyClubs(page = 0, size = 20): Promise<ClubPage> {
  const response = await clubsClient.get<ApiResponse<ClubPageResponse>>("/api/clubs/my", {
    headers: getAuthHeaders(),
    params: { page, size },
  });
  const payload = response.data.data;
  const content = payload?.content ?? [];

  return {
    clubs: content.map(normalizeClubDetail),
    totalElements: payload?.totalElements ?? content.length,
    totalPages: payload?.totalPages ?? 0,
  };
}

export async function fetchClubById(clubId: number): Promise<ClubDetail | undefined> {
  validateClubId(clubId);

  const response = await clubsClient.get<ApiResponse<ClubDetailResponse> | ClubDetailResponse>(`/api/clubs/${clubId}`, {
    headers: getAuthHeaders(),
  });
  const payload = "data" in response.data && response.data.data ? response.data.data : response.data;

  return normalizeClubDetail(payload);
}

export const getClubDetail = fetchClubById;

export async function getClubMembers(clubId: number, page = 0, size = 20): Promise<ClubMemberPage> {
  validateClubId(clubId);

  const response = await clubsClient.get<ApiResponse<ClubMembersPageResponse> | ClubMembersPageResponse>(
    `/api/clubs/${clubId}/members`,
    {
      headers: getAuthHeaders(),
      params: { page, size },
    },
  );
  const payload = "data" in response.data && response.data.data ? response.data.data : response.data;
  const content = payload.content ?? [];

  return {
    members: content.map(normalizeClubMember),
    totalElements: payload.totalElements ?? content.length,
    totalPages: payload.totalPages ?? 0,
    page: payload.number ?? page,
    size: payload.size ?? size,
  };
}

export async function createClub(payload: ClubCreatePayload): Promise<ClubDetail> {
  validateClubPayload(payload);

  const response = await clubsClient.post<ApiResponse<ClubDetailResponse> | ClubDetailResponse>("/api/clubs", payload, {
    headers: getAuthHeaders(),
  });
  const data = "data" in response.data && response.data.data ? response.data.data : response.data;

  return normalizeClubDetail(data);
}

export async function updateClub(clubId: number, payload: ClubUpdatePayload): Promise<ClubDetail> {
  validateClubId(clubId);
  validateClubPayload(payload);

  const response = await clubsClient.put<ApiResponse<ClubDetailResponse> | ClubDetailResponse>(
    `/api/clubs/${clubId}`,
    payload,
    {
      headers: getAuthHeaders(),
    },
  );
  const data = "data" in response.data && response.data.data ? response.data.data : response.data;

  return normalizeClubDetail(data);
}

export async function closeClub(clubId: number): Promise<void> {
  validateClubId(clubId);

  await clubsClient.delete(`/api/clubs/${clubId}`, {
    headers: getAuthHeaders(),
  });
}

export async function joinClub(clubId: number): Promise<ClubMemberResponse | undefined> {
  validateClubId(clubId);

  const response = await clubsClient.post<ApiResponse<ClubMemberResponse>>(`/api/clubs/${clubId}/join`, undefined, {
    headers: getAuthHeaders(),
  });

  return response.data.data;
}

export async function leaveClub(clubId: number): Promise<void> {
  validateClubId(clubId);

  await clubsClient.delete(`/api/clubs/${clubId}/leave`, {
    headers: getAuthHeaders(),
  });
}

export async function kickClubMember(clubId: number, userId: number): Promise<void> {
  validateClubId(clubId);
  validateUserId(userId);

  await clubsClient.delete(`/api/clubs/${clubId}/members/${userId}`, {
    headers: getAuthHeaders(),
  });
}

export function getClubErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const code = error.response?.data?.code;
    const message = error.response?.data?.message;

    switch (code) {
      case "CLUB_NOT_FOUND":
        return "독서모임을 찾을 수 없습니다.";
      case "BOOK_NOT_FOUND":
        return "도서를 찾을 수 없습니다.";
      case "CLUB_ALREADY_JOINED":
        return "이미 참여한 독서모임입니다.";
      case "CLUB_ALREADY_CLOSED":
        return "종료된 독서모임입니다.";
      case "CLUB_FULL":
        return "모집 정원이 가득 찼습니다.";
      case "USER_BLACKLISTED":
        return "블랙리스트 사용자는 참여할 수 없습니다.";
      case "HOST_CANNOT_LEAVE":
        return "모임장은 탈퇴할 수 없습니다.";
      case "CLUB_MEMBER_NOT_FOUND":
        return "참여 정보를 찾을 수 없습니다.";
      case "FORBIDDEN":
        return "권한이 없습니다.";
      case "INVALID_INPUT":
        return message || "입력값을 확인해주세요.";
      default:
        return message || "요청 처리 중 오류가 발생했습니다.";
    }
  }

  return error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다.";
}

function validateClubId(clubId: number): void {
  if (!clubId || Number.isNaN(clubId) || clubId <= 0) {
    throw new Error("유효한 독서모임 ID가 필요합니다.");
  }
}

function validateUserId(userId: number): void {
  if (!userId || Number.isNaN(userId) || userId <= 0) {
    throw new Error("유효한 사용자 ID가 필요합니다.");
  }
}

function validateClubPayload(payload: ClubCreatePayload): void {
  if (!payload.title.trim()) throw new Error("독서모임 제목을 입력해주세요.");
  if (!payload.description.trim()) throw new Error("독서모임 설명을 입력해주세요.");
  if (payload.maxMembers < 3 || payload.maxMembers > 8) throw new Error("모집 정원은 3명부터 8명까지 가능합니다.");
  if (!payload.startDate || !payload.endDate) throw new Error("시작일과 종료일을 입력해주세요.");
  if (!payload.bookId) throw new Error("도서 ID가 필요합니다.");
  if (payload.startDate > payload.endDate) throw new Error("시작일은 종료일보다 늦을 수 없습니다.");
}

function normalizeClubMember(data: ClubMemberResponse): ClubMember {
  return {
    id: data.id ?? data.userId ?? 0,
    clubId: data.clubId,
    userId: data.userId,
    role: data.role,
    joinedAt: data.joinedAt,
  };
}

function normalizeClubDetail(data: ClubDetailResponse): ClubDetail {
  const id = data.clubId ?? data.id ?? 0;
  const bookTitle = data.book?.title ?? data.bookTitle ?? data.title ?? data.name ?? data.clubName ?? "";
  const bookAuthor = data.book?.author ?? data.bookAuthor ?? data.author ?? "";
  const bookCover = data.book?.thumbnail ?? data.book?.coverImage ?? data.book?.imageUrl ?? data.thumbnail ?? data.coverImage ?? data.imageUrl ?? "";
  const members = data.currentMembers ?? data.currentMemberCount ?? data.memberCount ?? data.members ?? 0;
  const maxMembers = data.maxMembers ?? data.maxParticipants ?? data.capacity ?? members;
  const startDate = data.startDate ?? "";
  const endDate = data.endDate ?? "";

  return {
    id,
    title: data.title ?? data.name ?? data.clubName ?? bookTitle,
    author: bookAuthor,
    category: (data.category ?? "") as Club["category"],
    members,
    maxMembers,
    tags: data.tags ?? [],
    thumbnail: bookCover,
    description: data.description ?? data.introduction ?? data.content ?? "",
    memberProfiles: [],
    meetingLabel: startDate && endDate ? `${startDate} ~ ${endDate}` : startDate || endDate,
    createdAt: data.createdAt ?? startDate,
    hasStarted: data.hasStarted,
    isJoined: data.isJoined,
    leaderName: data.leaderName ?? data.ownerName ?? data.hostName ?? data.managerName,
    recruitmentStatus: data.recruitmentStatus ?? data.status,
    bookTitle,
    bookAuthor,
    bookCover,
    startDate,
    endDate,
    bookId: data.bookId,
  };
}
