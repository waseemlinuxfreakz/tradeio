
const OuterSettings = () => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
      <h3 className="text-lg font-bold mb-4">System Settings</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
          <div>
            <div className="font-medium">Default Balance</div>
            <div className="text-sm text-slate-400">For new users</div>
          </div>
          <div className="text-lg font-bold">1,000 TRT</div>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
          <div>
            <div className="font-medium">Referral Reward</div>
            <div className="text-sm text-slate-400">Per invitation</div>
          </div>
          <div className="text-lg font-bold">50 TRT</div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Airdrop End Time</div>
            <div className="text-sm text-slate-400">Countdown to end</div>
          </div>
          <div className="text-lg font-bold">14d 6h 23m</div>
        </div>
      </div>
    </div>
  );
};

export default OuterSettings;
