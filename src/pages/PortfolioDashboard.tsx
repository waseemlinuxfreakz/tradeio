import React from "react";
import {
  TrendingUp,
  TrendingDown,

} from "lucide-react";

import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import NavigationBar from "../components/NavigationBar";
import ReputationPointsInfo from "../components/profile/ReputationPointsInfo";
import { getDecodedUserToken, StatsFormatValues } from "../utils";
import usePortfolioDashboard from "../hooks/usePortfolioDashboard";
import PortfolioTradesPage from "./PortfolioTradesPage";


const PortfolioDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = React.useState("1W");
  const user = getDecodedUserToken();
  const {
    portfolioOverviewData,
    portfolioOverviewLoading,
    portfolioOverviewError,
  } = usePortfolioDashboard(user!.userId, timeRange);

  const portfolioStats = {
    totalValue: portfolioOverviewData?.data?.portfolioStats?.totalValue || 0,
    todayChange:
      Number(portfolioOverviewData?.data?.portfolioStats?.todayChange) || 0,
    todayChangePercent:
      portfolioOverviewData?.data?.portfolioStats?.todayChangePercent || 0,
    totalProfit: portfolioOverviewData?.data?.portfolioStats?.totalProfit || 0,
    totalProfitPercent:
      portfolioOverviewData?.data?.portfolioStats?.totalProfitPercent || 0,
  };

  const recentTransactions =
    portfolioOverviewData?.data?.recentTransactions || 0;

  return (
    <PageTransition>

      <div className="bg-slate-900 min-h-screen text-white pb-20">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">Portfolio</h1>
              <p className="text-slate-400 text-sm">Welcome back</p>
            </div>
          </div>

          {/* Portfolio Value */}
          <div className="mt-4">
            <div className="text-sm text-slate-400">Total Portfolio Value</div>
            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-3xl font-bold">
                ${StatsFormatValues(Number(portfolioStats.totalValue))}
              </div>
              <div
                className={`flex items-center ${portfolioStats.todayChange >= 0
                    ? "text-emerald-500"
                    : "text-rose-500"
                  }`}
              >
                {portfolioStats.todayChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {StatsFormatValues(Number(portfolioStats.todayChange))}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reputation Points */}
        <div className="p-4">
          <ReputationPointsInfo />
        </div>

        {/* Recent Achievements */}
        {/* {achievements.length > 0 && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-pink-500" />
                Recent Achievements
              </h2>
              <button
                onClick={() => navigate("/achievements")}
                className="text-sm text-slate-400 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30 bg-emerald-500/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Award className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-slate-400">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-emerald-500 font-medium">
                      +{achievement.reward.toLocaleString()} TRT
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/achievements")}
              className="w-full mt-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-sm"
            >
              View All Achievements
            </button>
          </div>
        )} */}

        {/* Active Trades */}

        <div className="activeTrade">
          <PortfolioTradesPage />
        </div>

        {/* <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Active Trades</h2>
            <button
              onClick={() => navigate("/portfolio/trades")}
              className="text-sm text-slate-400 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {latestTradesLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : latestTradesError ? (
            <div className="text-center py-6 text-rose-500 text-sm">
              Failed to load latest trades.
            </div>
          ) : latestTradesData && latestTradesData?.data?.trades?.length > 0 ? (
            <div className="space-y-3">
              {latestTradesData.data.trades.map((trade) => (
                <div
                  key={trade.tradeId}
                  onClick={() => navigate(`/trade/${trade.tradeId}`)}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 cursor-pointer hover:bg-slate-700/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{trade.details?.pair}</div>
                      <div className="text-sm text-slate-400">
                        {trade.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">
                        {trade.executedAt}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-sm">
              No active trades found.
            </div>
          )}
        </div> */}

        {/* Chart Section */}
        {portfolioOverviewLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="w-12 h-12 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : portfolioOverviewError || !portfolioOverviewData?.success ? (
          <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
            <p>Failed to load portfolio data.</p>
          </div>
        ) : (
          <>
            {/* Performance Section */}
            {/* <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Performance</h2>
                <div className="flex gap-2">
                  {["1D", "1W", "1M", "1Y", "All"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        timeRange === range
                          ? "bg-gradient-to-r from-pink-500 to-purple-600"
                          : "bg-slate-800/50 text-slate-400"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                {performanceData && performanceData?.length ? (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient
                            id="colorValue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#ec4899"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="#ec4899"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(148, 163, 184, 0.1)"
                        />
                        <XAxis dataKey="date" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#ec4899"
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm text-center py-6">
                    No performance data available.
                  </p>
                )}
              </div>
            </div> */}

            {/* Distribution */}
            {/* <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Distribution</h2>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                {portfolioDistribution && portfolioDistribution?.length ? (
                  <div className="flex">
                    <div className="w-1/2">
                      <RechartsPieChart width={150} height={150}>
                        <Pie
                          data={portfolioDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {portfolioDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPieChart>
                    </div>
                    <div className="w-1/2">
                      {portfolioDistribution.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-slate-400">
                            {item.name}
                          </span>
                          <span className="text-sm font-medium ml-auto">
                            {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm text-center py-6">
                    No portfolio distribution data.
                  </p>
                )}
              </div>
            </div> */}

            {/* Recent Transactions */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Recent Transactions</h2>
                {/* <button className="text-sm text-slate-400 flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button> */}
              </div>

              {recentTransactions && recentTransactions?.length ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${transaction.type === "Buy"
                                ? "bg-emerald-500/10"
                                : "bg-rose-500/10"
                              }`}
                          >
                            {transaction.outcome === "profit" ? (
                              <TrendingUp className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-rose-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {transaction.asset}
                            </div>
                            <div className="text-sm text-slate-400">
                              {transaction.amount}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{StatsFormatValues(transaction.value)}</div>
                          <div className="text-sm text-slate-400">
                            {transaction.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm text-center py-6">
                  No recent transactions found.
                </p>
              )}
            </div>
          </>
        )}

        <NavigationBar onQuickAction={() => navigate("/create-signal")} />
      </div>

    </PageTransition>
  );
};

export default PortfolioDashboard;
