import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20" />
      
      <div className="relative px-6 pt-12 pb-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Trade Smarter with
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"> Community Intelligence</span>
          </h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Join thousands of traders using blockchain-verified signals and collective wisdom to make better trading decisions.
          </p>
          
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Start Trading Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/whitepaper')}
              className="w-full bg-white/10 backdrop-blur-sm py-3 rounded-xl font-medium hover:bg-white/20 transition-all"
            >
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="text-2xl font-bold text-pink-500">92%</div>
              <div className="text-xs text-slate-400">Success Rate</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="text-2xl font-bold text-purple-500">50K+</div>
              <div className="text-xs text-slate-400">Active Users</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="text-2xl font-bold text-blue-500">$2M+</div>
              <div className="text-xs text-slate-400">Daily Volume</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;