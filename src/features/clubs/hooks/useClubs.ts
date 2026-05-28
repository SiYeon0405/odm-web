import { useEffect, useMemo, useState } from "react";
import { fetchClubs } from "@/features/clubs/api/clubsApi";
import type { Club, ClubSort } from "@/features/clubs/types";

const PAGE_SIZE = 6;

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [capacity, setCapacity] = useState("전체");
  const [sort, setSort] = useState<ClubSort>("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    fetchClubs().then((data) => {
      if (active) {
        setClubs(data);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, category, capacity, sort]);

  const filteredClubs = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const filtered = clubs.filter((club) => {
      const matchesSearch =
        keyword.length === 0 ||
        [club.title, club.author, club.description, ...club.tags].some((value) =>
          value.toLowerCase().includes(keyword),
        );
      const matchesCategory = category === "전체" || club.category === category;
      const matchesCapacity = capacity === "전체" || club.members < club.maxMembers;

      return matchesSearch && matchesCategory && matchesCapacity;
    });

    return [...filtered].sort((left, right) => {
      if (sort === "popular") return right.members - left.members;
      if (sort === "available") {
        return right.maxMembers - right.members - (left.maxMembers - left.members);
      }
      return right.createdAt.localeCompare(left.createdAt);
    });
  }, [capacity, category, clubs, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredClubs.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visibleClubs = filteredClubs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return {
    clubs: visibleClubs,
    total: filteredClubs.length,
    isLoading,
    search,
    category,
    capacity,
    sort,
    page: safePage,
    pageCount,
    setSearch,
    setCategory,
    setCapacity,
    setSort,
    setPage,
  };
}

