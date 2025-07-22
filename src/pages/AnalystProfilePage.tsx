import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Users, Signal, BarChart2, Share2, User, AlertTriangle } from 'lucide-react';
import ChartSection from '../components/dashboard/ChartSection';
import SignalDetailsSection from '../components/dashboard/SignalDetailsSection';
import ShareModal from '../components/ShareModal';
import { useFollowStore } from '../lib/followStore';
import { getDecodedUserToken } from '../utils';
import useAnalystProfile from '../hooks/useAnalystProfile';

const AnalystProfilePage = () => {
  const { analystId } = useParams();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const user = getDecodedUserToken();
  const { isanalystData, isanalystDataLoading, isanalystDataError } = useAnalystProfile(analystId!,user!.userId)

  if (isanalystDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-12 h-12 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const analyst = {
    id: isanalystData?.data?.profile?.id,
    name: isanalystData?.data?.profile?.name,
    image: isanalystData?.data?.profile?.image,
    type: isanalystData?.data?.profile?.badge,
    stats: {
      signals: isanalystData?.data?.profile?.totalSignals,
      followers: isanalystData?.data?.data?.analyst?.stats?.followers,
      success: isanalystData?.data?.profile?.successRate,
    },
  };


  const voteData = {
    totalVotes: isanalystData?.data?.data?.community?.votes ?? 0,
    userVote: isanalystData?.data?.data?.userVote ?? "",
    consensus: isanalystData?.data?.data?.community?.consensus ?? 0,
    validator: {
      validatorPositive: isanalystData?.data?.data?.validator?.validatorPositive,
      validatorNegative: isanalystData?.data?.data?.validator?.validatorNegative,
      verifiedValidators: isanalystData?.data?.data?.validator?.verifiedValidators,
      validatorPercentage: isanalystData?.data?.data?.validator?.validatorPercentage,
    },
    community: {
      communityPositive: isanalystData?.data?.data?.community?.communityPositive,
      communityNegative: isanalystData?.data?.data?.community?.communityNegative,
      votes: isanalystData?.data?.data?.community?.votes,
      consensus: isanalystData?.data?.data?.community?.consensus,
      verifiedCommunity: isanalystData?.data?.data?.community?.verifiedCommunity
    },
  }


  if (isanalystDataError) {
    return <div className="flex items-center justify-center h-[100vh]">
      <div className="text-center text-red-500 text-lg">
        {isanalystData?.data?.message || "Something went wrong."}
      </div>
    </div>
  }
  const handleShare = () => {
    setShowShareModal(true);
  };
  return (
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
          <h1 className="text-lg font-bold">Analyst Profile</h1>
        </div>
      </div>

      {/* Profile Header */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full ring-2 bg-gradient-to-r from-pink-500 to-purple-600 p-0.5 flex items-center justify-center">

              {analyst && analyst.image ? (
                <img
                  src={analyst.image}
                  alt="User"
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                  onError={() => {
                    console.error(
                      "❌ Image failed to load:",
                      analyst.image
                    );
                  }}
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{analyst.name}</h2>
            <div className="text-sm px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 inline-block mt-1">
              {analyst.type}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Signal className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-slate-400">Signals</span>
            </div>
            <div className="text-lg font-bold">{analyst.stats.signals}</div>
          </div>

          {/* <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-slate-400">Followers</span>
            </div>
            <div className="text-lg font-bold">{analyst.stats.followers}</div>
          </div> */}

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-400">Success</span>
            </div>
            <div className="text-lg font-bold text-emerald-500">{analyst.stats.success}</div>
          </div>
          <button
            onClick={handleShare}
            className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:bg-slate-700/50 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex gap-3 mt-6"> */}
        {/* <button
            onClick={handleFollow}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Follow Analyst
          </button> */}


        {/* </div> */}
      </div>

      {/* Latest Signal */}
      <div className="mt-4">
        {isanalystData?.data?.data && (<div className="px-6 mb-4">
          <h3 className="text-lg font-bold">Latest Signal</h3>
        </div>)}
        {isanalystData?.data?.data ? (<ChartSection
          signal={isanalystData?.data?.data
          }
          priceLines={{
            takeProfit: isanalystData?.data?.data?.takeProfit,
            stopLoss: isanalystData?.data?.data?.stopLoss,
            currentPrice: isanalystData?.data?.data?.entry
          }}
          voteData={voteData}
        />
        ) : <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No signals found</h3>
        </div>}
        <SignalDetailsSection />
    
      </div>


      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          signalDetails={{
            id: isanalystData?.data?.data ? isanalystData?.data?.data?.id : "0",
            pair: isanalystData?.data?.data ? isanalystData?.data?.data?.pair : "No Coin",
            type: isanalystData?.data?.data ? isanalystData?.data?.data?.type : "0",
            entry: isanalystData?.data?.data ? isanalystData?.data?.data?.entryPrice : "0",
            takeProfit: isanalystData?.data?.data ? isanalystData?.data?.data?.takeProfitTargets?.[0]?.price : "0",
            stopLoss: isanalystData?.data?.data ? isanalystData?.data?.data?.stopLossTargets?.[0]?.price : "0",
            consensus: isanalystData?.data?.data ? `${voteData?.consensus}%` : "0"
          }}
        />
      )}
    </div>
  );
};

export default AnalystProfilePage;