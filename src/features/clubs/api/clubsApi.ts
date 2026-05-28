import { mockClubs } from "@/features/clubs/data/mockClubs";
import type { Club } from "@/features/clubs/types";

const MEMBER_ADJUSTMENTS_KEY = "odm_clubMemberAdjustments";

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

export async function fetchClubById(clubId: number): Promise<Club | undefined> {
  // This boundary can later be replaced with a request to `/api/clubs/:clubId`.
  const club = mockClubs.find((candidate) => candidate.id === clubId);
  return Promise.resolve(club ? withCurrentMembers(club) : undefined);
}
