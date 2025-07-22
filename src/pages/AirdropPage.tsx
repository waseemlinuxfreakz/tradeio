import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download,
  Gift,
  Clock,
  Users,
  ChevronRight,
  CheckCircle,
  ExternalLink,
  Copy,
  ArrowUpRight,
  Trophy,
  Star,
  Target,
  TrendingUp
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import NavigationBar from '../components/NavigationBar';

const AirdropPage = () => {
  const navigate = useNavigate();
  const [copiedAddress, setCopiedAddress] = useState(false);

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
      icon: Users,
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-900 text-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="p-4 flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Airdrop</h1>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20" />
          <div className="relative p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-pink-500" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Community Airdrop</h2>
                <p className="text-slate-400">Participate and earn TRT tokens</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Gift className="w-4 h-4 text-pink-500" />
                  <span className="text-xs text-slate-400">Total Value</span>
                </div>
                <div className="text-lg font-bold">{airdropStats.totalValue}</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-slate-400">Participants</span>
                </div>
                <div className="text-lg font-bold">{airdropStats.participants}</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-slate-400">Time Left</span>
                </div>
                <div className="text-lg font-bold">{airdropStats.timeLeft}</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Download className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-slate-400">Your Share</span>
                </div>
                <div className="text-lg font-bold">{airdropStats.yourShare}</div>
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

        <NavigationBar onQuickAction={() => navigate('/create-signal')} />
      </div>
    </PageTransition>
  );
};

export default AirdropPage;