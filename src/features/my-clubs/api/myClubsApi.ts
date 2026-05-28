import { adjustClubMemberCount, fetchClubs } from "@/features/clubs/api/clubsApi";
import type { Club } from "@/features/clubs/types";

const JOINED_CLUBS_KEY = "odm_joinedClubIds";
const CANCELLED_CLUBS_KEY = "odm_cancelledClubIds";

function getJoinedClubIds(): number[] {
  if (typeof window === "undefined") return [];

  const storedValue = window.localStorage.getItem(JOINED_CLUBS_KEY);
  if (!storedValue) return [];

  try {
    const ids = JSON.parse(storedValue);
    return Array.isArray(ids) ? ids.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

export async function handleJoinClub(clubId: number): Promise<void> {
  const ids = getJoinedClubIds();
  if (!ids.includes(clubId)) {
    window.localStorage.setItem(JOINED_CLUBS_KEY, JSON.stringify([...ids, clubId]));
    const cancelledIds = getCancelledClubIds().filter((id) => id !== clubId);
    window.localStorage.setItem(CANCELLED_CLUBS_KEY, JSON.stringify(cancelledIds));
    adjustClubMemberCount(clubId, 1);
  }
}

function getCancelledClubIds(): number[] {
  if (typeof window === "undefined") return [];

  const storedValue = window.localStorage.getItem(CANCELLED_CLUBS_KEY);
  if (!storedValue) return [];

  try {
    const ids = JSON.parse(storedValue);
    return Array.isArray(ids) ? ids.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

export async function cancelClubParticipation(clubId: number): Promise<void> {
  const cancelledIds = getCancelledClubIds();
  if (cancelledIds.includes(clubId)) return;

  const joinedIds = getJoinedClubIds().filter((id) => id !== clubId);
  window.localStorage.setItem(JOINED_CLUBS_KEY, JSON.stringify(joinedIds));
  window.localStorage.setItem(CANCELLED_CLUBS_KEY, JSON.stringify([...cancelledIds, clubId]));
  adjustClubMemberCount(clubId, -1);
}

export async function fetchJoinedClubs(): Promise<Club[]> {
  const ids = getJoinedClubIds();
  const clubs = await fetchClubs();
  return ids.map((id) => clubs.find((club) => club.id === id)).filter((club): club is Club => Boolean(club));
}
