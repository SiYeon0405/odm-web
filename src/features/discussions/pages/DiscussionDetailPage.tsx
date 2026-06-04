import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { getDiscussionById, getDiscussionErrorMessage } from "@/features/discussions/api/discussionsApi";
import type { Discussion } from "@/features/discussions/types";

export default function DiscussionDetailPage() {
  const { discussionId } = useParams();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    const id = Number(discussionId);

    if (!discussionId || Number.isNaN(id)) {
      setErrorMessage("잘못된 게시글입니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    getDiscussionById(id)
      .then((data) => {
        if (!active) return;
        setDiscussion(data);
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(getDiscussionErrorMessage(error));
        setDiscussion(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [discussionId]);

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-40 md:pt-48">
          <Link
            to={discussion?.clubId ? `/clubs/${discussion.clubId}/discussions` : "/clubs"}
            className="inline-flex rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee"
          >
            목록으로 돌아가기
          </Link>

          {isLoading && <p className="mt-8 text-coffee/64">게시글을 불러오는 중입니다.</p>}
          {!isLoading && errorMessage && <p className="mt-8 font-bold text-caramel">{errorMessage}</p>}
          {!isLoading && !errorMessage && !discussion && (
            <p className="mt-8 text-coffee/64">게시글을 찾을 수 없습니다.</p>
          )}
          {!isLoading && !errorMessage && discussion && (
            <article className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 shadow-warm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-coffee/58">댓글 {discussion.commentCount ?? 0}</span>
                <span className="text-xs font-bold text-coffee/58">좋아요 {discussion.likeCount ?? 0}</span>
                {discussion.createdAt && (
                  <span className="text-xs font-bold text-coffee/48">{discussion.createdAt}</span>
                )}
              </div>
              <h1 className="mt-5 text-3xl font-bold">{discussion.title}</h1>
              <p className="mt-6 whitespace-pre-wrap leading-7 text-coffee/72">{discussion.content}</p>
            </article>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
