import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Star,
	Bell,
	Settings,
	Users,
	Signal,
	TrendingUp,
  ChevronsLeftRight,
	Award,
  Trophy,
	Shield,
	ChevronRight,
	User,
  Gift,
  Clock,
  Download,
  CheckCircle,
  ExternalLink,
  Copy,
  ArrowUpRight,
  Target,
  Users as CommunityIcon
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import NavigationBar from "../components/NavigationBar";
import ReputationPointsInfo from "../components/profile/ReputationPointsInfo";
import { getUserBadges } from "../lib/reputationSystem";
import { getDecodedUserToken } from "../utils";
import useRecentSignals from "../hooks/useRecentSignals";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

const MyPersonalPage = () => {
	const navigate = useNavigate();
  const [copiedAddress, setCopiedAddress] = useState(false);
	const [showPointsInfo, setShowPointsInfo] = useState(false);
	const [imageError, setImageError] = useState(false);
	const user = getDecodedUserToken();
	useEffect(() => {
		setImageError(false);
	}, [user?.image]);
	const badges = getUserBadges()?.filter((badge) => badge.earned) ?? [];
	const {
		recentSignalData,
		recentSignalLoading,
		recentSignalError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useRecentSignals(user!.userId);
	const loadMoreRef = useIntersectionObserver(
		([entry], observer) => {
			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && user) {
				fetchNextPage();
			}
		},
		{ threshold: 0.1 }
	);
	const stats = {
		signals: {
			total: 156,
			success: "92%",
			profit: "+234%",
		},
		followers: {
			total: "23.5K",
			active: "12.3K",
			growth: "+15%",
		},
	};

    const airdropStats = {
      totalValue: '500,000 TRT',
      participants: '12,345',
      timeLeft: '14d 6h 23m',
      yourShare: '2,500 TRT'
    };
  
    const tasks = [
      {
        id: 1,
        title: 'Connect Wallet',
        description: 'Connect your wallet to participate',
        reward: '100 TRT',
        completed: true
      },
      {
        id: 2,
        title: 'Join Telegram',
        description: 'Join our Telegram community',
        reward: '200 TRT',
        completed: false,
        link: 'https://t.me/traderate'
      },
      {
        id: 3,
        title: 'Follow Twitter',
        description: 'Follow and retweet our pinned post',
        reward: '300 TRT',
        completed: false,
        link: 'https://twitter.com/traderate'
      },
      {
        id: 4,
        title: 'Share Signal',
        description: 'Share at least one trading signal',
        reward: '400 TRT',
        completed: false
      }
    ];
  
    const achievements = [
      {
        id: 1,
        title: 'Early Bird',
        description: 'Among the first 1000 users to join',
        reward: '500 TRT',
        icon: Star,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        completed: true
      },
      {
        id: 2,
        title: 'Signal Master',
        description: 'Create 10 successful trading signals',
        reward: '1000 TRT',
        icon: Target,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        completed: false,
        progress: 7
      },
      {
        id: 3,
        title: 'Community Leader',
        description: 'Reach 1000 followers',
        reward: '2000 TRT',
        icon: CommunityIcon,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        completed: false,
        progress: 456
      },
      {
        id: 4,
        title: 'Trading Expert',
        description: 'Maintain 90% success rate for 30 days',
        reward: '5000 TRT',
        icon: TrendingUp,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        completed: false,
        progress: 85
      }
    ];
  
    const handleCopyAddress = () => {
      navigator.clipboard.writeText('0x1234...5678');
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    };

    
  const [activeTab, setActiveTab] = useState(0);
  
	if (!user) return null;
	return (
		<PageTransition>
			<div className="min-h-screen bg-slate-900 text-white pb-20">
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
							<h1 className="text-lg font-bold">My Profile</h1>
						</div>
						{/* <div className="flex items-center gap-3">
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
						</div> */}
					</div>
				</div>

				{/* Profile Header */}
				<div className="p-6">
					<div className="flex items-center gap-4">
						<div className="relative">
							<div className="w-20 h-20 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5 flex items-center justify-center">
								{user?.image && !imageError ? (
									<img
										src={user.image}
										alt="User"
										referrerPolicy="no-referrer"
										className="w-full h-full rounded-full object-cover"
										onError={() => {
											console.error("❌ Image failed to load:", user.image);
											setImageError(true);
										}}
									/>
								) : (
									<User className="w-10 h-10 text-white" />
								)}
							</div>
							<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
								<Star className="w-4 h-4 text-white" />
							</div>
						</div>
						<div>
							<h2 className="text-xl font-bold">{user.username || "User"}</h2>
							<div className="flex items-center gap-2 mt-1">
								{badges.length > 0 ? (
									badges.slice(0, 2).map((badge) => (
										<div
											key={badge.id}
											className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-flex items-center gap-1"
										>
											<Shield className="w-3 h-3" />
											{badge.name}
										</div>
									))
								) : (
									<div className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-block">
										{user.user_type}
									</div>
								)}

								{badges.length > 2 && (
									<div className="text-xs text-slate-400">
										+{badges.length - 2} more
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Reputation Points */}
					<div className="mt-4">
						<ReputationPointsInfo compact={true} />
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-3 gap-3 mt-6">
						<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
							<div className="flex items-center gap-2 mb-1">
								<Signal className="w-4 h-4 text-blue-500" />
								<span className="text-xs text-slate-400">Signals</span>
							</div>
							<div className="text-lg font-bold">{stats.signals.total}</div>
							<div className="text-xs text-emerald-400">
								{stats.signals.success} success
							</div>
						</div>

						{/* <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
							<div className="flex items-center gap-2 mb-1">
								<Users className="w-4 h-4 text-purple-500" />
								<span className="text-xs text-slate-400">Followers</span>
							</div>
							<div className="text-lg font-bold">{stats.followers.total}</div>
							<div className="text-xs text-emerald-400">
								{stats.followers.growth} this month
							</div>
						</div> */}

						<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
							<div className="flex items-center gap-2 mb-1">
								<TrendingUp className="w-4 h-4 text-emerald-500" />
								<span className="text-xs text-slate-400">Profit</span>
							</div>
							<div className="text-lg font-bold text-emerald-500">
								{stats.signals.profit}
							</div>
							<div className="text-xs text-emerald-400">All time</div>
						</div>
					</div>
				</div>

				{/* Achievements & Badges */}
				<div className="px-4 mb-4">
					<div className="grid grid-cols-2 gap-3">
						<button
							onClick={() => navigate("/achievements")}
							className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 flex items-center justify-between hover:bg-slate-800/70 transition-colors"
						>
							<div className="flex items-center gap-3">
								<Award className="w-5 h-5 text-pink-500" />
								<span className="font-medium">Achievements</span>
							</div>
							<ChevronRight className="w-5 h-5 text-slate-400" />
						</button>

						<button
							onClick={() => navigate("/badges")}
							className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 flex items-center justify-between hover:bg-slate-800/70 transition-colors"
						>
							<div className="flex items-center gap-3">
								<Shield className="w-5 h-5 text-purple-500" />
								<span className="font-medium">Badges</span>
							</div>
							<ChevronRight className="w-5 h-5 text-slate-400" />
						</button>
					</div>
				</div>

        <div className="tabContainer">
          <div className="tabBtns">
            <button
              className={`tabButton flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-slate-400 bg-pink-500 text-white bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 ${activeTab === 0 ? 'active bg-pink-500' : ''}`}
              onClick={() => setActiveTab(0)}
            >
              {/* <Gift className=""/>  */}Rewards
            </button>
            <button
              className={`tabButton flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-slate-400 bg-pink-500 text-white bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 ${activeTab === 1 ? 'active bg-pink-500' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              {/* <ChevronsLeftRight className=""/>  */}Tasks
            </button>
            <button
              className={`tabButton flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-slate-400 bg-pink-500 text-white bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 ${activeTab === 2 ? 'active bg-pink-500' : ''}`}
              onClick={() => setActiveTab(2)}
            >
              {/* <Trophy className=""/>  */}Achievements
            </button>
          </div>
          
          <div className="tabContent">
            <div className={`tabItem ${activeTab === 0 ? 'active' : ''}`}>
               {/* Reward Section */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20" />
                <div className="relative p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                        <Gift className="w-6 h-6 text-pink-500" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Rewards Center</h2>
                      <p className="text-slate-400">Unlock rewards as you progress</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 fitWidth">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Gift className="w-4 h-4 text-pink-500" />
                        <span className="text-xs text-slate-400">Reward Pool</span>
                      </div>
                      <div className="text-md font-bold">{airdropStats.totalValue}</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-xs text-slate-400">Active Members</span>
                      </div>
                      <div className="text-md font-bold">{airdropStats.participants}</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-slate-400">Your Multiplier</span>
                      </div>
                      <div className="text-md font-bold">{airdropStats.timeLeft}</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Download className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-slate-400">Points Earned</span>
                      </div>
                      <div className="text-md font-bold">{airdropStats.yourShare}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="p-4">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">Your Wallet Address</div>
                    <button
                      onClick={handleCopyAddress}
                      className={`text-sm ${copiedAddress ? 'text-emerald-500' : 'text-pink-500'}`}
                    >
                      {copiedAddress ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="font-mono mt-1">0x1234...5678</div>
                </div>
              </div>
            </div>
            
            <div className={`tabItem ${activeTab === 1 ? 'active' : ''}`}>
                {/* Tasks */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4">Complete Tasks</h3>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`group bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                        task.completed 
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-slate-700/50 hover:border-pink-500/30 hover:bg-pink-500/5'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{task.title}</span>
                            {task.completed && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                        </div>
                        {task.link ? (
                          <a 
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                          >
                            <ExternalLink className="w-5 h-5 text-slate-400" />
                          </a>
                        ) : (
                          <div className={`flex items-center gap-2 ${
                            task.completed ? 'text-emerald-500' : 'text-pink-500'
                          }`}>
                            <span className="text-sm font-medium">{task.reward}</span>
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                              task.completed
                                ? 'bg-emerald-500 w-full'
                                : 'bg-gradient-to-r from-pink-500 to-purple-600 w-0 group-hover:w-full'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`tabItem ${activeTab === 2 ? 'active' : ''}`}>
              {/* Achievements */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4">Achievements</h3>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border ${
                        achievement.completed 
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${achievement.bgColor}`}>
                          <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{achievement.title}</h4>
                            {achievement.completed && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{achievement.description}</p>
                          {achievement.progress !== undefined && !achievement.completed && (
                            <div className="mt-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">Progress</span>
                                <span className="text-slate-400">{achievement.progress}%</span>
                              </div>
                              <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all"
                                  style={{ width: `${achievement.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            achievement.completed ? 'text-emerald-500' : 'text-pink-500'
                          }`}>
                            {achievement.reward}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> 

          </div>
        </div>


				{/* Recent Signals */}
				<div className="p-4">
					<h3 className="text-lg font-bold mb-4">Recent Signals</h3>
					<div className="space-y-3">
						{recentSignalLoading ? (
							<div className="flex justify-center py-6">
								<div className="w-8 h-8 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
							</div>
						) : recentSignalError ? (
							<div className="text-sm text-red-400">
								Failed to load recent signals.
							</div>
						) : (
							<div className="space-y-3">
								{(() => {
									const signals =
										recentSignalData?.pages?.flatMap(
											(response) => response.data?.data ?? []
										) ?? [];

									return signals.length > 0 ? (
										signals.map((signal: any) => (
											<div
												key={signal.id}
												className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
											>
												<div className="flex justify-between items-start">
													<div>
														<div className="font-medium">{signal.pair}</div>
														<div className="text-sm text-slate-400">
															{signal.time}
														</div>
													</div>
													<div className="text-right">
														<div className="text-sm px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 inline-block">
															{signal.type}
														</div>
														<div className="text-emerald-500 font-medium mt-1">
															{signal.profit}
														</div>
													</div>
												</div>
											</div>
										))
									) : (
										<div className="text-sm text-slate-400 text-center">
											No recent signals available.
										</div>
									);
								})()}
							</div>
						)}
					</div>
					{hasNextPage && (
						<div
							ref={loadMoreRef}
							className="flex justify-center items-center py-4"
						>
							{isFetchingNextPage && (
								<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
									<div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
								</div>
							)}
						</div>
					)}
				</div>


				<NavigationBar onQuickAction={() => navigate("/create-signal")} />
			</div>
		</PageTransition>
	);
};

export default MyPersonalPage;