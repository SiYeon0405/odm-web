import axios from "axios";
import { mockClubs } from "@/features/clubs/data/mockClubs";
import type { Club } from "@/features/clubs/types";

const MEMBER_ADJUSTMENTS_KEY = "odm_clubMemberAdjustments";
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

export type ClubDetail = Club & {
  leaderName?: string;
  recruitmentStatus?: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookCover?: string;
  startDate?: string;
  endDate?: string;
};

const clubsClient = axios.create({
  baseURL: BASE_URL,
});

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

function withCurrentMembers(club: Club): Club {
  const adjustment = getMemberAdjustments()[club.id] ?? 0;
  const members = Math.min(club.maxMembers, Math.max(0, club.members + adjustment));

  return { ...club, members };
}

export function adjustClubMemberCount(clubId: number, amount: number): void {
  if (typeof window === "undefined") return;

  const adjustments = getMemberAdjustments();
  adjustments[clubId] = (adjustments[clubId] ?? 0) + amount;
  window.localStorage.setItem(MEMBER_ADJUSTMENTS_KEY, JSON.stringify(adjustments));
}

export async function fetchClubs(): Promise<Club[]> {
  // This boundary can later be replaced with a request to `/api/clubs`.
  return Promise.resolve(mockClubs.map(withCurrentMembers));
}

export async function fetchClubById(clubId: number): Promise<ClubDetail | undefined> {
  const response = await clubsClient.get<ApiResponse<ClubDetailResponse> | ClubDetailResponse>(`/api/clubs/${clubId}`);
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
