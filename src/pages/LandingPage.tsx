import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import {
  Users,
  Shield,
  BarChart2,
  ArrowRight,
  Star,
  ChevronRight,
  Award,
} from "lucide-react";
import { If, Then } from "react-if";
import useTelegramLogin from "../hooks/useTelegramLogin";

const LandingPage = () => {
  const navigate = useNavigate();
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const [loading, setLoading] = useState(false);
  const isTelegram = window.Telegram?.WebApp?.initDataUnsafe?.user;

  const { isAuthenticated } = useAuthStore();
  const { handleTelegramLogin, handleTelegramLoginPending } =
    useTelegramLogin();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      {/* Balance Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              {/* <Wallet className="w-4 h-4 text-pink-500" />
              <span className="text-sm">Balance:</span>
              <span className="text-sm font-bold">1,234.56 TRT</span> */}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const tg = window.Telegram?.WebApp;
                  if (loading) return;

                  setLoading(true);
                  if (tg) {
                    tg.ready();
                    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                    if (
                      isMobile &&
                      window?.Telegram?.WebApp?.initDataUnsafe?.user
                    ) {
                      handleTelegramLogin(
                        window?.Telegram?.WebApp?.initDataUnsafe?.user
                      );
                      setLoading(false)
                      return;
                    }
                  }
                  navigate("/login");
                }}
                className="px-4 py-1.5 rounded-full bg-slate-800/50 text-sm font-medium hover:bg-slate-700/50 transition-colors"
              >
                Login
              </button>
              <If condition={!(isTelegram && isMobile)}>
                <Then>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </button>
                </Then>
              </If>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20" />

        <div className="relative px-6 pt-12 pb-20">
          {/* Logo & Brand */}
          <div className="text-center mb-12">
            <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Traderate
            </div>
            <p className="text-sm text-slate-400">Smart Trading Platform</p>
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Trade Smarter with
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Community Intelligence
              </span>
            </h1>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Join thousands of traders using blockchain-verified signals and
              collective wisdom to make better trading decisions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={() => navigate("/register")}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Start Trading Now
                <ArrowRight className="w-4 h-4" />
              </button>
              {/* <button className="w-full bg-slate-800/50 backdrop-blur-sm py-3 rounded-xl font-medium hover:bg-slate-700/50 transition-colors">
                Watch Demo
              </button> */}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-pink-500">92%</div>
                <div className="text-xs text-slate-400">Success Rate</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-purple-500">50K+</div>
                <div className="text-xs text-slate-400">Active Users</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-blue-500">$2M+</div>
                <div className="text-xs text-slate-400">Daily Volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Why Choose Traderate
        </h2>

        <div className="space-y-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-pink-500/10">
                <Shield className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Blockchain-Verified Signals</h3>
                <p className="text-sm text-slate-400">
                  Every trading signal is verified on the blockchain for
                  complete transparency and trust.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-500/10">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Community Intelligence</h3>
                <p className="text-sm text-slate-400">
                  Leverage collective wisdom through our unique dual voting
                  mechanism.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <BarChart2 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Automated Trading</h3>
                <p className="text-sm text-slate-400">
                  Set your preferences and let our platform execute trades
                  automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Analysts */}
      <div className="px-6 py-12 bg-slate-800/50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Top Analysts</h2>
          <button className="text-sm text-slate-400 flex items-center gap-1">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {[
            {
              name: "Sarah Johnson",
              successRate: "96%",
              followers: "23.5K",
              rank: "Top 1%",
              image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
            },
            {
              name: "Michael Chen",
              successRate: "94%",
              followers: "19.2K",
              rank: "Top 3%",
              image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=faces",
            },
          ].map((analyst, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5">
                    <img
                      src={analyst.image}
                      alt={analyst.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{analyst.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400">
                      {analyst.rank}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-emerald-500" />
                      {analyst.successRate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-purple-500" />
                      {analyst.followers}
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Trading?</h2>
        <p className="text-slate-400 mb-8">
          Join our community and start making smarter trading decisions today.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="w-full max-w-xs mx-auto bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          Create Free Account
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
