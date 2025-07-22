import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getVoteActivityRecords } from "../../apis/apiEndpoints";
import { Tooltip as TooltipAntd, Spin } from "antd";
type CustomTooltipProps = {
  active?: boolean;
  payload?: any;
  label?: string;
};

type VoteActivityProps = {
  CustomTooltip: React.FC<CustomTooltipProps>;
  analytics: any;
};

const VoteActivity: React.FC<VoteActivityProps> = ({ CustomTooltip }) => {
  const [timeRange, setTimeRange] = useState("7d");
  const { data: voteActivity, isLoading } = useQuery({
    queryKey: ["vote-activity", timeRange],
    queryFn: () => getVoteActivityRecords(timeRange),
    select: ({ data }) => data.data,
  });
 
  return (
    <Spin spinning={isLoading}>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Vote Activity</h3>
          <div className="flex gap-2">
            {["24h", "7d", "30d", "all"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  timeRange === range
                    ? "bg-pink-500 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={voteActivity}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.1)"
              />
              <XAxis
                dataKey="bucket"
                stroke="#64748b"
                tick={<CustomTick />}
                interval={0}
              />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="validatorVotes"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Validator Votes"
                color="#3b82f6"
              />
              <Area
                type="monotone"
                dataKey="communityVotes"
                stackId="1"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.3}
                name="Community Votes"
                color="#a855f7"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Spin>
  );
};

export default VoteActivity;

const CustomTick = ({ x, y, payload }: any) => {
  const value = payload.value;
  const displayText = value.length > 10 ? `${value.slice(0, 10)}...` : value;

  return (
    <g transform={`translate(${x},${y})`}>
      <TooltipAntd title={value}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#64748b"
          style={{ cursor: "pointer" }}
        >
          {displayText}
        </text>
      </TooltipAntd>
    </g>
  );
};
