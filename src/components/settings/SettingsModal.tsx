import React, { useState } from 'react';
import { Settings, ArrowLeft } from 'lucide-react';
import CustomSwitch from './CustomSwitch';
import CustomSlider from './CustomSlider';
import ButtonGroup from './ButtonGroup';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Slider States
  const [riskProfile, setRiskProfile] = useState(50);
  const [riskRewardRatio, setRiskRewardRatio] = useState(2);
  const [minimalConsensusRate, setMinimalConsensusRate] = useState(50);
  const [minimalAnalystRating, setMinimalAnalystRating] = useState(3);

  // Button Group States
  const [exchangeType, setExchangeType] = useState('DEX');
  const [positionType, setPositionType] = useState('Both');
  const [assetType, setAssetType] = useState('Spot');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full bg-slate-900">
          <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
            <div className="p-4 flex items-center gap-3">
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold">Settings</h1>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-pink-500" />
                <span>Advanced Settings</span>
              </div>
              <CustomSwitch 
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
              />
            </div>

            {showAdvanced && (
              <div className="space-y-4">
                {/* Sliders */}
                <CustomSlider 
                  title="Risk Profile"
                  value={riskProfile}
                  onChange={setRiskProfile}
                  min={0}
                  max={100}
                  step={1}
                />
                
                <CustomSlider 
                  title="Risk Reward Ratio"
                  value={riskRewardRatio}
                  onChange={setRiskRewardRatio}
                  min={1}
                  max={10}
                  step={0.1}
                  unit="ratio"
                />
                
                <CustomSlider 
                  title="Minimal Consensus Rate"
                  value={minimalConsensusRate}
                  onChange={setMinimalConsensusRate}
                  min={0}
                  max={100}
                  step={1}
                />
                
                <CustomSlider 
                  title="Minimal Analyst Rating"
                  value={minimalAnalystRating}
                  onChange={setMinimalAnalystRating}
                  min={1}
                  max={5}
                  step={0.1}
                  unit=""
                />

                {/* Button Groups */}
                <ButtonGroup
                  title="Exchange Type"
                  options={['DEX', 'CEX', 'Both']}
                  selected={exchangeType}
                  onChange={setExchangeType}
                />

                <ButtonGroup
                  title="Position Type"
                  options={['Short', 'Long', 'Both']}
                  selected={positionType}
                  onChange={setPositionType}
                />

                <ButtonGroup
                  title="Asset Type"
                  options={['Spot', 'Future', 'Options']}
                  selected={assetType}
                  onChange={setAssetType}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;