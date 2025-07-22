import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Award, ChevronRight } from 'lucide-react';

const TopAnalysts = () => {
  const navigate = useNavigate();

  const analysts = [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
      successRate: "96%",
      followers: "23.5K",
      rank: "Top 1%"
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
      successRate: "94%",
      followers: "19.2K",
      rank: "Top 3%"
    }
  ];

  return (
    <div className="px-6 py-12 bg-slate-800/50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Top Analysts</h2>
        <button 
          onClick={() => navigate('/community')}
          className="text-sm text-slate-400 flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {analysts.map((analyst) => (
          <div 
            key={analyst.id}
            onClick={() => navigate(`/analyst/${analyst.id}`)}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 cursor-pointer hover:bg-slate-800/70 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5">
                  <img 
                    src={analyst.image}
                    alt={analyst.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{analyst.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400">
                    {analyst.rank}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-emerald-500" />
                    {analyst.successRate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-purple-500" />
                    {analyst.followers}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopAnalysts;