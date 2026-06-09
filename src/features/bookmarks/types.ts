export type BookmarkTargetType = "POST" | "REVIEW";

export type Bookmark = {
  bookmarkId: number;
  targetId?: number;
  targetType?: BookmarkTargetType | string;
  title?: string;
  createdAt?: string;
};

export type BookmarkPage = {
  content: Bookmark[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};
