export type UserRating = {
  ratingId: number;
  reviewerId: number;
  targetUserId: number;
  score: number;
  comment?: string;
  createdAt: string;
};

export type UserRatingListResponse = {
  averageScore: number;
  totalRatings: number;
  ratings: UserRating[];
  totalPages: number;
  page: number;
  size: number;
};

export type CreateUserRatingRequest = {
  clubId: number;
  targetUserId: number;
  score: number;
  comment?: string;
};
