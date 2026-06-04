import { FormEvent, useState } from "react";

type CommentFormProps = {
  onSubmit: (content: string) => Promise<void> | void;
  isSubmitting?: boolean;
};

export default function CommentForm({ onSubmit, isSubmitting = false }: CommentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent || isSubmitting) return;

    try {
      await onSubmit(trimmedContent);
      setContent("");
    } catch {
      // Keep the typed comment when submission fails.
    }
  };

  return (
    <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={isSubmitting}
        rows={3}
        className="w-full resize-none rounded-2xl border border-coffee/10 bg-ivory/80 px-4 py-3 text-sm leading-6 text-espresso outline-none transition focus:border-caramel disabled:cursor-not-allowed disabled:opacity-60"
        placeholder="댓글을 입력하세요."
      />
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="rounded-full bg-[linear-gradient(135deg,#3a251d_0%,#81543b_58%,#b17e4b_100%)] px-5 py-3 text-sm font-bold text-ivory shadow-[0_12px_26px_rgba(67,42,29,.18)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        댓글 작성
      </button>
    </form>
  );
}
