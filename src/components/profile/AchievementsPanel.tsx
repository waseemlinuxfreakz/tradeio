import React, { useEffect, useState } from "react";
import {
  Award,
  Star,
  Users,
  TrendingUp,
  MessageCircle,
  ChevronRight,
  Gift,
} from "lucide-react";
import { getDecodedUserToken } from "../../utils";
import { Spin } from "antd";
import useAchievementDetails from "../../hooks/useAchievementDetails";
import {
  Achievements,
  User,
  UnlockAchievementPayload,
} from "../../types/achievement";
import useUserDetials from "../../hooks/useUserDetails";
import FullPageLoader from "../Loader";
import { message } from "antd";
import { unlockAchievement } from "../../apis/apiEndpoints";
import { useQueryClient } from "@tanstack/react-query";

interface Stats {
  reputationPoints: number;
  referralCount: number;
  successfulTrades: number;
  voteCount: number;
}
interface AchievementCardProps {
  achievement: Achievements;
  stats?: Stats;
  userData?: User;
}
interface AchievementsPanelProps {
  onClose?: () => void;
}

// Move getIconComponent outside of components to make it accessible to both
const getIconComponent = (iconName: string, className: string) => {
  switch (iconName) {
    case "award":
      return <Award className={className} />;
    case "star":
      return <Star className={className} />;
    case "users":
      return <Users className={className} />;
    case "trending-up":
      return <TrendingUp className={className} />;
    case "signal":
      return <TrendingUp className={className} />;
    case "message-circle":
      return <MessageCircle className={className} />;
    default:
      return <Award className={className} />;
  }
};

const achievementsSample = [
  {
    id: "points_100",
    label: "CENTURY_CLUB",
    name: "Century Club",
    description: "Reach 100 reputation points",
    category: "points",
    requirement: 100,
    currentProgress: 100,
    reward: 1000,
    completed: true,
    collected: false,
    icon: "award",
  },
  {
    id: "points_200",
    label: "RISING_STAR",
    name: "Rising Star",
    description: "Reach 200 reputation points",
    category: "points",
    requirement: 200,
    currentProgress: 100,
    reward: 1000,
    completed: false,
    collected: false,
    icon: "star",
  },
  {
    id: "points_500",
    label: "EXPERT_ANALYST",
    name: "Expert Analyst",
    description: "Reach 500 reputation points",
    category: "points",
    requirement: 500,
    currentProgress: 100,
    reward: 2000,
    completed: false,
    collected: false,
    icon: "trending-up",
  },
  {
    id: "points_1000",
    label: "MASTER_TRADER",
    name: "Master Trader",
    description: "Reach 1000 reputation points",
    category: "points",
    requirement: 1000,
    currentProgress: 100,
    reward: 5000,
    completed: false,
    collected: false,
    icon: "award",
  },
  {
    id: "invite_5",
    label: "NETWORK_BUILDER",
    name: "Network Builder",
    description: "Invite 5 new users",
    category: "invite",
    requirement: 5,
    currentProgress: 0,
    reward: 500,
    completed: false,
    collected: false,
    icon: "users",
  },
  {
    id: "invite_10",
    label: "COMMUNITY_LEADER",
    name: "Community Leader",
    description: "Invite 10 new users",
    category: "invite",
    requirement: 10,
    currentProgress: 0,
    reward: 1000,
    completed: false,
    collected: false,
    icon: "users",
  },
  {
    id: "trading_10",
    label: "SIGNAL_SPECIALIST",
    name: "Signal Specialist",
    description: "Create 10 successful signals",
    category: "trading",
    requirement: 10,
    currentProgress: 0,
    reward: 1500,
    completed: false,
    collected: false,
    icon: "signal",
  },
  {
    id: "community_50",
    label: "COMMUNITY_VOICE",
    name: "Community Voice",
    description: "Vote on 50 signals",
    category: "community",
    requirement: 50,
    currentProgress: 0,
    reward: 1000,
    completed: false,
    collected: false,
    icon: "message-circle",
  },
];

