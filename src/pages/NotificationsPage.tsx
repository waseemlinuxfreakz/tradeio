import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Settings } from "lucide-react";
import PageTransition from "../components/PageTransition";
import NavigationBar from "../components/NavigationBar";
import useGlobalNotification from "../hooks/useGlobalNotification";
import { getDecodedUserToken } from "../utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FullPageLoader from "../components/Loader";
import { If, Then, Else } from "react-if";
dayjs.extend(relativeTime);

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const user = getDecodedUserToken();
  const { data, isError, isLoading } = useGlobalNotification(user!.userId);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const handleNotificationClick = (link: string) => {
    navigate(link);
  };

  useEffect(() => {
    const globalNofications = data?.data.data;
    if (globalNofications) {
      const mappedNotifications = globalNofications.map(
        (notif: any, idx: number) => ({
          id: notifications.length + idx + 1,
          type: notif.type || "Signal Executed",
          title: notif.title || "Notification",
          message: notif.message,
          time: notif.createdAt || "",
          icon: Bell,
          color: "text-sky-500",
          bgColor: "bg-sky-500/10",
        })
      );
      setNotifications(mappedNotifications);
      // setNotifications((prev) => [...prev, ...mappedNotifications]);
    }
  }, [data]);
  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold">Notifications</h1>
            </div>
            {/* <button
              onClick={() => navigate("/settings")}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button> */}
          </div>
        </div>

        {/* Notifications List */}
        <If condition={isLoading}>
          <Then>
            <FullPageLoader loading={isLoading} />
          </Then>
          <Else>
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  // onClick={() => handleNotificationClick(notification.link)}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:bg-slate-800/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full ${notification.bgColor} flex items-center justify-center`}
                    >
                      <notification.icon
                        className={`w-5 h-5 ${notification.color}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-slate-400">
                          {dayjs(notification.time).fromNow()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {/* <ChevronRight className="w-5 h-5 text-slate-400" /> */}
                  </div>
                </div>
              ))}
            </div>
            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                <p className="text-slate-400 text-center">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            )}
          </Else>
        </If>

        {/* Empty State */}

        <NavigationBar onQuickAction={() => navigate("/create-signal")} />
      </div>
    </PageTransition>
  );
};

export default NotificationsPage;
