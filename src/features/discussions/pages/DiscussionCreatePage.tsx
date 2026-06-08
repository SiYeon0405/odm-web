import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import { createDiscussion, getDiscussionErrorMessage } from "@/features/discussions/api/discussionsApi";

export default function DiscussionCreatePage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = Number(clubId);
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!clubId || Number.isNaN(id) || !trimmedTitle || !trimmedContent || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const discussion = await createDiscussion({
        clubId: id,
        title: trimmedTitle,
        content: trimmedContent,
      });
      const discussionId = discussion.discussionId;

      navigate(discussionId ? `/discussions/${discussionId}` : `/clubs/${id}/discussions`);
    } catch (error) {
      setErrorMessage(getDiscussionErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = isSubmitting || !title.trim() || !content.trim();

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-40 md:pt-48">
          <Link
            to={clubId ? `/clubs/${clubId}/discussions` : "/clubs"}
            className="inline-flex rounded-full border border-coffee/10 bg-ivory px-4 py-2 text-sm font-bold text-coffee"
          >
            목록으로 돌아가기
          </Link>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 shadow-warm"
          >
            <h1 className="text-3xl font-bold">토론글 작성</h1>
            <label className="mt-6 block text-sm font-bold text-coffee/70" htmlFor="discussion-title">
              제목
            </label>
            <input
              id="discussion-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-coffee/10 bg-white/70 px-4 py-3 text-sm font-bold text-espresso outline-none transition focus:border-caramel"
              placeholder="제목을 입력하세요."
            />

            <label className="mt-5 block text-sm font-bold text-coffee/70" htmlFor="discussion-content">
              내용
            </label>
            <textarea
              id="discussion-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="mt-2 min-h-56 w-full rounded-2xl border border-coffee/10 bg-white/70 px-4 py-3 text-sm font-bold leading-7 text-espresso outline-none transition focus:border-caramel"
              placeholder="내용을 입력하세요."
            />

            {errorMessage && <p className="mt-4 font-bold text-caramel">{errorMessage}</p>}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="rounded-full bg-espresso px-5 py-3 text-sm font-bold text-cream disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "작성 중..." : "작성하기"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
