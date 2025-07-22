import { useEffect, useState } from "react";
import { Shield, Users, ThumbsUp, ChevronRight } from "lucide-react";
import { getBadges } from "../../apis/apiEndpoints";
import FullPageLoader from "../Loader";
import { Badge } from "../../types/badges";
import { BADGES } from "../../utils/constants";
import { useQuery } from "@tanstack/react-query";
type BadgesPanelProps = {
  onClose?: () => void;
};
const getIconComponent = (iconName: string, className: string) => {
  switch (iconName) {
    case "shield":
      return <Shield className={className} />;
    case "users":
      return <Users className={className} />;
    case "thumbs-up":
      return <ThumbsUp className={className} />;
    default:
      return <Shield className={className} />;
  }
};

const BadgesPanel = ({ onClose }: BadgesPanelProps) => {
  const [badges, setBadges] = useState<Badge[]>(badgesSample);
  const { data: badgesData, isLoading: badgesLoading } = useQuery({
    queryKey: ["badges"],
    queryFn: () => getBadges(),
  });

  useEffect(() => {
    if (badgesData?.data?.data) {
      const earnedMap = badgesData.data.data;
      const updatedBadges = badgesSample.map((badge) => ({
        ...badge,
        earned: !!earnedMap[badge.type],
      }));
      setBadges(updatedBadges);
    }
  }, [badgesData]);
  if (badgesLoading) {
    return <FullPageLoader loading={badgesLoading} />;
  }
  return (
    <div className="bg-slate-900 min-h-screen text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-pink-500" />
            <h1 className="text-lg font-bold">Badges</h1>
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

      {/* Badges Description */}
      <div className="p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <h3 className="font-medium mb-2">About Badges</h3>
          <p className="text-sm text-slate-400">
            Badges represent your status and achievements in the Traderate
            community. They are displayed on your profile and next to your name
            when you create signals or participate in discussions.
          </p>
        </div>
      </div>

      {/* Badges List */}
      <div className="p-4 space-y-4">
        {badges.map((badge: Badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
};

type BadgeCardProps = {
  badge: Badge;
};

const BadgeCard = ({ badge }: BadgeCardProps) => {
  // Get color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "validator":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-500",
          border: "border-blue-500/30",
        };
      case "invite":
        return {
          bg: "bg-purple-500/10",
          text: "text-purple-500",
          border: "border-purple-500/30",
        };
      case "contributor":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-500",
          border: "border-emerald-500/30",
        };
      default:
        return {
          bg: "bg-pink-500/10",
          text: "text-pink-500",
          border: "border-pink-500/30",
        };
    }
  };

  const colors = getCategoryColor(badge.category);

  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border ${
        badge.earned ? colors.border : "border-slate-700/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full ${
            badge.earned ? colors.bg : "bg-slate-700/30"
          } flex items-center justify-center`}
        >
          {getIconComponent(
            badge.icon,
            `w-6 h-6 ${badge.earned ? colors.text : "text-slate-500"}`
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{badge.name}</h3>
            {badge.earned ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                Earned
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/30 text-slate-400">
                Locked
              </span>
            )}
          </div>

          <p className="text-sm text-slate-400 mt-1">{badge.description}</p>

          <div className="text-xs text-slate-500 mt-2">
            Requirement: {badge.requirement}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgesPanel;

const badgesSample: Badge[] = [
  {
    id: "validator",
    name: "Validator",
    description: "Top 10% of users by reputation",
    category: "validator",
    requirement: "Top 10%",
    earned: false,
    type: BADGES.VALIDATOR,
    icon: "shield",
  },
  {
    id: "invite_master",
    name: "Invite Master",
    description: "Top 100 inviters",
    category: "invite",
    requirement: "Top 100",
    type: BADGES.INVITE_MASTER,
    earned: false,
    icon: "users",
  },
  {
    id: "contributor",
    name: "Contributor",
    description: "Top 40% of voters",
    category: "contributor",
    requirement: "Top 40%",
    type: BADGES.CONTRIBUTOR,
    earned: false,
    icon: "thumbs-up",
  },
];
