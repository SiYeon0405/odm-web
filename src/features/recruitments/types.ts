export type RecruitmentStatus = "RECRUITING" | "CLOSED" | "COMPLETED";

export type Recruitment = {
  recruitmentId: number;
  clubId?: number;
  title: string;
  description: string;
  recruitmentStatus: RecruitmentStatus;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};

export type RecruitmentUpdateRequest = {
  title: string;
  description: string;
};
