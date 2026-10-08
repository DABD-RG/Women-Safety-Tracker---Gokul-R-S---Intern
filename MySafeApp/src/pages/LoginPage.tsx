import React, { useState } from 'react';
import { Eye, EyeOff, HeartPulse } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800 transition-colors duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-md border border-indigo-500/20">
            <HeartPulse className="w-9 h-9 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Woman Safety Tracker
          </h1>
          <p className="text-xs font-black text-slate-400 mt-2 uppercase tracking-wider">
            Access secure telemetry safety dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4.5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4.5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-12 font-semibold"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-650"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-semibold text-left">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-2xl font-black transition-all bg-amber-400 hover:bg-amber-500 text-black text-xs uppercase tracking-wider shadow-md hover:shadow-amber-500/10 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed border border-amber-500/20"
          >
            {isLoading ? 'Verifying Access...' : 'Authenticate Access'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-left">
          <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1.5">
            Local Access
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            Enter your email and any password to authenticate and access the safety dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;