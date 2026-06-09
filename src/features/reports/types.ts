export type UserReport = {
  reportId: number;
  reporterId: number;
  targetUserId: number;
  reason: string;
  status: string;
  createdAt: string;
};

export type UserReportListResponse = {
  totalReports: number;
  blacklistCount: number;
  blacklisted: boolean;
  reports: UserReport[];
  page: number;
  size: number;
  totalPages: number;
};

export type CreateUserReportRequest = {
  clubId: number;
  targetUserId: number;
  reason: string;
};