const AchievementsPanel = ({ onClose }: AchievementsPanelProps) => {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "points" | "invite" | "trading" | "community"
  >("all");
  const user = getDecodedUserToken();
  const { achievementData, achievementLoading } = useAchievementDetails(
    user!.userId
  );
  const { userDetails, userDetialsLoading } = useUserDetials(user!.userId);
  const userData = userDetails?.data?.data;
  const [achievements, setAchievements] = useState<Achievements[]>([]);
  const stats = achievementData?.data?.stats;
  const reputationPoints = stats?.reputationPoints || 0;

  if (!achievements) return null;
  const filteredAchievements =
    activeCategory === "all"
      ? achievements
      : achievements.filter(
          (achievement) => achievement.category === activeCategory
        );
  useEffect(() => {
    const result = achievementsSample
      .map((record) => {
        const category = record.category as
          | "points"
          | "invite"
          | "trading"
          | "community";
        if (record.category === "points") {
          if (reputationPoints >= record.requirement) {
            const collected =
              userData?.collectedAchievements?.includes(record.label) ?? false;
            return {
              ...record,
              category,
              completed: true,
              collected,
              currentProgress: record.requirement,
            };
          } else {
            return {
              ...record,
              category,
              completed: false,
              collected: false,
              currentProgress: reputationPoints,
            };
          }
        } else if (record.category === "invite") {
          const referralCount = stats?.referralCount || 0;
          if (referralCount >= record.requirement) {
            const collected =
              userData?.collectedAchievements?.includes(record.label) ?? false;
            return {
              ...record,
              category,
              completed: true,
              collected,
              currentProgress: record.requirement,
            };
          } else {
            return {
              ...record,
              category,
              completed: false,
              collected: false,
              currentProgress: referralCount,
            };
          }
        } else if (record.category === "trading") {
          const successfulTrades = stats?.successfulTrades || 0;
          if (successfulTrades >= record.requirement) {
            const collected =
              userData?.collectedAchievements?.includes(record.label) ?? false;
            return {
              ...record,
              category,
              completed: true,
              collected,
              currentProgress: record.requirement,
            };
          } else {
            return {
              ...record,
              category,
              completed: false,
              collected: false,
              currentProgress: successfulTrades,
            };
          }
        } else if (record.category === "community") {
          const voteCount = stats?.voteCount || 0;
          if (voteCount >= record.requirement) {
            const collected =
              userData?.collectedAchievements?.includes(record.label) ?? false;
            return {
              ...record,
              category,
              completed: true,
              collected,
              currentProgress: record.requirement,
            };
          } else {
            return {
              ...record,
              category,
              completed: false,
              collected: false,
              currentProgress: voteCount,
            };
          }
        }
        // fallback (should not happen)
        return undefined;
      })
      .filter(Boolean) as Achievements[];
    setAchievements(result);
  }, [userDetails, achievementData]);

  if (userDetialsLoading || achievementLoading) {
    return (
      <FullPageLoader loading={userDetialsLoading || achievementLoading} />
    );
  }
  // <span className="text-sm">Executing Trade...</span>
  return (
    <div className="bg-slate-900 min-h-screen text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-pink-500" />
            <h1 className="text-lg font-bold">Achievements</h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tokens Earned */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-xl p-4 border border-pink-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-slate-300">Total Tokens Earned</div>
              <div className="text-2xl font-bold">
                {userData?.balance?.toFixed(2) || 0} TRT
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-pink-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory("points")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeCategory === "points"
                ? "bg-pink-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
            }`}
          >
            <Award className="w-4 h-4" />
            Points
          </button>
          <button
            onClick={() => setActiveCategory("invite")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeCategory === "invite"
                ? "bg-pink-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
            }`}
          >
            <Users className="w-4 h-4" />
            Invites
          </button>
          <button
            onClick={() => setActiveCategory("trading")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeCategory === "trading"
                ? "bg-pink-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Trading
          </button>
          <button
            onClick={() => setActiveCategory("community")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeCategory === "community"
                ? "bg-pink-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Community
          </button>
        </div>
      </div>

      {/* Achievements List */}
      <div className="p-4 space-y-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            stats={stats}
            userData={userData}
          />
        ))}
      </div>
    </div>
  );
};

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  stats,
  userData,
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const progressPercentage = Math.min(
    100,
    (achievement.currentProgress / achievement.requirement) * 100
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "points":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-500",
          progress: "bg-blue-500",
        };
      case "invite":
        return {
          bg: "bg-purple-500/10",
          text: "text-purple-500",
          progress: "bg-purple-500",
        };
      case "trading":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-500",
          progress: "bg-emerald-500",
        };
      case "community":
        return {
          bg: "bg-amber-500/10",
          text: "text-amber-500",
          progress: "bg-amber-500",
        };
      default:
        return {
          bg: "bg-pink-500/10",
          text: "text-pink-500",
          progress: "bg-pink-500",
        };
    }
  };

  const handleUnlockAchievement = (
    achievementLabel: string,
    achievementAmount: number
  ) => {
    const payload: UnlockAchievementPayload = {
      label: achievementLabel,
      amount: achievementAmount,
    };
    setLoading(true);
    unlockAchievement(payload)
      .then((response) => {
        if (response.status === 200) {
          message.success("Achievement unlocked successfully");
          queryClient.invalidateQueries({ queryKey: ["user-details"] });
          queryClient.invalidateQueries({ queryKey: ["user-achievement"] });
        } else {
          if (response.status === 400) {
            if (response.data.message) {
              message.error(response.data.message);
              return;
            }
          }
          message.error("Failed to unlock achievement");
        }
      })
      .catch((error) => {
        message.error(error?.message || "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const colors = getCategoryColor(achievement.category);
  return (
    <Spin spinning={loading}>
      <div
        className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border ${
          achievement.completed
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-slate-700/50"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            {getIconComponent(achievement.icon, `w-6 h-6 ${colors.text}`)}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{achievement.name}</h3>
                {achievement.completed && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                    Completed
                  </span>
                )}
              </div>
              <div className="text-right">
                {achievement.collected &&
                userData?.collectedAchievements?.includes(achievement.label) ? (
                  <div className="flex">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-600/10 text-green-400 text-xs font-semibold">
                      Collected
                    </span>
                    <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                      <Gift className="w-4 h-4" />
                      {achievement.reward.toLocaleString()} TRT
                    </div>
                  </div>
                ) : achievement.completed ? (
                  <button
                    className="text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 px-3 py-1 rounded-full shadow-lg animate-bounce transition-all"
                    type="button"
                    onClick={() =>
                      handleUnlockAchievement(
                        achievement.label,
                        achievement.reward
                      )
                    }
                  >
                    Collect {achievement.reward.toLocaleString()} TRT
                  </button>
                ) : (
                  <>
                    <div className="text-sm font-medium text-pink-500">
                      {achievement.reward.toLocaleString()} TRT
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-400 mt-1">
              {achievement.description}
            </p>

            {!achievement.completed && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-slate-400">
                    {achievement.currentProgress} / {achievement.requirement}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors.progress} rounded-full`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default AchievementsPanel;
