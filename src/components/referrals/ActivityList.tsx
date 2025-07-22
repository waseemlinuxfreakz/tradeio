import React from 'react';
import { Signal, Users, Award, Percent } from 'lucide-react';

interface Activity {
  id: number;
  type: 'signal' | 'referral';
  username: string;
  signalName?: string;
  date: string;
  status: string;
  earnings: string;
  tier?: string;
  profitShare?: string;
}

interface ActivityListProps {
  activities: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.username}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  activity.type === 'signal' 
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {activity.type === 'signal' ? (
                    <>
                      <Signal className="w-3 h-3" />
                      Signal Share
                    </>
                  ) : (
                    <>
                      <Users className="w-3 h-3" />
                      System Referral
                    </>
                  )}
                </span>
              </div>
              {activity.type === 'signal' && activity.signalName && (
                <div className="text-sm text-slate-400 mt-1">
                  Shared signal: {activity.signalName}
                </div>
              )}
              {activity.type === 'referral' && activity.tier && (
                <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                  <Award className="w-3 h-3" />
                  {activity.tier} Tier
                </div>
              )}
              {activity.type === 'signal' && activity.profitShare && (
                <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                  <Percent className="w-3 h-3" />
                  {activity.profitShare} Profit Share
                </div>
              )}
              <div className="text-sm text-slate-400 mt-1">{activity.date}</div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${
                activity.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'
              }`}>
                {activity.earnings}
              </div>
              <div className="text-xs text-slate-400">{activity.status}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;