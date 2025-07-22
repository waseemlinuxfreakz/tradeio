import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const WalletPage = () => {
  const navigate = useNavigate();

  const transactions = [
    {
      id: 1,
      type: 'receive',
      amount: '+125.00 TRADE',
      from: 'Signal Reward',
      time: '2h ago'
    },
    {
      id: 2,
      type: 'send',
      amount: '-50.00 TRADE',
      to: 'Trading Fee',
      time: '5h ago'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="p-4 flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Wallet</h1>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Total Balance</div>
                <div className="text-2xl font-bold">1,234.56 TRADE</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors">
                Deposit
              </button>
              <button className="py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors">
                Withdraw
              </button>
            </div>
          </div>

          <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${
                    tx.type === 'receive' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                  } flex items-center justify-center`}>
                    {tx.type === 'receive' ? (
                      <ArrowDownRight className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-rose-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {tx.type === 'receive' ? tx.from : tx.to}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">{tx.time}</span>
                    </div>
                  </div>
                  <div className={`text-right ${
                    tx.type === 'receive' ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {tx.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default WalletPage;