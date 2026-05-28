export type ClubCategory = "문학" | "에세이" | "인문" | "SF";

export type ClubSort = "latest" | "popular" | "available";

export type Club = {
  id: number;
  title: string;
  author: string;
  category: ClubCategory;
  members: number;
  maxMembers: number;
  tags: string[];
  thumbnail: string;
  description: string;
  memberProfiles: string[];
  meetingLabel: string;
  createdAt: string;
  hasStarted?: boolean;
};
