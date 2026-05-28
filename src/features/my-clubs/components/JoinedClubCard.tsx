import { Link } from "react-router-dom";
import type { Club } from "@/features/clubs/types";

type JoinedClubCardProps = {
  club: Club;
};

export default function JoinedClubCard({ club }: JoinedClubCardProps) {
  return (
    <article className="club-card rounded-[1.75rem] border border-coffee/10 bg-ivory/70 p-4 shadow-warm backdrop-blur-xl">
      <div className="flex gap-4">
        <img
          src={club.thumbnail}
          alt={`${club.title} 책 표지`}
          className="h-40 w-28 shrink-0 rounded-[1.1rem] object-cover shadow-soft"
        />
        <div className="min-w-0 flex-1 py-1">
          <span className="rounded-full bg-matcha/14 px-3 py-1 text-xs font-bold text-matcha">
            참여 중
          </span>
          <h2 className="mt-4 text-xl font-bold text-espresso">{club.title}</h2>
          <p className="mt-1 text-sm text-coffee/58">{club.author}</p>
          <p className="mt-4 text-sm font-bold text-coffee/68">{club.meetingLabel}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-coffee/8 pt-4">
        <span className="text-sm font-bold text-coffee/66">
          {club.members} / {club.maxMembers}명
        </span>
        <Link
          to={`/clubs/${club.id}`}
          className="rounded-full border border-coffee/12 bg-white/52 px-4 py-3 text-xs font-bold text-coffee transition hover:bg-ivory hover:text-espresso"
        >
          모임 보기
        </Link>
      </div>
    </article>
  );
}

