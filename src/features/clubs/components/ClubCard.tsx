import { motion } from "framer-motion";
import { memo, useCallback, type MouseEvent } from "react";
import JoinClubButton from "@/features/clubs/components/JoinClubButton";
import type { Club } from "@/features/clubs/types";

type ClubCardProps = {
  club: Club;
  onJoin: (club: Club) => void;
};

function ClubCard({ club, onJoin }: ClubCardProps) {
  const remaining = club.maxMembers - club.members;
  const handleJoin = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onJoin(club);
    },
    [club, onJoin],
  );

  return (
    <motion.article
      className="club-card flex h-full flex-col rounded-[1.75rem] border border-coffee/10 bg-ivory/70 p-4 shadow-warm backdrop-blur-xl"
      whileHover={{ y: -7, scale: 1.01 }}
      transition={{ duration: 0.26 }}
    >
      <div className="flex gap-4">
        <img
          src={club.thumbnail}
          alt={`${club.title} 책 표지`}
          className="h-40 w-28 shrink-0 rounded-[1.1rem] object-cover shadow-soft"
        />
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-linen/50 px-3 py-1 text-xs font-bold text-coffee/72">
              {club.category}
            </span>
            <span className="text-xs font-bold text-matcha">
              {remaining > 0 ? `${remaining}자리 남음` : "모집 완료"}
            </span>
          </div>
          <h2 className="mt-4 text-xl font-bold leading-tight text-espresso">{club.title}</h2>
          <p className="mt-1 text-sm text-coffee/58">{club.author}</p>
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-coffee/70">{club.description}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {club.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/72 px-3 py-1.5 text-xs font-bold text-coffee/68">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-5">
        <p className="text-sm font-bold text-coffee/58">{club.meetingLabel}</p>
        <div className="mt-4 flex flex-col gap-4 border-t border-coffee/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex -space-x-2" aria-label="참여 멤버">
            {club.memberProfiles.map((profile) => (
              <span
                key={profile}
                title={profile}
                className="grid size-9 place-items-center rounded-full border-2 border-ivory bg-linen text-xs font-bold text-coffee"
              >
                {profile.slice(0, 1)}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="whitespace-nowrap text-sm font-bold text-coffee/68">
              {club.members} / {club.maxMembers}명
            </span>
            <JoinClubButton onClick={handleJoin} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default memo(ClubCard);
