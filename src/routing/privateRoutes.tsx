import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, useEffect } from "react";
import { getDecodedUserToken } from "../utils";
import { useLocation, useNavigate } from "react-router-dom";
import WhitepaperPage from "../pages/WhitepaperPage";
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const SignalPage = lazy(() => import("../pages/SignalsPage"));
const SignalDetailsPage = lazy(() => import("../pages/SignalDetailsPage"));
const FinancialCenter = lazy(() => import("../pages/FinancialCenter"));
const CommunityPage = lazy(() => import("../pages/CommunityPage"));
const WalletPage = lazy(() => import("../pages/WalletPage"));
const StakingPage = lazy(() => import("../pages/StakingPage"));
const ReferralsPage = lazy(() => import("../pages/ReferralsPage"));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage"));
const CreateSignalPage = lazy(() => import("../pages/CreateSignalPage"));
const LeaderboardPage = lazy(() => import("../pages/LeaderboardPage"));
const PortfolioDashboard = lazy(() => import("../pages/PortfolioDashboard"));
const PortfolioTradesPage = lazy(() => import("../pages/PortfolioTradesPage"));
const MyPersonalPage = lazy(() => import("../pages/MyPersonalPage"));
const SupportPage = lazy(() => import("../pages/SupportPage"));
const AirdropPage = lazy(() => import("../pages/AirdropPage"));
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"));
const AchievementsPage = lazy(() => import("../pages/AchievementsPage"));
const BadgesPage = lazy(() => import("../pages/BadgesPage"));
const AnalystProfilePage = lazy(()=>import("../pages/AnalystProfilePage"))
const ModernSignalDashboard = lazy(
  () => import("../components/ModernSignalDashboard")
);
const MainMenu = lazy(() => import("../components/MainMenu"));

const PrivateRoutes = () => {
  const user = getDecodedUserToken();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.user_type) {
      if (user?.user_type !== "ADMIN" && location.pathname.includes("/admin")) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/signals" element={<SignalPage />} />
        {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
        <Route path="/signal/:signalId" element={<SignalDetailsPage />} />
        <Route path="/financial-center" element={<FinancialCenter />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/staking" element={<StakingPage />} />
        <Route path="/referrals" element={<ReferralsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/create-signal" element={<CreateSignalPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/portfolio" element={<PortfolioDashboard />} />
        <Route path="/portfolio/trades" element={<PortfolioTradesPage />} />
        <Route path="/personal" element={<MyPersonalPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/airdrop" element={<AirdropPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/dashboard" element={<ModernSignalDashboard />} />
        <Route path="/whitepaper" element={<WhitepaperPage />} />
        <Route path="/analyst/:analystId" element={<AnalystProfilePage/>}/>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      <MainMenu />
    </>
  );
};

export default PrivateRoutes;
