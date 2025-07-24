import { useState, useEffect } from 'react';

const TPSLModal = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1 for confirmation, 2 for main popup
  const [dontRemind, setDontRemind] = useState(false);

  // Check localStorage on component mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('dontRemindTPSLConfirmation');
    if (savedPreference === 'false') {
      setDontRemind(false);
      setStep(2); // Skip confirmation if user previously chose not to be reminded
    }
  }, []);

  const handleConfirm = () => {
    if (dontRemind) {
      // Save preference to localStorage
      localStorage.setItem('dontRemindTPSLConfirmation', 'false');
    }
    setStep(2);
  };

  const handleMainConfirm = () => {
    onClose();
    // Here you would typically submit the TP/SL data
  };

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  z-50 modalWrap">
      {step === 1 ? (
        // Confirmation Popup
        <div className="bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">TP/SL Mode</h2>
                <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-2xl"
                >
                    &times;
                </button>
            </div>

          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Entire Position</h3>
            <p className="text-sm text-gray-300 mb-4">
              In this mode, order quantity adjusts with position size. A market order triggers when the price is reached. 
              Only one full-position TP/SL order can be set at a time.
            </p>
            
            <h3 className="font-semibold mb-2">Partial Position</h3>
            <p className="text-sm text-gray-300">
              In this mode, the amount of take-profit and stop-loss orders remains fixed regardless of position size. 
              Multiple take-profit and stop-loss orders can be set.
            </p>
          </div>
          
          <div className="flex items-center mb-6">
            <input 
              type="checkbox" 
              id="dontRemind" 
              checked={dontRemind}
              onChange={(e) => setDontRemind(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="dontRemind" className="text-sm">Don't remind me again</label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={handleConfirm}
              className="w-full justify-center px-4 py-2 rounded-lg bg-black font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
              Confirm
            </button>
          </div>

        </div>
      ) : (
        // Main TP/SL Popup
        <div className="bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">TP/SL</h2>
                <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-2xl"
                >
                    &times;
                </button>
            </div>

          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">XRP PERP /USDT</span>
              <div className="flex space-x-2">
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Long</span>
                <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">Isolated</span>
                <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">4.97x</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="col-span-3 text-gray-400">Entry Price</div>
              <div className="text-right">3.55334</div>
              
              <div className="col-span-3 text-gray-400">Last Price</div>
              <div className="text-right">3.55921</div>
              
              <div className="col-span-3 text-gray-400">Liquidation Price</div>
              <div className="text-right">2.86445</div>
            </div>
          </div>

          <div className="tabContainer modalTabContent">
            <div className="tabBtns">
                <button
                    className={`tabButton flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-slate-400 bg-pink-500 text-white bg-pink-500/20 text-slate-400 hover:bg-slate-700/50 ${activeTab === 0 ? 'active bg-pink-500' : ''}`}
                    onClick={() => setActiveTab(0)}
                    >
                    Entire Position
                </button>
                <button
                    className={`tabButton flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-slate-400 bg-pink-500 text-white bg-pink-500/20 text-slate-400 hover:bg-slate-700/50  ${activeTab === 1 ? 'active bg-pink-500' : ''}`}
                    onClick={() => setActiveTab(1)}
                    >
                    Partial Position
                </button>
            </div>
            <div className="tabContent">
                <div className={`tabItem ${activeTab === 0 ? 'active' : ''}`}>
                    <div className="profitBox">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-gray-400 text-sm">Take-Profit</p>
                                <div className="flex items-center mt-1 bg-gray-700 rounded p-2">
                                <input
                                    type="text"
                                    value="3.5599"
                                    className="bg-transparent outline-none w-full"
                                />
                                <span className="ml-2">USDT</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Last Price</p>
                                <div className="flex items-center mt-1 bg-gray-700 rounded p-2">
                                <input
                                    type="text"
                                    value="35"
                                    className="bg-transparent outline-none w-full"
                                />
                                <span className="ml-2">%</span>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 mt-3">
                            <div className="flex gap-2 items-center">
                                <div className="relative flex-1 space-y-2">
                                    <input 
                                    type="range" 
                                    min="0"
                                    max="150"
                                    step="1"
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                                    [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer
                                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/20
                                    hover:[&::-webkit-slider-thumb]:scale-110 transition-all" />
                                    <div className="flex justify-between text-xs text-slate-400 px-1 labelmt-0">
                                        <span>0%</span>
                                        <span>30%</span>
                                        <span>60%</span>
                                        <span>0%</span>
                                        <span>120%</span>
                                        <span>150%</span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-gray-400 text-sm mt-3'> take-profit order Will trigger when Last Price reaches <span className='text-white'>3.80207</span> with an estimated PNt nf +2.48 USDT</p>
                        </div>
                    </div>
                    
                    <div className="profitBox">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-gray-400 text-sm">Stop-Loss</p>
                                <div className="flex items-center mt-1 bg-gray-700 rounded p-2">
                                <input
                                    type="text"
                                    value=""
                                    placeholder='Price'
                                    className="bg-transparent outline-none w-full"
                                />
                                <span className="ml-2">USDT</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Last Price</p>
                                <div className="flex items-center mt-1 bg-gray-700 rounded p-2">
                                <input
                                    type="text"
                                    value=""
                                    placeholder='SL Percent'
                                    className="bg-transparent outline-none w-full"
                                />
                                <span className="ml-2">%</span>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 mt-3">
                            <div className="flex gap-2 items-center">
                                <div className="relative flex-1 space-y-2">
                                    <input 
                                    type="range" 
                                    min="0"
                                    max="75"
                                    step="1"
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                                    [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer
                                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/20
                                    hover:[&::-webkit-slider-thumb]:scale-110 transition-all" />
                                    <div className="flex justify-between text-xs text-slate-400 px-1 labelmt-0">
                                        <span>0%</span>
                                        <span>15%</span>
                                        <span>30%</span>
                                        <span>45%</span>
                                        <span>60%</span>
                                        <span>75%</span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-gray-400 text-sm mt-3'> The stop—loss order will trigger Last reaches with an estimated PNL of, </p>
                        </div>
                    </div>
                </div>
                <div className={`tabItem ${activeTab === 1 ? 'active' : ''}`}>
                    <div className="profitBox">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-gray-400 text-sm">Take-Profit</p>
                                <div className="flex items-center mt-1 bg-gray-700 rounded p-2">
                                <input
                                    type="text"
                                    value="3.5599"
                                    className="bg-transparent outline-none w-full"
                                />
                                <span className="ml-2">USDT</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Last Price</p>
                                <div className="flex items-center mt-1 bg-gray-700 rounded p-2">
                                <input
                                    type="text"
                                    value="35"
                                    className="bg-transparent outline-none w-full"
                                />
                                <span className="ml-2">%</span>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 mt-3">
                            <div className="flex gap-2 items-center">
                                <div className="relative flex-1 space-y-2">
                                    <input 
                                    type="range" 
                                    min="0"
                                    max="150"
                                    step="1"
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                                    [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer
                                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/20
                                    hover:[&::-webkit-slider-thumb]:scale-110 transition-all" />
                                    <div className="flex justify-between text-xs text-slate-400 px-1 labelmt-0">
                                        <span>0%</span>
                                        <span>30%</span>
                                        <span>60%</span>
                                        <span>0%</span>
                                        <span>120%</span>
                                        <span>150%</span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-gray-400 text-sm mt-3'> take-profit order Will trigger when Last Price reaches <span className='text-white'>3.80207</span> with an estimated PNt nf +2.48 USDT</p>
                        </div>
                    </div>
                    
                    <div className="profitBox">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-gray-400 text-sm">Stop-Loss</p>
                                <div className="flex items-center mt-1 bg-gray-700 rounded p-2">
                                <input
                                    type="text"
                                    value=""
                                    placeholder='Price'
                                    className="bg-transparent outline-none w-full"
                                />
                                <span className="ml-2">USDT</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Last Price</p>
                                <div className="flex items-center mt-1 bg-gray-700 rounded p-2">
                                <input
                                    type="text"
                                    value=""
                                    placeholder='SL Percent'
                                    className="bg-transparent outline-none w-full"
                                />
                                <span className="ml-2">%</span>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4 mt-3">
                            <div className="flex gap-2 items-center">
                                <div className="relative flex-1 space-y-2">
                                    <input 
                                    type="range" 
                                    min="0"
                                    max="75"
                                    step="1"
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                                    [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer
                                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/20
                                    hover:[&::-webkit-slider-thumb]:scale-110 transition-all" />
                                    <div className="flex justify-between text-xs text-slate-400 px-1 labelmt-0">
                                        <span>0%</span>
                                        <span>15%</span>
                                        <span>30%</span>
                                        <span>45%</span>
                                        <span>60%</span>
                                        <span>75%</span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-gray-400 text-sm mt-3'> The stop—loss order will trigger Last reaches with an estimated PNL of, </p>
                        </div>
                    </div>

                    <div className='profitBox'>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-400 text-sm">Position Size</p>
                            <p className="text-gray-400 text-xs">Available: <b>10 XRP</b></p>
                            </div>
                            <div className="flex items-center mt-1 bg-gray-700 rounded p-2">
                            <input
                                type="number"
                                value="10"
                                className="bg-transparent outline-none w-full"
                                readOnly
                            />
                            <span className="ml-2">XRP</span>
                        </div>
                        <div className="relative flex-1 space-y-2">
                            <input 
                            type="range" 
                            min="0"
                            max="100"
                            step="1"
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                            [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                            [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-pink-500/20
                            hover:[&::-webkit-slider-thumb]:scale-110 transition-all" />
                            <div className="flex justify-between text-xs text-slate-400 px-1 labelmt-0">
                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
          </div>
          
          {/* Here you would add your TP/SL input fields and other functionality */}
          
          <div className="flex justify-end space-x-2 mt-4">
            <button 
              onClick={handleMainConfirm}
              className="w-full justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TPSLModal;