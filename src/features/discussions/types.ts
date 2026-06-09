export type Discussion = {
  discussionId: number;
  clubId?: number;
  userId?: number;
  title: string;
  content: string;
  commentCount?: number;
  likeCount?: number;
  status?: string;
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
