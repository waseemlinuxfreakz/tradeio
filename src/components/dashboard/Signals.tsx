import React from "react";
import { Users, XCircle, Clock, Search } from "lucide-react";
import { Spin } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SignalsProps } from "../../types/signal";
interface SignalItem {
  coin?: string;
  user?: {
    name?: string;
  };
  totalVotes: number;
  positiveVotes: number;
  id?: string | number;
  type: string;
  status: string;
  createdAt: string;
}
dayjs.extend(relativeTime);

const Signals = ({
  signalsData,
  setSignalsData,
  signalData,
  signalsDataLoading,
  currentPageSignal,
  setCurrentPageSignal,
}: SignalsProps) => {
  const completedSignals = signalsData?.data?.completedCount || 0;
  const totalSignalPages = signalsData?.data?.totalPages || 1;

  const pendingSignals = signalsData?.data?.pendingCount || 0;

  const expiredSignals = signalsData?.data?.expiredCount || 0;
  const handleSignalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    if (!signalsData?.data?.signals) return;
    if (!searchValue) {
      setSignalsData(signalsData.data.signals);
      return;
    }

    const filtered = signalsData?.data?.signals?.filter(
      (signal: SignalItem) => {
        return (
          (signal.coin ?? "")
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          (signal.user?.name ?? "")
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        );
      }
    );
    setSignalsData(filtered);
  };
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search signals by name or user "
            onChange={handleSignalSearch}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-slate-400">Pending</span>
          </div>
          <div className="text-xl font-bold text-blue-500">
            {pendingSignals}
          </div>
          <div className="text-xs text-blue-400 mt-1">Pending signals</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-slate-400">Completed</span>
          </div>
          <div className="text-xl font-bold text-purple-500">
            {completedSignals}
          </div>
          <div className="text-xs text-purple-400 mt-1">Completed signals</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-rose-500" />
            <span className="text-xs text-slate-400">Expired</span>
          </div>
          <div className="text-xl font-bold text-rose-500">
            {expiredSignals}
          </div>
          <div className="text-xs text-rose-400 mt-1">Expired signals</div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
        <h3 className="text-lg font-bold mb-4">Recent Signals</h3>
        <Spin spinning={signalsDataLoading}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Signal
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Creator
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Stage
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Votes
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Consensus
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {signalData.map((signal: SignalItem, i: number) => {
                  const positivePercent =
                    signal.totalVotes > 0
                      ? (
                          (signal.positiveVotes / signal.totalVotes) *
                          100
                        ).toFixed(2)
                      : "0.00";
                  return (
                    <tr
                      key={signal.id || i}
                      className="border-b border-slate-700/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div className="font-medium">{signal.coin}</div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              signal.type === "LONG"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {signal.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-700"></div>
                          <span>{signal.user?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            signal.status === "validator"
                              ? "bg-blue-500/10 text-blue-400"
                              : signal.status === "community"
                              ? "bg-purple-500/10 text-purple-400"
                              : signal.status === "executable"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {signal.status.charAt(0).toUpperCase() +
                            signal.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{signal.totalVotes}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className={
                            Number(positivePercent) > 70
                              ? "text-emerald-500"
                              : "text-slate-400"
                          }
                        >
                          {positivePercent}%
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-slate-400">
                          {dayjs(signal.createdAt).fromNow()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Spin>
      </div>
      <div className="flex justify-center items-center">
        <tfoot>
          <tr>
            <td colSpan={5}>
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50"
                  disabled={currentPageSignal === 1}
                  onClick={() => setCurrentPageSignal(currentPageSignal - 1)}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M15 19l-7-7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {(() => {
                  // Helper to generate pagination buttons with ellipsis
                  const pageButtons = [];
                  const maxButtons = 5;
                  const showEllipsis = totalSignalPages > maxButtons + 2;

                  if (!showEllipsis) {
                    // Show all pages if not too many
                    for (let idx = 0; idx < totalSignalPages; idx++) {
                      pageButtons.push(
                        <button
                          key={idx + 1}
                          className={`px-3 py-1 rounded-lg border ${
                            idx + 1 === currentPageSignal
                              ? "border-pink-500 bg-pink-500 text-white font-semibold"
                              : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                          onClick={() => setCurrentPageSignal(idx + 1)}
                        >
                          {idx + 1}
                        </button>
                      );
                    }
                  } else {
                    // Always show first page
                    pageButtons.push(
                      <button
                        key={1}
                        className={`px-3 py-1 rounded-lg border ${
                          1 === currentPageSignal
                            ? "border-pink-500 bg-pink-500 text-white font-semibold"
                            : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                        onClick={() => setCurrentPageSignal(1)}
                      >
                        1
                      </button>
                    );
                    if (currentPageSignal > 3) {
                      pageButtons.push(
                        <span
                          key="start-ellipsis"
                          className="px-2 text-slate-400"
                        >
                          ...
                        </span>
                      );
                    }

                    // Show middle page numbers
                    const start = Math.max(2, currentPageSignal - 1);
                    const end = Math.min(
                      totalSignalPages - 1,
                      currentPageSignal + 1
                    );

                    for (let idx = start; idx <= end; idx++) {
                      pageButtons.push(
                        <button
                          key={idx}
                          className={`px-3 py-1 rounded-lg border ${
                            idx === currentPageSignal
                              ? "border-pink-500 bg-pink-500 text-white font-semibold"
                              : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                          onClick={() => setCurrentPageSignal(idx)}
                        >
                          {idx}
                        </button>
                      );
                    }

                    // Show ellipsis if currentPageSignal is far from end
                    if (currentPageSignal < totalSignalPages - 2) {
                      pageButtons.push(
                        <span
                          key="end-ellipsis"
                          className="px-2 text-slate-400"
                        >
                          ...
                        </span>
                      );
                    }
                    pageButtons.push(
                      <button
                        key={totalSignalPages}
                        className={`px-3 py-1 rounded-lg border ${
                          totalSignalPages === currentPageSignal
                            ? "border-pink-500 bg-pink-500 text-white font-semibold"
                            : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                        onClick={() => setCurrentPageSignal(totalSignalPages)}
                      >
                        {totalSignalPages}
                      </button>
                    );
                  }

                  return pageButtons;
                })()}
                <button
                  className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                  disabled={currentPageSignal === totalSignalPages}
                  onClick={() => setCurrentPageSignal(currentPageSignal + 1)}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M9 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </div>
    </div>
  );
};

export default Signals;
