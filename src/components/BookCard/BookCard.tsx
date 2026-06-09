import { Link } from "react-router-dom";
import { isValidIsbn13 } from "@/api/bookApi";

type BookCardProps = {
  book: Record<string, unknown>;
  showPrice?: boolean;
};

const getText = (book: Record<string, unknown>, keys: string[], fallback = "") => {
  for (const key of keys) {
    const value = book[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value);
    }
  }

  return fallback;
};

const formatPrice = (value: string) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0
    ? `${numberValue.toLocaleString("ko-KR")}원`
    : value;
};

export default function BookCard({ book, showPrice = false }: BookCardProps) {
  const isbn13 = getText(book, ["isbn13"]);
  const title = getText(book, ["title"], "제목 없음");
  const author = getText(book, ["author"], "저자 정보 없음");
  const publisher = getText(book, ["publisher"], "출판사 정보 없음");
  const cover = getText(book, ["cover", "coverImage", "imageUrl", "thumbnail"]);
  const price = getText(book, ["priceStandard", "priceSales", "price"]);

  console.log("Book Data", book);
  console.log("ISBN13", isbn13);

  const card = (
    <article className="club-card h-full overflow-hidden rounded-[1.6rem] border border-coffee/10 bg-ivory/74 p-4 shadow-warm backdrop-blur-xl transition hover:-translate-y-1 hover:border-coffee/20 hover:shadow-premium">
      <div className="flex h-full gap-4">
        <div className="w-24 shrink-0 overflow-hidden rounded-[1rem] border border-coffee/10 bg-paper shadow-inner-warm sm:w-28">
          {cover ? (
            <img src={cover} alt={title} className="aspect-[3/4] h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="grid aspect-[3/4] h-full w-full place-items-center px-3 text-center text-xs leading-5 text-coffee/54">
              표지 없음
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 py-1">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-espresso">{title}</h3>
          <p className="mt-3 line-clamp-1 text-sm text-coffee/72">{author}</p>
          <p className="mt-1 line-clamp-1 text-sm text-coffee/62">{publisher}</p>
          {showPrice && price ? (
            <p className="mt-4 text-sm font-bold text-caramel">{formatPrice(price)}</p>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (!isbn13 || !isValidIsbn13(isbn13)) {
    console.error("ISBN13 없음", book);
    return card;
  }

  return (
    <Link to={`/books/${isbn13}`} aria-label={`${title} 상세 보기`} className="block h-full">
      {card}
    </Link>
  );
}
