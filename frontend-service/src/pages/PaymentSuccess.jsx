import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center bg-[#0f172a] p-6 min-h-screen">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Animated Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-500/30 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/30 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
            <span className="text-4xl">🎉</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase. Your account has been upgraded to Pro. 
            You will receive a confirmation message on WhatsApp and Email shortly if webhook is active.
          </p>

          <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Status</span>
              <span className="text-green-400 text-sm font-bold">Confirmed</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Service</span>
              <span className="text-white text-sm">Portfolio Pro</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-green-500/20 text-white"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
