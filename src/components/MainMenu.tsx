import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  User,
  Signal,
  Award,
  Wallet,
  Bell,
  Users,
  Gift,
  Trophy,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  BarChart2,
} from "lucide-react";
import { useMenuStore, useAuthStore } from "../lib/store";
import useUserDetials from "../hooks/useUserDetails";
import { getDecodedUserToken } from "../utils";
import FullPageLoader from "./Loader";
import { useQueryClient } from "@tanstack/react-query";
const MainMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getDecodedUserToken();
  const { userDetails, userDetialsLoading } = useUserDetials(user!.userId);
  const userData = userDetails?.data?.data;
  const { isOpen, actions } = useMenuStore();
  const { actions: authActions } = useAuthStore(); // Access actions from useAuthStore
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const menuItems = [
    { icon: BarChart2, label: "Admin Dashboard", path: "/admin" },
    { icon: User, label: "Profile", path: "/personal" },
    { icon: Wallet, label: "Portfolio", path: "/portfolio" },
    { icon: Signal, label: "Signals", path: "/signals" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Gift, label: "Referrals", path: "/referrals" },
    { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
    { icon: FileText, label: "Whitepaper", path: "/whitepaper" },
    { icon: HelpCircle, label: "Support", path: "/support" },
    { icon: Settings, label: "Settings", path: "/settings" },
    // { icon: LogOut, label: "Logout", path: "/" },
  ];
  const handleNavigation = (path: string) => {
    navigate(path);
    actions.close();
  };

  const handleLogout = () => {
    authActions.logout();
    actions.close();
    queryClient.clear();
    localStorage.removeItem('token')
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        actions.close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, actions]);

  if (!isOpen) return null;
  if (userDetialsLoading) {
    return <FullPageLoader loading={userDetialsLoading} />;
  }
  return (
    <div className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm">
      <div
        ref={menuRef}
        className="absolute right-0 top-0 bottom-0 w-80 bg-[#0f172a]/80 backdrop-blur-md border-l border-slate-800/50 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-slate-800/50">
          <h2 className="text-xl font-bold text-pink-500">Menu</h2>
          <button
            onClick={actions.close}
            className="p-2 rounded-full hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-4 h-[75%] md:h-full md:overflow-auto overflow-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                if (item.label === "Logout") {
                  localStorage.removeItem("token");
                  handleLogout();
                } else handleNavigation(item.path);
                }}
                className="w-full px-6 py-3 flex items-center gap-3 hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white"
                style={
                item.label === "Admin Dashboard" && userData?.user_type !== "ADMIN"
                  ? { display: "none" }
                  : undefined
                }
              >
                <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 flex items-center gap-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
