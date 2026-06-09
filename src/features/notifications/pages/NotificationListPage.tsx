import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import {
  getNotificationErrorMessage,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/features/notifications/api/notificationsApi";
import type { Notification } from "@/features/notifications/types";

const PAGE = 0;
const SIZE = 20;

export default function NotificationListPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setErrorMessage("");

    Promise.all([getNotifications(PAGE, SIZE), getUnreadNotificationCount()])
      .then(([notificationPage, count]) => {
        if (!active) return;
        setNotifications(notificationPage.content);
        setUnreadCount(count);
      })
      .catch((error) => {
        if (active) setErrorMessage(getNotificationErrorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      const updatedNotification = await markNotificationAsRead(notification.notificationId);
      setNotifications((current) =>
        current.map((item) =>
          item.notificationId === notification.notificationId
            ? { ...item, ...(updatedNotification ?? {}), isRead: true }
            : item,
        ),
      );
      if (!notification.isRead) {
        setUnreadCount((current) => Math.max(0, current - 1));
      }

      if (notification.notificationType === "REVIEW_REQUEST" && notification.referenceId) {
        navigate(`/clubs/${notification.referenceId}/reviews/new`);
      }
    } catch (error) {
      window.alert(getNotificationErrorMessage(error));
    }
  };

  const handleMarkAllAsRead = async () => {
    if (isMarkingAll) return;

    setIsMarkingAll(true);
    try {
      await markAllNotificationsAsRead();
      setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      window.alert(getNotificationErrorMessage(error));
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <>
      <main className="home-page min-h-screen bg-cream font-sans text-espresso">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-40 md:pt-48">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-caramel">Notifications</p>
              <h1 className="mt-2 text-3xl font-bold">알림</h1>
              <p className="mt-2 text-sm font-bold text-coffee/60">읽지 않은 알림 {unreadCount}개</p>
            </div>
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll || notifications.length === 0}
              className="rounded-full bg-espresso px-5 py-3 text-sm font-bold text-cream disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMarkingAll ? "처리 중..." : "전체 읽음"}
            </button>
          </div>

          {isLoading && <p className="mt-8 text-coffee/64">알림을 불러오는 중입니다.</p>}
          {!isLoading && errorMessage && <p className="mt-8 font-bold text-caramel">{errorMessage}</p>}
          {!isLoading && !errorMessage && notifications.length === 0 && (
            <p className="mt-8 rounded-2xl border border-coffee/10 bg-ivory/70 p-6 text-sm font-bold text-coffee/64">
              알림이 없습니다.
            </p>
          )}
          {!isLoading && !errorMessage && notifications.length > 0 && (
            <div className="mt-8 space-y-3">
              {notifications.map((notification) => (
                <button
                  key={notification.notificationId}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full rounded-2xl border p-5 text-left shadow-warm transition hover:-translate-y-0.5 ${
                    notification.isRead
                      ? "border-coffee/10 bg-ivory/70 text-coffee/72"
                      : "border-caramel/30 bg-white text-espresso"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-bold">{notification.title}</h2>
                    <span className="rounded-full bg-coffee/8 px-3 py-1 text-xs font-bold text-coffee/64">
                      {notification.isRead ? "읽음" : "안 읽음"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold leading-6 text-coffee/70">{notification.content}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-coffee/48">
                    <span>{notification.notificationType}</span>
                    {notification.createdAt && <span>{notification.createdAt}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
