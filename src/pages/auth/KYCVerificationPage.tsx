import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, Check, Loader2 } from 'lucide-react';

const KYCVerificationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState({
    idFront: null,
    idBack: null,
    selfie: null
  });

  const handleFileUpload = (type: keyof typeof documents) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments(prev => ({
        ...prev,
        [type]: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
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
          אימות זהות
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                s < step ? 'bg-emerald-500' :
                s === step ? 'bg-pink-500' :
                'bg-slate-700'
              }`}>
                {s < step ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white">{s}</span>
                )}
              </div>
              <span className="text-xs text-slate-400 mt-2">
                {s === 1 ? 'תעודת זהות' : s === 2 ? 'סלפי' : 'אישור'}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">העלאת תעודת זהות</h2>
            <p className="text-slate-400">יש להעלות צילום ברור של תעודת הזהות משני הצדדים</p>
            
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <label className="block text-sm text-slate-400 mb-2">צד קדמי</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload('idFront')}
                  className="hidden"
                  id="idFront"
                />
                <label
                  htmlFor="idFront"
                  className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-pink-500/50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-slate-400" />
                  <span className="text-sm text-slate-400">לחץ להעלאת קובץ</span>
                </label>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <label className="block text-sm text-slate-400 mb-2">צד אחורי</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload('idBack')}
                  className="hidden"
                  id="idBack"
                />
                <label
                  htmlFor="idBack"
                  className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-pink-500/50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-slate-400" />
                  <span className="text-sm text-slate-400">לחץ להעלאת קובץ</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!documents.idFront || !documents.idBack}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              המשך
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">העלאת סלפי</h2>
            <p className="text-slate-400">יש להעלות תמונת סלפי ברורה עם תעודת הזהות</p>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload('selfie')}
                className="hidden"
                id="selfie"
              />
              <label
                htmlFor="selfie"
                className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-pink-500/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-slate-400" />
                <span className="text-sm text-slate-400">לחץ להעלאת קובץ</span>
              </label>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!documents.selfie}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              המשך
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">אישור ושליחה</h2>
            <p className="text-slate-400">אנא וודא שכל המסמכים הועלו כראוי</p>

            <div className="space-y-3">
              {Object.entries(documents).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg">
                  <span className="text-slate-400">{key === 'idFront' ? 'תעודת זהות - צד קדמי' : 
                                                    key === 'idBack' ? 'תעודת זהות - צד אחורי' : 'סלפי'}</span>
                  <Check className="w-5 h-5 text-emerald-500" />
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  מאמת...
                </>
              ) : (
                'שלח לאימות'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCVerificationPage;