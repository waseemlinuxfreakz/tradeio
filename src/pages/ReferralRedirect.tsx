import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ReferralRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');
  console.log("The searchParams ====>", searchParams)
  useEffect(() => {
    if (refCode) {
      navigate(`/register?ref=${refCode}`, { replace: true });
    } else {
      navigate('/register', { replace: true });
    }
  }, [refCode, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default ReferralRedirect;