type ClubPaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

export default function ClubPagination({ page, pageCount, onChange }: ClubPaginationProps) {
  return (
    <nav aria-label="독서모임 페이지" className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-full border border-coffee/10 bg-white/52 px-4 py-3 text-sm text-coffee transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40"
      >
        이전
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
        <button
          key={item}
          type="button"
          aria-current={item === page ? "page" : undefined}
          onClick={() => onChange(item)}
          className={`size-11 rounded-full text-sm font-bold transition ${
            item === page
              ? "bg-espresso text-cream shadow-soft"
              : "border border-coffee/10 bg-white/52 text-coffee hover:bg-ivory"
          }`}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className="rounded-full border border-coffee/10 bg-white/52 px-4 py-3 text-sm text-coffee transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40"
      >
        다음
      </button>
    </nav>
  );
}
