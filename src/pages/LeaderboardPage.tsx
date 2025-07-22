import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Trophy, ArrowLeft, Search } from "lucide-react";
import PageTransition from "../components/PageTransition";
import NavigationBar from "../components/NavigationBar";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "../apis/apiEndpoints";
import { If, Then, Else } from "react-if";
import { Spin } from "antd";
import FullPageLoader from "../components/Loader";
type Leaderboard = {
  name: string;
  successRate: number;
  userType: string;
  image?: string;
  successfulRecords?: number

};
const dummyProfileURL =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png";
const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("24h");
  const [activeTab, setActiveTab] = useState('swipers');
  const [leaderboardRecords, setLeaderBoardRecords] = useState<Leaderboard[]>(
    []
  );
  const [visibleCount, setVisibleCount] = useState(10);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["leaderboard", timeframe, activeTab],
    queryFn: () => getLeaderboard(timeframe, activeTab),
    select: ({ data }) => data.data,
  });
  const totalSuccessfulRecords = data && data?.reduce(
    (acc: number, curr: { successfulRecords: string }) =>
      acc + (Number(curr.successfulRecords) || 0),
    0
  );

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    if (!data) {
      setLeaderBoardRecords([]);
      return;
    }
    if (!searchValue) {
      setLeaderBoardRecords(data);
      return;
    }
    const filtered = data.filter((user: Leaderboard) =>
      user.name.toLowerCase().includes(searchValue)
    );
    setLeaderBoardRecords(filtered);
  };
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const isBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 100;

    if (isBottom && visibleCount < leaderboardRecords.length) {
      setVisibleCount((prev) => prev + 10);
    }
  };
  useEffect(() => {
    if (data) setLeaderBoardRecords(data);
  }, [data]);
  if (leaderboardLoading) {
    <FullPageLoader loading={leaderboardLoading} />
  }
  return (
    <Spin spinning={leaderboardLoading}>
      <PageTransition>
        <div className="min-h-screen bg-slate-900 text-white pb-20">
          <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h1 className="text-lg font-bold">Leaderboard</h1>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    onChange={handleUserSearch}
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                </div>
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {[
                  { id: 'swipers', label: 'Swipers' },
                  { id: 'analysts', label: 'Analysts' },
                  { id: 'traders', label: 'Traders' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-purple-500/30'
                      : 'bg-slate-800/50 hover:bg-slate-700/50'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {["24h", "7d", "30d", "All"].map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setTimeframe(time);
                  }}
                  className={`px-4 py-1 rounded-full text-xs transition-all ${timeframe === time
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:bg-slate-800"
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {leaderboardRecords.length === 0 && (
            <div className="text-white text-center">
              No user found for this category
            </div>
          )}

          {leaderboardRecords.length > 0 && (
            <>
              <div className="px-4 mb-6">
                <div className="flex justify-center items-end gap-4">
                  <If condition={leaderboardRecords.length > 1}>
                    <Then>
                      <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                          <img
                            src={
                              leaderboardRecords && leaderboardRecords[1]?.image
                                ? leaderboardRecords[1]?.image
                                : dummyProfileURL
                            }
                            alt={dummyProfileURL}
                            referrerPolicy="no-referrer"
                            className="w-full h-full rounded-full object-cover border-2 border-slate-700"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-xs font-bold">
                            2
                          </div>
                        </div>
                        <div className="h-24 w-20 mt-2 bg-slate-800/50 rounded-t-lg flex items-end justify-center">
                          <div className="text-slate-400 text-sm mb-2">

                            {activeTab === 'swipers' ? (
                              <>
                                +{leaderboardRecords[1]?.successRate && leaderboardRecords[1]?.successRate.toFixed(2)}%
                              </>
                            ) :
                              <>
                                +
                                {leaderboardRecords[1]?.successfulRecords
                                  ? (
                                    (leaderboardRecords[1].successfulRecords / totalSuccessfulRecords || 1) *
                                    100
                                  ).toFixed(2)
                                  : '0'}
                                %
                              </>
                            }
                          </div>
                        </div>
                      </div>
                    </Then>
                  </If>

                  {/* 1st Place */}
                  <div className="flex flex-col items-center -mt-4">
                    <Crown className="w-8 h-8 text-yellow-500 mb-2" />
                    <div className="relative w-20 h-20">
                      <img
                        src={
                          leaderboardRecords && leaderboardRecords[0]?.image
                            ? leaderboardRecords[0]?.image
                            : dummyProfileURL
                        }
                        alt={dummyProfileURL}
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full object-cover border-2 border-yellow-500"
                      />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                    </div>
                    <div className="h-32 w-24 mt-2 bg-slate-800/50 rounded-t-lg flex items-end justify-center">
                      <div className="text-yellow-500 text-sm mb-2">
                        {activeTab === 'swipers' ? (
                          <>
                            +{leaderboardRecords[0]?.successRate && leaderboardRecords[0]?.successRate.toFixed(2)}%
                          </>
                        ) :
                          <>
                            +
                            {leaderboardRecords[0]?.successfulRecords
                              ? (
                                (leaderboardRecords[0].successfulRecords / totalSuccessfulRecords || 1) *
                                100
                              ).toFixed(2)
                              : '0'}
                            %
                          </>
                        }
                      </div>
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <If condition={leaderboardRecords.length > 2}>
                    <Then>
                      <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                          <img
                            src={
                              leaderboardRecords && leaderboardRecords[2]?.image
                                ? leaderboardRecords[2]?.image
                                : dummyProfileURL
                            }
                            alt={dummyProfileURL}
                            referrerPolicy="no-referrer"
                            className="w-full h-full rounded-full object-cover border-2 border-slate-700"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-700 to-amber-800 rounded-full flex items-center justify-center text-xs font-bold">
                            3
                          </div>
                        </div>
                        <div className="h-20 w-20 mt-2 bg-slate-800/50 rounded-t-lg flex items-end justify-center">
                          <div className="text-slate-400 text-sm mb-2">

                            {activeTab === 'swipers' ? (
                              <>+{leaderboardRecords[2]?.successRate && leaderboardRecords[2]?.successRate.toFixed(2)}%</>
                            ) : <>
                              +
                              {leaderboardRecords[2]?.successfulRecords
                                ? (
                                  (leaderboardRecords[2].successfulRecords / totalSuccessfulRecords || 1) *
                                  100
                                ).toFixed(2)
                                : '0'}
                              %
                            </>
                            }
                          </div>
                        </div>
                      </div>
                    </Then>
                    I have a filter
                  </If>
                </div>
              </div>
              {activeTab === 'swipers' && (
                <>
                  <div className="px-4">
                    <div
                      className="space-y-3 overflow-y-auto max-h-[80vh] pr-2 hide-scrollbar"
                      ref={scrollRef}
                      onScroll={handleScroll}
                    >
                      {leaderboardRecords
                        .slice(0, visibleCount)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img
                                  src={item.image || dummyProfileURL}
                                  alt="Profile"
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div
                                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${index === 0
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                    : index === 1
                                      ? "bg-gradient-to-r from-slate-400 to-slate-500"
                                      : "bg-gradient-to-r from-amber-700 to-amber-800"
                                    }`}
                                >
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <span>{item.successRate && item.successRate.toFixed(2)} Success</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}

            </>
          )}
          {leaderboardRecords.length > 0 && (activeTab === 'analysts' || activeTab === 'traders') && (
            <>
              {leaderboardRecords
                .slice(0, visibleCount)
                .map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={item.image || dummyProfileURL}
                          alt="Profile"
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${index === 0
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                            : index === 1
                              ? "bg-gradient-to-r from-slate-400 to-slate-500"
                              : "bg-gradient-to-r from-amber-700 to-amber-800"
                            }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{item.successfulRecords} Successfull {activeTab === 'traders' ? 'trades' : 'signals'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}

          <NavigationBar onQuickAction={() => { }} />
        </div>
      </PageTransition>
    </Spin >
  );
};

export default LeaderboardPage;
