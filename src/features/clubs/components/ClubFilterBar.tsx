import type { ClubSort } from "@/features/clubs/types";

type ClubFilterBarProps = {
  category: string;
  capacity: string;
  sort: ClubSort;
  onCategoryChange: (value: string) => void;
  onCapacityChange: (value: string) => void;
  onSortChange: (value: ClubSort) => void;
};

const categories = ["전체", "문학", "에세이", "인문", "SF"];

export default function ClubFilterBar({
  category,
  capacity,
  sort,
  onCategoryChange,
  onCapacityChange,
  onSortChange,
}: ClubFilterBarProps) {
  return (
    <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div className="flex flex-wrap gap-2" aria-label="카테고리 필터">
        {categories.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onCategoryChange(option)}
            className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${
              category === option
                ? "border-caramel/28 bg-caramel/14 text-coffee"
                : "border-coffee/10 bg-white/48 text-coffee/66 hover:bg-ivory hover:text-espresso"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="club-capacity">
          인원 필터
        </label>
        <select
          id="club-capacity"
          value={capacity}
          onChange={(event) => onCapacityChange(event.target.value)}
          className="min-h-11 rounded-full border border-coffee/10 bg-ivory/82 px-4 text-sm font-bold text-coffee outline-none"
        >
          <option value="전체">인원 전체</option>
          <option value="모집중">모집중만</option>
        </select>
        <label className="sr-only" htmlFor="club-sort">
          정렬
        </label>
        <select
          id="club-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as ClubSort)}
          className="min-h-11 rounded-full border border-coffee/10 bg-ivory/82 px-4 text-sm font-bold text-coffee outline-none"
        >
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
          <option value="available">참여 가능순</option>
        </select>
      </div>
    </div>
  );
}

