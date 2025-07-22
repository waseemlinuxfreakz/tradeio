import React from 'react'
import {
    Users,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Percent,
} from "lucide-react";
import VoteActivity from './VoteActivity';
import {
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
} from "recharts";
import { CustomTooltip } from '../../pages/AdminDashboardPage';
type User = {
    id?: string | number;
    name?: string;
    email?: string;
    userType?: string;
    reputationPoints?: number;
    successRate?: number;
    isValidator?: boolean;
};

interface OverviewProps {
    usersData: {
        data?: {
            users?: User[];
            total?: number;
            totalPages?: number;
            validatorsCount?: number;
        };
    };
    signalsData: {
        data?: {
            completedCount?: number;
            successfullSignals?: number;
            pendingCount?: number;
            expiredCount?: number;
            total?: number;
        };
    };
    config: {
        validatorPercentage?: number;
    };
    analytics: {
        successRateData: { value: number; color: string }[];
        [key: string]: any;
    };
}

const Overview = ({ usersData, signalsData, config, analytics }: OverviewProps) => {
    const completedSignals = signalsData?.data?.completedCount || 0;
    const successfulSignals = signalsData?.data?.successfullSignals || 0;
    const validators = usersData?.data?.validatorsCount || 0;
    const pendingSignals = signalsData?.data?.pendingCount || 0;
    const expiredSignals = signalsData?.data?.expiredCount || 0;
    const totalSignals = signalsData?.data?.total || 0;
    const successfulSignalPercentage =
        completedSignals > 0
            ? ((successfulSignals / totalSignals) * 100).toFixed(2)
            : "0.00";


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-slate-400">
                            Total Users
                        </span>
                    </div>
                    <div className="text-xl font-bold">
                        {usersData?.data?.total}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                        {usersData?.data?.total || 0} active
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-slate-400">
                            Total Signals
                        </span>
                    </div>
                    <div className="text-xl font-bold">
                        {signalsData?.data?.total || 0}
                    </div>
                    <div className="text-xs text-emerald-400 mt-1">
                        {completedSignals}
                        &nbsp;completed
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <span className="text-xs text-slate-400">
                            Success Rate
                        </span>
                    </div>
                    <div className="text-xl font-bold text-purple-500">
                        {completedSignals > 0
                            ? `${(
                                (successfulSignals / completedSignals) *
                                100
                            ).toFixed(2)}%`
                            : "0.00%"}
                    </div>
                    <div className="text-xs text-purple-400 mt-1">
                        Last 30 days
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                        <Percent className="w-4 h-4 text-pink-500" />
                        <span className="text-xs text-slate-400">
                            Validators
                        </span>
                    </div>
                    <div className="text-xl font-bold text-pink-500">
                        {validators}
                    </div>
                    <div className="text-xs text-pink-400 mt-1">
                        Top {config.validatorPercentage}%
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <h3 className="text-lg font-bold mb-4">Signals by Stage</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-xs text-slate-400">
                                Pending Stage
                            </span>
                        </div>
                        <div className="text-lg font-bold text-blue-500">
                            {pendingSignals}
                        </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-slate-400">
                                Completed Stage
                            </span>
                        </div>
                        <div className="text-lg font-bold text-emerald-500">
                            {completedSignals}
                        </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <XCircle className="w-4 h-4 text-rose-500" />
                            <span className="text-xs text-slate-400">
                                Expired Stage
                            </span>
                        </div>
                        <div className="text-lg font-bold text-rose-500">
                            {expiredSignals}
                        </div>
                    </div>
                </div>
            </div>

            <VoteActivity
                CustomTooltip={CustomTooltip}
                analytics={analytics}
            />
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <h3 className="text-lg font-bold mb-4">
                    Signal Success Rate
                </h3>
                <div className="flex">
                    <div className="w-1/2">
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={analytics.successRateData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {analytics.successRateData.map(
                                            (entry: { color: string }, index: number) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col justify-center">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-sm">
                                    Success: {successfulSignalPercentage}%
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <span className="text-sm">
                                    Failed:{" "}
                                    {(
                                        100 - Number(successfulSignalPercentage)
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview