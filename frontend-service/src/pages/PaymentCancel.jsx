import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center bg-[#0f172a] p-6 min-h-screen">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Animated Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/30 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/30 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50">
            <span className="text-4xl">❌</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Payment Cancelled</h1>
          <p className="text-gray-400 mb-8">
            The payment process was interrupted or cancelled. No charges were made to your account.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate('/payment')}
              className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-purple-500/20 text-white"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 rounded-2xl font-bold text-lg bg-white/5 hover:bg-white/10 transition-all duration-300 text-white border border-white/10"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
