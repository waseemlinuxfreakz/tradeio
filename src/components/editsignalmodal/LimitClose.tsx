import React from 'react';

interface LimitCloseProps {
  onClose: () => void;
}


const LimitClose: React.FC<LimitCloseProps> = ({ onClose }) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 modalWrap">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Close with Limit Order</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {/* Contract and Side */}
          <div className="flex flex-col gap-1">
            <div className='flex justify-between items-center'>
              <p className="text-gray-400 text-sm">Contract</p>
              <p className="font-medium">XRP PERP/USDT</p>
            </div>
            <div className='flex justify-between items-center'>
              <p className="text-gray-400 text-sm">Side</p>
              <p className="font-medium text-green-500">Long/4.97x</p>
            </div>
            <div className='flex justify-between items-center'>
              <p className="text-gray-400 text-sm">Entry Price</p>
              <p className="font-medium">3.55334</p>
            </div>
            <div className='flex justify-between items-center'>
              <p className="text-gray-400 text-sm">Last Price</p>
              <p className="font-medium">3.55990</p>
            </div>
          </div>

          {/* Close Price */}
          <div>
            <p className="text-gray-400 text-sm">Close Price</p>
            <div className="flex items-center mt-1 bg-gray-700 rounded p-2">
              <input
                type="text"
                value="3.5599"
                className="bg-transparent outline-none w-full"
              />
              <span className="ml-2">USDT</span>
            </div>
          </div>

          {/* Position Size */}
          <div>
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
          </div>

          {/* Percentage Slider */}
          <div>
            <div className="relative pt-1">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="100"
                step="1"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-1">
                {[0, 25, 50, 75, 100].map((value) => (
                  <button
                    key={value}
                    className="text-xs text-gray-400 hover:text-white"
                    onClick={() => {/* Handle percentage change */}}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PNL Display */}
          <div className="pt-4 border-t border-gray-700 flex justify-between">
            <p className="text-gray-400 text-sm">Estimated PNL</p>
            <div className='text-right'>
              <p className="text-lg font-medium text-gray-400">+0.06 USDT</p>
              <p className="text-gray-400">≈ $0.06</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button onClick={onClose} className="w-full justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitClose;