import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Bell, Settings } from "lucide-react";
import NavigationBar from "./NavigationBar";
import SignalMatchPopup from "./SignalMatchPopup";
import ErrorBoundary from "./ErrorBoundary";
import SwipeableSignalList from "./signals/SwipeableSignalList";
import { getDecodedUserToken } from "../utils";
import useDashboardSignals from "../hooks/useDashboardSignal";
import useInfiniteScroll from "../utils/debounce";
import useUserDetials from "../hooks/useUserDetails";
import FullPageLoader from "./Loader";
import { If, Then } from "react-if";

const ModernSignalDashboard = () => {
  const navigate = useNavigate();
  const [showSignalMatch, setShowSignalMatch] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const user = getDecodedUserToken();
  const { userDetails, userDetialsLoading } = useUserDetials(user!.userId);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDashboardSignals(userDetails?.data?.data._id);
  useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (direction === "up") {
      setShowSignalMatch(true);
    }
  };
  if (userDetialsLoading) {
    return <FullPageLoader loading={userDetialsLoading} />;
  }
  const userData = userDetails?.data?.data;
  const isValidatorFlag = userDetails?.data?.data?.isValidator;
  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <ErrorBoundary>
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="p-3">
            <div className="flex items-center justify-between">
              <If condition={userData?.balance !== null && userData?.balance !== undefined}>
                <Then>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-sm">Balance:</span>
                    <span className="text-sm font-bold">{userData.balance.toFixed(2)} TRT</span>
                  </div>
                </Then>
              </If>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/create-signal")}
                  className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/notifications")}
                  className="p-2 rounded-full hover:bg-slate-800/50"
                >
                  <Bell className="w-5 h-5 text-slate-400" />
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="p-2 rounded-full hover:bg-slate-800/50"
                >
                  <Settings className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-screen overflow-y-auto">
          <div className="p-4" ref={chartRef}>
            <SwipeableSignalList
              signals={data}
              onSwipe={handleSwipe}
              isLoading={isLoading}
              isError={isError}
              isValidatorFlag={isValidatorFlag}
            />

            {isFetchingNextPage && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        <NavigationBar onQuickAction={() => setShowSignalMatch(true)} />

        {data.length > 0 && showSignalMatch && (
          <SignalMatchPopup
            onClose={() => setShowSignalMatch(false)}
            signal={data[0]}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};

export default ModernSignalDashboard;
