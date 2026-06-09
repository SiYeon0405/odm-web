export type Notification = {
  notificationId: number;
  title: string;
  content: string;
  notificationType: string;
  isRead: boolean;
  referenceId?: number | null;
  createdAt: string;
};

export type NotificationPage = {
  content: Notification[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};
