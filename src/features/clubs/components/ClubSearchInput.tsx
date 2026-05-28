type ClubSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ClubSearchInput({ value, onChange }: ClubSearchInputProps) {
  return (
    <label className="relative block flex-1">
      <span className="sr-only">독서모임 검색</span>
      <svg
        aria-hidden="true"
        className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-coffee/42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="책 제목, 작가, 태그로 검색"
        className="min-h-14 w-full rounded-full border border-coffee/10 bg-white/60 py-3 pl-14 pr-5 text-sm text-espresso shadow-warm outline-none placeholder:text-coffee/40 focus:border-caramel/40 focus:bg-ivory"
      />
    </label>
  );
}
