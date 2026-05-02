'use client';

import { useState } from 'react';
import { login } from '../../actions/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#051C30] flex items-center justify-center px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#48ABBF]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#3FE2FF]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#0F314D]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h1 
              style={{ fontFamily: 'var(--font-irish-grover), cursive' }}
              className="text-[#48ABBF] text-4xl mb-2"
            >
              Admin Access
            </h1>
            <p className="text-white/60 text-sm">Please sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2 ml-1">Username</label>
              <input
                type="text"
                name="username"
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#48ABBF]/50 focus:ring-1 focus:ring-[#48ABBF]/50 transition-all"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2 ml-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#48ABBF]/50 focus:ring-1 focus:ring-[#48ABBF]/50 transition-all"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl text-center animate-fadeIn">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#48ABBF] hover:bg-[#3ea0b4] disabled:bg-[#48ABBF]/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#48ABBF]/20 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-white/40 hover:text-[#48ABBF] text-sm transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
