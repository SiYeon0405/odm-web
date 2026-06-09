import { useEffect, useMemo, useState } from "react";
import { fetchClubs } from "@/features/clubs/api/clubsApi";
import type { Club, ClubSort } from "@/features/clubs/types";

const PAGE_SIZE = 20;
const ALL_FILTER = "전체";

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_FILTER);
  const [capacity, setCapacity] = useState(ALL_FILTER);
  const [sort, setSort] = useState<ClubSort>("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchClubs(page - 1, PAGE_SIZE)
      .then((data) => {
        if (active) {
          setClubs(data.clubs);
          setTotalElements(data.totalElements);
          setTotalPages(data.totalPages);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setClubs([]);
          setTotalElements(0);
          setTotalPages(0);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [page]);

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
      const matchesCategory = category === ALL_FILTER || club.category === category;
      const matchesCapacity = capacity === ALL_FILTER || club.members < club.maxMembers;

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

  const pageCount = Math.max(1, totalPages || Math.ceil(filteredClubs.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const isFiltering = search.trim().length > 0 || category !== ALL_FILTER || capacity !== ALL_FILTER;

  return {
    clubs: filteredClubs,
    total: isFiltering ? filteredClubs.length : totalElements,
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
