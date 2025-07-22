import React, { useState } from "react";
import { Save, Settings, Users } from "lucide-react";
import { updateConfigurtions } from "../../apis/apiEndpoints";
import { message } from "antd";
import { useQueryClient } from "@tanstack/react-query";

interface Configuration {
  percValidatorsStage1: string;
  defaultBalanceForAllNewUsers: number;
  rrPerInvitation: number;
  endTimeForAirdrop: string;
  id: string;
}
interface AdminConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  configuration: Configuration;
}

const AdminConfigPanel: React.FC<AdminConfigPanelProps> = ({
  isOpen,
  onClose,
  configuration,
}) => {
  const config: Configuration = configuration;
  const queryClient = useQueryClient();
  const [localConfig, setLocalConfig] = useState<Configuration>(config);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key: keyof Configuration, value: number | string) => {
    setLocalConfig((prev) => ({
      ...prev,
      [key]: value,
    }));

  };

  const handleSave = () => {
    const payload = {
      percValidatorsStage1: String(localConfig?.percValidatorsStage1),
      defaultBalanceForAllNewUsers: localConfig?.defaultBalanceForAllNewUsers,
      rrPerInvitation: localConfig?.rrPerInvitation,
      endTimeForAirdrop: localConfig?.endTimeForAirdrop,
    };
    setIsSaving(true);
    updateConfigurtions(payload)
      .then((response) => {
        if (response.status === 200) {
          message.success("Configuration updated successfully");
          queryClient.invalidateQueries({ queryKey: ["configurations"] });
          onClose();
        } else {
          if (response.status === 400) {
            if (response.data.message) {
              message.error(response.data.message);
              return;
            }
          }
          message.error("Failed to update configuration");
        }
      })
      .catch((error) => {
        message.error(error?.message || "An error occurred");
      })
      .finally(() => {
        setIsSaving(false);
      });
    // setIsSaving(true);

    // Simulate API call
    // setTimeout(() => {
    //   updateConfig(localConfig);
    //   setIsSaving(false);
    //   onClose();
    // }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-pink-500/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-bold">Admin Configuration</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Configure voting thresholds and system parameters
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Validator Stage Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span>Validator Stage Settings</span>
            </h3>

            <div className="space-y-6">
              {/* Validator Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-slate-300">
                    Validator Threshold
                  </label>
                  <span className="text-sm font-medium text-pink-500">
                    {localConfig?.percValidatorsStage1}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Percentage of validators needed to clear stage 1
                </p>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={localConfig?.percValidatorsStage1}
                  onChange={(e) =>
                    handleChange("percValidatorsStage1", Number(e.target.value))
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                    [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Validator Consensus Threshold */}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-slate-300">
                    Default Balance
                  </label>
                  <span className="text-sm font-medium text-pink-500">
                    {localConfig?.defaultBalanceForAllNewUsers}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Default balance for all new users
                </p>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={localConfig?.defaultBalanceForAllNewUsers}
                  onChange={(e) =>
                    handleChange(
                      "defaultBalanceForAllNewUsers",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                    [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-slate-300">
                    Referral Reward
                  </label>
                  <span className="text-sm font-medium text-pink-500">
                    {localConfig?.rrPerInvitation}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Referral reward per invitation
                </p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localConfig?.rrPerInvitation}
                  onChange={(e) =>
                    handleChange("rrPerInvitation", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                    [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-slate-300">
                    End Time for Airdrop
                  </label>
                  <span className="text-sm font-medium text-pink-500">
                    {localConfig?.endTimeForAirdrop}
                  </span>
                </div>
                <p className="text-xs text-slate-400">End Time for Airdrop</p>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={localConfig?.endTimeForAirdrop}
                  onChange={(e) =>
                    handleChange("endTimeForAirdrop", e.target.value)
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                  [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1d</span>
                  <span>2d</span>
                  <span>3d</span>
                  <span>4d</span>
                  <span>5d</span>
                </div>
              </div>
            </div>
          </div>

          {/* Community Stage Settings */}
          {/* <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-500" />
              <span>Community Stage Settings</span>
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-slate-300">
                    Community Threshold
                  </label>
                  <span className="text-sm font-medium text-pink-500">
                    {localConfig.communityThreshold}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Percentage of users needed to vote in community stage
                </p>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={localConfig.communityThreshold}
                  onChange={(e) =>
                    handleChange("communityThreshold", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                    [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-slate-300">
                    Community Consensus Threshold
                  </label>
                  <span className="text-sm font-medium text-pink-500">
                    {localConfig.communityConsensusThreshold}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Percentage of positive votes needed in community stage
                </p>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={localConfig.communityConsensusThreshold}
                  onChange={(e) =>
                    handleChange(
                      "communityConsensusThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                    [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Validator Selection */}
          {/* <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-500" />
              <span>Validator Selection</span>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-slate-300">
                  Top Users Considered Validators
                </label>
                <span className="text-sm font-medium text-pink-500">
                  {localConfig.validatorPercentage}%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Percentage of top users by reputation that are considered
                validators
              </p>
              <input
                type="range"
                min="1"
                max="30"
                value={localConfig.validatorPercentage}
                onChange={(e) =>
                  handleChange("validatorPercentage", parseInt(e.target.value))
                }
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                  [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 border-t border-slate-700/50 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfigPanel;
