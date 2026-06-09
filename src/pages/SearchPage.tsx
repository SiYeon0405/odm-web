import { FormEvent, useState } from "react";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import BookCard from "@/components/BookCard/BookCard";
import { getApiErrorMessage, normalizeBookList, searchBooks } from "@/api/bookApi";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const data = await searchBooks(trimmedKeyword);
      setBooks(normalizeBookList(data));
    } catch (requestError) {
      setBooks([]);
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="home-page min-h-screen overflow-hidden bg-cream px-4 pb-24 pt-32 font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />

        <section className="relative z-10 mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-caramel">Book search</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-espresso md:text-5xl">도서 검색</h1>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 rounded-[1.6rem] border border-coffee/10 bg-ivory/74 p-4 shadow-warm backdrop-blur-xl sm:flex-row">
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="책 제목 또는 저자를 입력하세요"
              className="min-h-14 flex-1 rounded-full border border-coffee/10 bg-white/70 px-5 text-base text-espresso outline-none transition placeholder:text-coffee/42 focus:border-caramel/50"
            />
            <button type="submit" className="home-button home-button-primary inline-flex min-h-14 items-center justify-center rounded-full px-7 py-3 text-base font-bold">
              검색
            </button>
          </form>

          <div className="mt-10">
            {loading ? <p className="text-coffee/70">로딩 중...</p> : null}
            {!loading && error ? <p className="text-coffee/70">{error}</p> : null}
            {!loading && !error && searched && books.length === 0 ? (
              <p className="text-coffee/70">검색 결과가 없습니다.</p>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
              {books.map((book, index) => (
                <BookCard key={`${book.isbn13 ?? book.isbn ?? index}`} book={book} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
