import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import DiscussionCard from "@/features/discussions/components/DiscussionCard";
import { getDiscussionErrorMessage, getDiscussionsByClubId } from "@/features/discussions/api/discussionsApi";
import type { Discussion, PageResponse } from "@/features/discussions/types";

const PAGE_SIZE = 20;

export default function DiscussionListPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [discussionsPage, setDiscussionsPage] = useState<PageResponse<Discussion> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    const id = Number(clubId);

    if (!clubId || Number.isNaN(id)) {
      setErrorMessage("잘못된 모임입니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    getDiscussionsByClubId(id, { page, size: PAGE_SIZE })
      .then((data) => {
        if (!active) return;
        setDiscussionsPage(data);
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(getDiscussionErrorMessage(error));
        setDiscussionsPage(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [clubId, page]);

  const totalPages = discussionsPage?.totalPages ?? 0;
  const discussions = discussionsPage?.content ?? [];

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-5xl px-4 pb-20 pt-40 md:pt-48">
          <h1 className="text-3xl font-bold">게시글</h1>

          {isLoading && <p className="mt-8 text-coffee/64">게시글을 불러오는 중입니다.</p>}
          {!isLoading && errorMessage && <p className="mt-8 font-bold text-caramel">{errorMessage}</p>}
          {!isLoading && !errorMessage && discussions.length === 0 && (
            <p className="mt-8 text-coffee/64">등록된 게시글이 없습니다.</p>
          )}
          {!isLoading && !errorMessage && discussions.length > 0 && (
            <div className="mt-8 grid gap-5">
              {discussions.map((discussion) => (
                <DiscussionCard
                  key={discussion.discussionId}
                  discussion={discussion}
                  onClick={() => navigate(`/discussions/${discussion.discussionId}`)}
                />
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
              disabled={page === 0 || isLoading}
              className="rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee disabled:cursor-not-allowed disabled:opacity-50"
            >
              이전
            </button>
            <span className="text-sm font-bold text-coffee/70">
              {page + 1} / {Math.max(totalPages, 1)}
            </span>
            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={isLoading || totalPages === 0 || page + 1 >= totalPages}
              className="rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee disabled:cursor-not-allowed disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
