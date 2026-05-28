import { useEffect, useState } from "react";
import type { Club } from "@/features/clubs/types";
import { fetchJoinedClubs } from "@/features/my-clubs/api/myClubsApi";

export function useJoinedClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchJoinedClubs().then((data) => {
      if (active) {
        setClubs(data);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { clubs, isLoading };
}

