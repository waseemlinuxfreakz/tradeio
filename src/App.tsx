import { Suspense, useEffect, useState } from "react";
import LoadingFallback from "./components/LoadingFallback";
import { useAuthStore } from "./lib/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";
import AppLauncherTelegramWeb from "./components/AppLauncherTelegramWeb";
import PublicRoutes from "./routing/publicRotes";
import PrivateRoutes from "./routing/privateRoutes";
import { socketConnectionForNotification } from "./hooks/useSocketConnectionForNotification";
import useTelegramLogin from "./hooks/useTelegramLogin";
import FullPageLoader from "./components/Loader";
import { getDecodedUserToken } from "./utils";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
const App = () => {
  const { isAuthenticated } = useAuthStore();
  const isTokenAvailable = localStorage.getItem("token");
  const navigate = useNavigate();
  const { handleTelegramLogin, handleTelegramLoginPending } =
    useTelegramLogin();
  const user = getDecodedUserToken();
  socketConnectionForNotification();
  const [view, setView] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const ref = params.get("ref");
    const signal = params.get("signal");

    if (ref) {
      localStorage.setItem("referrer_username", ref);
    }

    if (signal) {
      localStorage.setItem("signal", signal);
    }
  }, []);

  useEffect(() => {
    if (user?.userId) {
      const params = new URLSearchParams(window.location.search);
      const signalId = params.get("signal");

      if (signalId) {
        navigate(`/signal/${signalId}`);
        localStorage.removeItem('/signal')
      }
    }
  }, [user?.userId]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      const isTelegram = tg.initData;
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      if (!isTelegram && isMobile) {
        // window.location.href = `https://t.me/${BOT_NAME}`;
      } else if (isTelegram && !isMobile) {
        setView(1);
      } else if (isMobile && window?.Telegram?.WebApp?.initDataUnsafe?.user) {
        const token = localStorage.getItem("token");
        if (!token) {
          handleTelegramLogin(window?.Telegram?.WebApp?.initDataUnsafe?.user);
        }
      } else if (!isMobile && !isTelegram) {
      }
    }
    if (window.Telegram?.WebApp) {
      // 1. Notify Telegram the app is ready
    }
  }, [window.Telegram?.WebApp]);
  if (handleTelegramLoginPending) {
    <FullPageLoader loading={handleTelegramLoginPending} />;
  }
  if (view == 1) {
    return (
      <div>
        <AppLauncherTelegramWeb />
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID || ""}>
      <Suspense fallback={<LoadingFallback />}>
        {/* <ReactQueryDevtools /> */}
        {isAuthenticated || isTokenAvailable ? (
          <PrivateRoutes />
        ) : (
          <PublicRoutes />
        )}
      </Suspense>
    </GoogleOAuthProvider>
  );
};

export default App;
