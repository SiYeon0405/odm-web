import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { getApiErrorMessage, getBookDetail, isValidIsbn13, normalizeBookDetail } from "@/api/bookApi";

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

export default function BookDetailPage() {
  const { isbn13 = "" } = useParams();
  const [book, setBook] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookDetail = async () => {
      setLoading(true);
      setError("");
      console.log("Detail ISBN13", isbn13);

      if (!isbn13 || !isValidIsbn13(isbn13)) {
        console.error("ISBN13 없음", { isbn13 });
        setBook(null);
        setError("ISBN13이 없어 도서 상세 정보를 불러올 수 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const data = await getBookDetail(isbn13);
        const normalizedBook = normalizeBookDetail(data);
        setBook(normalizedBook && typeof normalizedBook === "object" ? normalizedBook as Record<string, unknown> : null);
      } catch (requestError) {
        setBook(null);
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadBookDetail();
  }, [isbn13]);

  const title = book ? getText(book, ["title"], "제목 없음") : "";
  const subTitle = book ? getText(book, ["subTitle", "subtitle"]) : "";
  const cover = book ? getText(book, ["cover", "coverImage", "imageUrl", "thumbnail"]) : "";
  const author = book ? getText(book, ["author"], "저자 정보 없음") : "";
  const publisher = book ? getText(book, ["publisher"], "출판사 정보 없음") : "";
  const category = book ? getText(book, ["categoryName", "category"], "카테고리 정보 없음") : "";
  const price = book ? getText(book, ["priceStandard", "priceSales", "price"]) : "";
  const rating = book ? getText(book, ["customerReviewRank", "rating", "star"], "별점 정보 없음") : "";
  const description = book ? getText(book, ["description"], "설명 정보가 없습니다.") : "";
  const itemPage = book ? getText(book, ["itemPage", "page", "pages"], "페이지 정보 없음") : "";
  const toc = book ? getText(book, ["toc", "tableOfContents"], "목차 정보가 없습니다.") : "";

  return (
    <>
      <main className="home-page min-h-screen overflow-hidden bg-cream px-4 pb-24 pt-32 font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />

        <section className="relative z-10 mx-auto max-w-6xl">
          {loading ? <p className="text-coffee/70">로딩 중...</p> : null}
          {!loading && error ? <p className="text-coffee/70">{error}</p> : null}

          {!loading && !error && book ? (
            <article className="rounded-[2rem] border border-coffee/10 bg-ivory/76 p-5 shadow-premium backdrop-blur-xl md:p-8">
              <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
                <div className="overflow-hidden rounded-[1.4rem] border border-coffee/10 bg-paper shadow-inner-warm">
                  {cover ? (
                    <img src={cover} alt={title} className="w-full object-cover" />
                  ) : (
                    <div className="grid aspect-[3/4] w-full place-items-center text-coffee/54">표지 없음</div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-caramel">Book detail</p>
                  <h1 className="mt-4 text-3xl font-bold leading-tight text-espresso md:text-5xl">{title}</h1>
                  {subTitle ? <p className="mt-3 text-lg leading-8 text-coffee/70">{subTitle}</p> : null}

                  <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                    <DetailItem label="저자" value={author} />
                    <DetailItem label="출판사" value={publisher} />
                    <DetailItem label="카테고리" value={category} />
                    <DetailItem label="가격" value={price ? formatPrice(price) : "가격 정보 없음"} />
                    <DetailItem label="별점" value={rating} />
                    <DetailItem label="페이지 수" value={itemPage} />
                  </dl>

                  <div className="mt-8 grid gap-5">
                    <TextPanel title="설명" body={description} />
                    <TextPanel title="목차" body={toc} />
                  </div>
                </div>
              </div>
            </article>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-coffee/8 bg-white/52 p-4">
      <dt className="text-xs font-bold text-caramel">{label}</dt>
      <dd className="mt-2 break-words text-sm leading-6 text-coffee/76">{value}</dd>
    </div>
  );
}

function TextPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-[1.3rem] border border-coffee/8 bg-paper/72 p-5">
      <h2 className="text-lg font-bold text-espresso">{title}</h2>
      <p className="mt-3 whitespace-pre-line leading-8 text-coffee/74">{body}</p>
    </section>
  );
}
