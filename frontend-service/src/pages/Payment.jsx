import React, { useState } from 'react';
import { paymentHttp } from '../lib/api';
import Navbar from "../components/GlobalComponent/Navbar";
import Footer from "../components/GlobalComponent/Footer";
const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('49.99');
  const [email, setEmail] = useState('coderpawan24@gmail.com');
  const [phone, setPhone] = useState('+917740073757');

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Initiate real Stripe payment
      const res = await paymentHttp.post('/api/pay', {
        amount: parseFloat(amount),
        currency: 'USD',
        customerEmail: email,
        whatsappTo: phone
      });
      
      const { checkoutUrl, sessionId } = res.data;
      console.log('Stripe Session Created:', sessionId);

      // 2. Redirect to Stripe Checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Payment Error:', err);
      setLoading(false);
      alert('Payment Failed. Check if payment-service is running and Stripe keys are valid.');
    }
  };

  return (
    <section className="py-24 min-h-screen flex flex-col bg-[#0f172a]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Animated Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/30 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/30 blur-3xl rounded-full"></div>

          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Upgrade to Pro</h1>
            <p className="text-gray-400 mb-8">Unlock exclusive features and premium support.</p>

            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Amount</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border-b border-purple-500/50 text-right text-white font-bold w-24 outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-b border-purple-500/50 text-right text-white text-sm w-48 outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">WhatsApp</span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent border-b border-purple-500/50 text-right text-white text-sm w-48 outline-none focus:border-purple-500"
                />
              </div>
              <div className="h-px bg-white/10 mb-4"></div>
              <ul className="text-left text-sm text-gray-400 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Unlimited Projects
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Priority Support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Private Repos
                </li>
              </ul>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20 text-white"
              }`}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>

            <p className="mt-4 text-xs text-gray-500">
              Secure 256-bit SSL Encrypted Payment
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Payment;
