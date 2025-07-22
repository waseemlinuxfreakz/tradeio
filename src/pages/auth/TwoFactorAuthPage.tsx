import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Shield } from 'lucide-react';

const TwoFactorAuthPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputs = Array(6).fill(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setTimer(30);
    // Implement resend code logic
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="px-6 py-4 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          חזרה
        </button>
        <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          אימות דו-שלבי
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-pink-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">הכנס קוד אימות</h1>
          <p className="text-slate-400">
            קוד אימות נשלח לכתובת האימייל שלך
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {inputs.map((_, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              value={code[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || code.some(c => !c)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              מאמת...
            </>
          ) : (
            'אמת'
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">
            לא קיבלת את הקוד?
          </p>
          <button
            onClick={handleResendCode}
            disabled={timer > 0}
            className="text-pink-500 hover:text-pink-400 transition-colors disabled:text-slate-500 text-sm"
          >
            {timer > 0 ? `שלח שוב (${timer}s)` : 'שלח שוב'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthPage;