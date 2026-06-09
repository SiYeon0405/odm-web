export type Comment = {
  commentId: number;
  discussionId?: number;
  postId?: number;
  userId?: number;
  writerId?: number;
  writerNickname?: string;
  content: string;
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
