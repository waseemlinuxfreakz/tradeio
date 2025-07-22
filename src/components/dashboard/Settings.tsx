import { Settings } from "lucide-react";

interface Configuration {
  theme?: string;
  layout?: string;
  percValidatorsStage1?: string;
  defaultBalanceForAllNewUsers?: string;
  rrPerInvitation?: string;
  endTimeForAirdrop?: string;
}

interface DashboardSettingsProps {
  configuration: Configuration;
  setShowConfigPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  configuration,
  setShowConfigPanel,
}) => {
  return (
    <div className="space-y-6">
      {/* Current Configuration */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
        <h3 className="text-lg font-bold mb-4">Current Configuration</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
            <div>
              <div className="font-medium">Validator Threshold</div>
              <div className="text-sm text-slate-400">
                % of validators needed to clear Stage 1
              </div>
            </div>
            <div className="text-lg font-bold text-pink-500">
              {configuration?.percValidatorsStage1}%
            </div>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
            <div>
              <div className="font-medium">Default balance</div>
              <div className="text-sm text-slate-400">
                % Default balance for all new users
              </div>
            </div>
            <div className="text-lg font-bold text-pink-500">
              {configuration?.defaultBalanceForAllNewUsers}$
            </div>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
            <div>
              <div className="font-medium">Referral Reward</div>
              <div className="text-sm text-slate-400">
                Referral reward per invitation
              </div>
            </div>
            <div className="text-lg font-bold text-pink-500">
              {configuration?.rrPerInvitation}%
            </div>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
            <div>
              <div className="font-medium">Airdrop End Time</div>
              <div className="text-sm text-slate-400">End Time for Airdrop</div>
            </div>
            <div className="text-lg font-bold text-pink-500">
              {configuration?.endTimeForAirdrop} days
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowConfigPanel(true)}
          className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Settings className="w-5 h-5" />
          Update Configuration
        </button>
      </div>
    </div>
  );
};

export default DashboardSettings;
