export type ReadingClub = {
  title: string;
  author: string;
  coverTone: string;
  capacity: number;
  participants: number;
  progress: number;
};

export type ReadingNote = {
  nickname: string;
  pages: string;
  quote: string;
  likes: number;
};

export const readingClubs: ReadingClub[] = [
  {
    title: "인간 실격",
    author: "다자이 오사무",
    coverTone: "from-[#60463b] via-[#30241f] to-[#a97b5b]",
    capacity: 12,
    participants: 9,
    progress: 72,
  },
  {
    title: "아몬드",
    author: "손원평",
    coverTone: "from-[#d5b07c] via-[#9a6e45] to-[#493126]",
    capacity: 10,
    participants: 7,
    progress: 58,
  },
  {
    title: "모순",
    author: "양귀자",
    coverTone: "from-[#88725b] via-[#45362c] to-[#d7c09b]",
    capacity: 14,
    participants: 11,
    progress: 81,
  },
  {
    title: "어린 왕자",
    author: "앙투안 드 생텍쥐페리",
    coverTone: "from-[#53666b] via-[#273236] to-[#c9b183]",
    capacity: 8,
    participants: 6,
    progress: 44,
  },
];

export const readingNotes: ReadingNote[] = [
  {
    nickname: "고요한밤",
    pages: "오늘 42쪽 읽음",
    quote: "책장을 넘기는 속도가 조금 느려져도, 문장은 오래 남아요.",
    likes: 18,
  },
  {
    nickname: "밤의책상",
    pages: "2주차 함께 읽는 중",
    quote: "질문을 나누고 다시 읽을 때 지나친 장면이 새로 보여요.",
    likes: 11,
  },
  {
    nickname: "문장수집가",
    pages: "완독까지 36쪽",
    quote: "오늘의 감상은 긴 리뷰보다 작은 메모 한 줄에 가까웠어요.",
    likes: 24,
  },
];
