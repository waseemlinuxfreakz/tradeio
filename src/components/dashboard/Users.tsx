import { useState, useEffect } from "react";
import { Users, TrendingUp, TrendingDown, Percent, Search } from "lucide-react";
import { useVotingSystem } from "../../lib/votingSystem";
import { Spin } from "antd";

type User = {
  id?: string | number;
  name?: string;
  email?: string;
  userType?: string;
  reputationPoints?: number;
  successRate?: number;
  isValidator?: boolean;
};
interface UsersDataProps {
  usersData: {
    data?: {
      users?: User[];
      total?: number;
      totalPages?: number;
    };
  };
  setCurrentPageUser: (page: number) => void;
  currentPageUser: number;
  usersDataLoading: boolean;
  validators: number;
}

const UsersData = ({
  usersData,
  setCurrentPageUser,
  currentPageUser,
  usersDataLoading,
  validators,
}: UsersDataProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const { config } = useVotingSystem();
  const totalPages = usersData?.data?.totalPages || 1;
  const handleUsersSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    if (!usersData?.data?.users) return;
    if (!searchValue) {
      setUsers(usersData.data.users);
      return;
    }
    const filtered = usersData?.data?.users.filter((user: { name?: string }) =>
      user.name?.toLowerCase().includes(searchValue)
    );
    setUsers(filtered);
  };
  useEffect(() => {
    if (usersData?.data?.users) {
      setUsers(usersData?.data?.users);
    }
  }, [usersData]);
  return (
    <Spin spinning={usersDataLoading}>
      <div className="space-y-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
              onChange={handleUsersSearch}
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          </div>
          {/* <button className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <Filter className="w-5 h-5 text-slate-400" />
        </button>
        <button className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <Download className="w-5 h-5 text-slate-400" />
        </button> */}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-slate-400">Total Users</span>
            </div>
            <div className="text-xl font-bold">{usersData?.data?.total}</div>
            <div className="text-xs text-blue-400 mt-1">
              {/* +125 this week */}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-400">Active Users</span>
            </div>
            <div className="text-xl font-bold text-emerald-500">
              {usersData?.data?.total}
            </div>
            <div className="text-xs text-emerald-400 mt-1">100% of total</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <span className="text-xs text-slate-400">Inactive Users</span>
            </div>
            <div className="text-xl font-bold text-rose-500">{0}</div>
            <div className="text-xs text-rose-400 mt-1">0% of total</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Percent className="w-4 h-4 text-pink-500" />
              <span className="text-xs text-slate-400">Validators</span>
            </div>
            <div className="text-xl font-bold text-pink-500">
              {" "}
              {((validators / (usersData?.data?.total || 0)) * 100).toFixed(2)}
            </div>
            <div className="text-xs text-pink-400 mt-1">
              Top {config.validatorPercentage}%
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <h3 className="text-lg font-bold mb-4">User List</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Reputation
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Success Rate
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any, i: number) => (
                  <tr
                    key={user.id || i}
                    className="border-b border-slate-700/30"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-slate-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                        {user.userType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{user.reputationPoints}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-emerald-500">
                        {user.successRate.toFixed(2)}%
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <button
                        className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50"
                        disabled={currentPageUser === 1}
                        onClick={() => setCurrentPageUser(currentPageUser - 1)}
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
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
                        const showEllipsis = totalPages > maxButtons + 2;

                        if (!showEllipsis) {
                          // Show all pages if not too many
                          for (let idx = 0; idx < totalPages; idx++) {
                            pageButtons.push(
                              <button
                                key={idx + 1}
                                className={`px-3 py-1 rounded-lg border ${
                                  idx + 1 === currentPageUser
                                    ? "border-pink-500 bg-pink-500 text-white font-semibold"
                                    : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                                }`}
                                onClick={() => setCurrentPageUser(idx + 1)}
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
                                1 === currentPageUser
                                  ? "border-pink-500 bg-pink-500 text-white font-semibold"
                                  : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                              }`}
                              onClick={() => setCurrentPageUser(1)}
                            >
                              1
                            </button>
                          );
                          if (currentPageUser > 3) {
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
                          const start = Math.max(2, currentPageUser - 1);
                          const end = Math.min(
                            totalPages - 1,
                            currentPageUser + 1
                          );

                          for (let idx = start; idx <= end; idx++) {
                            pageButtons.push(
                              <button
                                key={idx}
                                className={`px-3 py-1 rounded-lg border ${
                                  idx === currentPageUser
                                    ? "border-pink-500 bg-pink-500 text-white font-semibold"
                                    : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                                }`}
                                onClick={() => setCurrentPageUser(idx + 1)}
                              >
                                {idx}
                              </button>
                            );
                          }

                          // Show ellipsis if currentPageUser is far from end
                          if (currentPageUser < totalPages - 2) {
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
                              key={totalPages}
                              className={`px-3 py-1 rounded-lg border ${
                                totalPages === currentPageUser
                                  ? "border-pink-500 bg-pink-500 text-white font-semibold"
                                  : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                              }`}
                              onClick={() => {
                                setCurrentPageUser(totalPages);
                              }}
                            >
                              {totalPages}
                            </button>
                          );
                        }

                        return pageButtons;
                      })()}
                      <button
                        className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                        disabled={currentPageUser === totalPages}
                        onClick={() => setCurrentPageUser(currentPageUser + 1)}
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
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
            </table>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default UsersData;
