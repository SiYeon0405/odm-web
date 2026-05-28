import { useCallback, useRef, useState } from "react";
import type { Club } from "@/features/clubs/types";
import { handleJoinClub as persistJoinedClub } from "@/features/my-clubs/api/myClubsApi";

export function useJoinClub() {
  const [loginRequiredOpen, setLoginRequiredOpen] = useState(false);
  const [joinModalClub, setJoinModalClub] = useState<Club | null>(null);
  const joiningRef = useRef(false);

  const requestJoin = useCallback(async (club: Club, isLoggedIn: boolean) => {
    if (!isLoggedIn) {
      setJoinModalClub(null);
      setLoginRequiredOpen(true);
      return;
    }

    if (joiningRef.current) return;

    joiningRef.current = true;
    setLoginRequiredOpen(false);

    try {
      await persistJoinedClub(club.id);
      setJoinModalClub(club);
    } catch (error) {
      console.error("Failed to join club", error);
    } finally {
      joiningRef.current = false;
    }
  }, []);

  const closeLoginRequired = useCallback(() => {
    setLoginRequiredOpen(false);
  }, []);

  const closeJoinModal = useCallback(() => {
    setJoinModalClub(null);
  }, []);

  return {
    loginRequiredOpen,
    joinModalClub,
    requestJoin,
    closeLoginRequired,
    closeJoinModal,
  };
}
