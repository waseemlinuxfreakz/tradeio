import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Settings,
  Users,
  BarChart2,
  Sliders,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Percent,
  Search,
  Filter,
  Download,
} from "lucide-react";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import PageTransition from "../components/PageTransition";
import NavigationBar from "../components/NavigationBar";
import { Spin } from "antd";
import AdminConfigPanel from "../components/dashboard/AdminConfigPanel";
import { useVotingSystem, initializeVotingSystem } from "../lib/votingSystem";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminSignals,
  getAdminUsers,
  getConfigurtions,
} from "../apis/apiEndpoints";
import FullPageLoader from "../components/Loader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import VoteActivity from "../components/dashboard/VoteActivity";
import UsersData from "../components/dashboard/Users";
import { getDecodedUserToken } from "../utils";
import { Else, If, Then } from "react-if";
import Signals from "../components/dashboard/Signals";
import DashboardSettings from "../components/dashboard/Settings";
import { Signal } from "../types/signal";
import Overview from "../components/dashboard/Overview";

dayjs.extend(relativeTime);
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
        <p className="text-slate-300 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const user = getDecodedUserToken();
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  // const [signalData, setSignalsData] = useState([]);
  const [signalData, setSignalsData] = useState<Signal[]>([]);
  const [currentPageSignal, setCurrentPageSignal] = useState(1);
  const [currentPageUser, setCurrentPageUser] = useState(1);

  const { data: usersData, isLoading: usersDataLoading } = useQuery({
    queryKey: ["admin-users", currentPageUser],
    queryFn: () => getAdminUsers(currentPageUser),
  });
  const { data: configurationData, isLoading: configurationLoading } = useQuery(
    {
      queryKey: ["configurations"],
      queryFn: () => getConfigurtions(),
    }
  );
  const configData = configurationData?.data?.data;


  const { data: signalsData, isLoading: signalsDataLoading } = useQuery({
    queryKey: ["admin-signals", currentPageSignal],
    queryFn: () => getAdminSignals(currentPageSignal),
  });
  const { config, signals } = useVotingSystem();

  // Initialize voting system if needed

  React.useEffect(() => {
    initializeVotingSystem();
  }, []);

  // Generate analytics data
  const generateAnalytics = () => {
    // Count signals by stage
    const signalsByStage = {
      validator: 0,
      community: 0,
      executable: 0,
      rejected: 0,
    };

    signals.forEach((signal) => {
      signalsByStage[signal.stage]++;
    });

    // Generate vote data over time
    const voteData = [
      { date: "Mon", validatorVotes: 12, communityVotes: 45 },
      { date: "Tue", validatorVotes: 19, communityVotes: 63 },
      { date: "Wed", validatorVotes: 15, communityVotes: 58 },
      { date: "Thu", validatorVotes: 22, communityVotes: 75 },
      { date: "Fri", validatorVotes: 28, communityVotes: 92 },
      { date: "Sat", validatorVotes: 26, communityVotes: 84 },
      { date: "Sun", validatorVotes: 30, communityVotes: 105 },
    ];

    // Generate success rate data
    const successRateData = [
      { name: "Successful", value: 78, color: "#10b981" },
      { name: "Failed", value: 22, color: "#ef4444" },
    ];

    return {
      signalsByStage,
      voteData,
      successRateData,
      totalUsers: 1250,
      activeUsers: 845,
      totalSignals: signals.size,
      validatorCount: 125,
    };
  };

  const analytics = generateAnalytics();
  const validators = usersData?.data?.validatorsCount || 0;
  useEffect(() => {
    if (signalsData?.data?.signals) {
      setSignalsData(signalsData?.data?.signals);
    }
  }, [usersData, signalsData]);

  const completedSignals = signalsData?.data?.completedCount || 0;

  const pendingSignals = signalsData?.data?.pendingCount || 0;

  const expiredSignals = signalsData?.data?.expiredCount || 0;
  const successfulSignals = signalsData?.data?.successfullSignals || 0;
  const totalSignals = signalsData?.data?.total || 0;

  const successfulSignalPercentage =
    completedSignals > 0
      ? ((successfulSignals / totalSignals) * 100).toFixed(2)
      : "0.00";

  useEffect(() => {
    if (user?.user_type) {
      if (user?.user_type !== "ADMIN" && location.pathname.includes("/admin")) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user]);

  if (configurationLoading) {
    return <FullPageLoader loading={configurationLoading} />;
  }

  return (
    <PageTransition>
      <If condition={user?.user_type === "ADMIN"}>
        <Then>
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
                  <h1 className="text-lg font-bold">Admin Dashboard</h1>
                </div>
                {/* <button
                  onClick={() => setShowConfigPanel(true)}
                  className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button> */}
              </div>

              {/* Tabs */}
              <div className="px-4 pb-4">
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "overview"
                      ? "bg-pink-500 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                      }`}
                  >
                    <BarChart2 className="w-4 h-4" />
                    Overview
                  </button>

                  <button
                    onClick={() => setActiveTab("users")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "users"
                      ? "bg-pink-500 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                      }`}
                  >
                    <Users className="w-4 h-4" />
                    Users
                  </button>

                  <button
                    onClick={() => setActiveTab("signals")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "signals"
                      ? "bg-pink-500 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                      }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Signals
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "settings"
                      ? "bg-pink-500 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                      }`}
                  >
                    <Sliders className="w-4 h-4" />
                    Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-4">
              {activeTab === "overview" && (
                <Overview
                  signalsData={signalsData ?? { data: {} }}
                  usersData={usersData ?? { data: {} }}
                  config={config}
                  analytics={analytics}
                />
                // <div className="space-y-6">
                //   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                //     <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                //       <div className="flex items-center gap-2 mb-1">
                //         <Users className="w-4 h-4 text-blue-500" />
                //         <span className="text-xs text-slate-400">
                //           Total Users
                //         </span>
                //       </div>
                //       <div className="text-xl font-bold">
                //         {usersData?.data?.total}
                //       </div>
                //       <div className="text-xs text-slate-400 mt-1">
                //         {usersData?.data?.total || 0} active
                //       </div>
                //     </div>

                //     <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                //       <div className="flex items-center gap-2 mb-1">
                //         <TrendingUp className="w-4 h-4 text-emerald-500" />
                //         <span className="text-xs text-slate-400">
                //           Total Signals
                //         </span>
                //       </div>
                //       <div className="text-xl font-bold">
                //         {signalsData?.data?.total || 0}
                //       </div>
                //       <div className="text-xs text-emerald-400 mt-1">
                //         {completedSignals}
                //         &nbsp;completed
                //       </div>
                //     </div>

                //     <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                //       <div className="flex items-center gap-2 mb-1">
                //         <CheckCircle className="w-4 h-4 text-purple-500" />
                //         <span className="text-xs text-slate-400">
                //           Success Rate
                //         </span>
                //       </div>
                //       <div className="text-xl font-bold text-purple-500">
                //         {completedSignals > 0
                //           ? `${(
                //             (successfulSignals / completedSignals) *
                //             100
                //           ).toFixed(2)}%`
                //           : "0.00%"}
                //       </div>
                //       <div className="text-xs text-purple-400 mt-1">
                //         Last 30 days
                //       </div>
                //     </div>

                //     <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                //       <div className="flex items-center gap-2 mb-1">
                //         <Percent className="w-4 h-4 text-pink-500" />
                //         <span className="text-xs text-slate-400">
                //           Validators
                //         </span>
                //       </div>
                //       <div className="text-xl font-bold text-pink-500">
                //         {validators}
                //       </div>
                //       <div className="text-xs text-pink-400 mt-1">
                //         Top {config.validatorPercentage}%
                //       </div>
                //     </div>
                //   </div>

                //   <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                //     <h3 className="text-lg font-bold mb-4">Signals by Stage</h3>
                //     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                //       <div className="bg-slate-700/30 rounded-lg p-3">
                //         <div className="flex items-center gap-2 mb-1">
                //           <Clock className="w-4 h-4 text-blue-500" />
                //           <span className="text-xs text-slate-400">
                //             Pending Stage
                //           </span>
                //         </div>
                //         <div className="text-lg font-bold text-blue-500">
                //           {pendingSignals}
                //         </div>
                //       </div>

                //       <div className="bg-slate-700/30 rounded-lg p-3">
                //         <div className="flex items-center gap-2 mb-1">
                //           <CheckCircle className="w-4 h-4 text-emerald-500" />
                //           <span className="text-xs text-slate-400">
                //             Completed Stage
                //           </span>
                //         </div>
                //         <div className="text-lg font-bold text-emerald-500">
                //           {completedSignals}
                //         </div>
                //       </div>

                //       <div className="bg-slate-700/30 rounded-lg p-3">
                //         <div className="flex items-center gap-2 mb-1">
                //           <XCircle className="w-4 h-4 text-rose-500" />
                //           <span className="text-xs text-slate-400">
                //             Expired Stage
                //           </span>
                //         </div>
                //         <div className="text-lg font-bold text-rose-500">
                //           {expiredSignals}
                //         </div>
                //       </div>
                //     </div>
                //   </div>

                //   <VoteActivity
                //     CustomTooltip={CustomTooltip}
                //     analytics={analytics}
                //   />
                //   <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                //     <h3 className="text-lg font-bold mb-4">
                //       Signal Success Rate
                //     </h3>
                //     <div className="flex">
                //       <div className="w-1/2">
                //         <div className="h-48">
                //           <ResponsiveContainer width="100%" height="100%">
                //             <RechartsPieChart>
                //               <Pie
                //                 data={analytics.successRateData}
                //                 cx="50%"
                //                 cy="50%"
                //                 innerRadius={60}
                //                 outerRadius={80}
                //                 paddingAngle={5}
                //                 dataKey="value"
                //               >
                //                 {analytics.successRateData.map(
                //                   (entry, index) => (
                //                     <Cell
                //                       key={`cell-${index}`}
                //                       fill={entry.color}
                //                     />
                //                   )
                //                 )}
                //               </Pie>
                //               <Tooltip content={<CustomTooltip />} />
                //             </RechartsPieChart>
                //           </ResponsiveContainer>
                //         </div>
                //       </div>
                //       <div className="w-1/2 flex flex-col justify-center">
                //         <div className="space-y-4">
                //           <div className="flex items-center gap-2">
                //             <div className="w-3 h-3 rounded-full bg-emerald-500" />
                //             <span className="text-sm">
                //               Success: {successfulSignalPercentage}%
                //             </span>
                //           </div>
                //           <div className="flex items-center gap-2">
                //             <div className="w-3 h-3 rounded-full bg-rose-500" />
                //             <span className="text-sm">
                //               Failed:{" "}
                //               {(
                //                 100 - Number(successfulSignalPercentage)
                //               ).toFixed(2)}
                //             </span>
                //           </div>
                //         </div>
                //       </div>
                //     </div>
                //   </div>
                // </div>
              )}

              {activeTab === "users" && (
                <UsersData
                  usersData={usersData ?? { data: {} }}
                  currentPageUser={currentPageUser}
                  setCurrentPageUser={setCurrentPageUser}
                  usersDataLoading={usersDataLoading}
                  validators={validators}
                />
              )}

              {activeTab === "signals" && (
                <Signals
                  signalsData={signalsData}
                  setSignalsData={setSignalsData}
                  signalData={signalData}
                  signalsDataLoading={signalsDataLoading}
                  currentPageSignal={currentPageSignal}
                  setCurrentPageSignal={setCurrentPageSignal}
                />
              )}

              {activeTab === "settings" && (
                <DashboardSettings
                  configuration={configData}
                  setShowConfigPanel={setShowConfigPanel}
                />
                // <div className="space-y-6">
                //   {/* Current Configuration */}
                //   <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                //     <h3 className="text-lg font-bold mb-4">
                //       Current Configuration
                //     </h3>
                //     <div className="space-y-4">
                //       <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                //         <div>
                //           <div className="font-medium">Validator Threshold</div>
                //           <div className="text-sm text-slate-400">
                //             % of validators needed to clear Stage 1
                //           </div>
                //         </div>
                //         <div className="text-lg font-bold text-pink-500">
                //           {configuration.percValidatorsStage1}%
                //         </div>
                //       </div>

                //       <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                //         <div>
                //           <div className="font-medium">Default balance</div>
                //           <div className="text-sm text-slate-400">
                //             % Default balance for all new users
                //           </div>
                //         </div>
                //         <div className="text-lg font-bold text-pink-500">
                //           {configuration.defaultBalanceForAllNewUsers}%
                //         </div>
                //       </div>

                //       <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                //         <div>
                //           <div className="font-medium">Referral Reward</div>
                //           <div className="text-sm text-slate-400">
                //             Referral reward per invitation
                //           </div>
                //         </div>
                //         <div className="text-lg font-bold text-pink-500">
                //           {configuration.rrPerInvitation}%
                //         </div>
                //       </div>

                //       <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                //         <div>
                //           <div className="font-medium">Airdrop End Time</div>
                //           <div className="text-sm text-slate-400">
                //             End Time for Airdrop
                //           </div>
                //         </div>
                //         <div className="text-lg font-bold text-pink-500">
                //           {configuration.endTimeForAirdrop} days
                //         </div>
                //       </div>
                //     </div>
                //     <button
                //       onClick={() => setShowConfigPanel(true)}
                //       className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                //     >
                //       <Settings className="w-5 h-5" />
                //       Update Configuration
                //     </button>
                //   </div>
                // </div>
              )}
            </div>

            {/* Admin Config Panel */}
            <AdminConfigPanel
              isOpen={showConfigPanel}
              onClose={() => setShowConfigPanel(false)}
              configuration={configData}
            />

            <NavigationBar onQuickAction={() => navigate("/create-signal")} />
          </div>
        </Then>
        <Else>
          <FullPageLoader loading={true} />
        </Else>
      </If>
    </PageTransition>
  );
};

export default AdminDashboardPage;
