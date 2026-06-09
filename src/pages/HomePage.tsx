import { useEffect, useState } from "react";
import { getApiErrorMessage, getBestSellerBooks, normalizeBookList } from "@/api/bookApi";
import BookCard from "@/components/BookCard/BookCard";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/hero/HeroSection";
import HomeNavbar from "@/components/navbar/HomeNavbar";

export default function HomePage() {
  const [books, setBooks] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBestSellers = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getBestSellerBooks();
        setBooks(normalizeBookList(data));
      } catch (requestError) {
        setBooks([]);
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadBestSellers();
  }, []);

  return (
    <>
      <main className="home-page min-h-[100svh] overflow-hidden bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <HeroSection />
        <section id="bestseller" className="relative z-10 px-4 py-24 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-caramel">Best seller</p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-balance text-3xl font-bold leading-tight text-espresso md:text-5xl">
                  베스트셀러
                </h2>
                <p className="mt-5 max-w-xl leading-8 text-coffee/68">
                  지금 많이 읽히는 책을 확인하고 상세 정보로 이어서 살펴보세요.
                </p>
              </div>
            </div>

            <div className="mt-11">
              {loading ? <p className="text-coffee/70">로딩 중...</p> : null}
              {!loading && error ? <p className="text-coffee/70">{error}</p> : null}
              {!loading && !error && books.length === 0 ? (
                <p className="text-coffee/70">표시할 도서가 없습니다.</p>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                {books.map((book, index) => (
                  <BookCard key={`${book.isbn13 ?? book.isbn ?? index}`} book={book} showPrice />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
