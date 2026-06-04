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
  bookAuthor?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  hasStarted?: boolean;
  book?: {
    title?: string;
    author?: string;
    thumbnail?: string;
    coverImage?: string;
    imageUrl?: string;
  };
};

type ClubPageResponse = {
  content?: ClubDetailResponse[];
  totalElements?: number;
  totalPages?: number;
};

export type ClubDetail = Club & {
  leaderName?: string;
  recruitmentStatus?: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookCover?: string;
  startDate?: string;
  endDate?: string;
};

export type ClubPage = {
  clubs: Club[];
  totalElements: number;
  totalPages: number;
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

export async function fetchClubById(clubId: number): Promise<ClubDetail | undefined> {
  const response = await clubsClient.get<ApiResponse<ClubDetailResponse> | ClubDetailResponse>(`/api/clubs/${clubId}`, {
    headers: getAuthHeaders(),
  });
  const payload = "data" in response.data && response.data.data ? response.data.data : response.data;

  return normalizeClubDetail(payload);
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
    leaderName: data.leaderName ?? data.ownerName ?? data.hostName ?? data.managerName,
    recruitmentStatus: data.recruitmentStatus ?? data.status,
    bookTitle,
    bookAuthor,
    bookCover,
    startDate,
    endDate,
  };
}
