import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import { api } from '../utils/api'
import { showToast } from '../components/Toast'

export default function AuthPage({ onAuth }) {
  const [view, setView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return ['login', 'signup', 'forgot'].includes(params.get('view')) ? params.get('view') : 'login';
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view') || 'login';
      setView(['login', 'signup', 'forgot'].includes(v) ? v : 'login');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateView = useCallback((v) => {
    const currentView = new URLSearchParams(window.location.search).get('view') || 'login';
    if (v === currentView) return;
    const url = v === 'login' ? window.location.pathname : `${window.location.pathname}?view=${v}`;
    window.history.pushState({ ...window.history.state }, '', url);
    setView(v);
  }, []);

  async function handleLogin(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const emailInput = fd.get('email').trim()
    const email      = emailInput.includes('@') ? emailInput.toLowerCase() : emailInput
    const password   = fd.get('password')
    setLoading(true)
    try {
      const data = await api.login(email, password)
      localStorage.setItem('skillbite_token', data.token)
      onAuth({ name: data.name, email: data.email })
      showToast(`Welcome back, ${data.name.split(' ')[0]}!`, 'success')
    } catch (err) {
      showToast(err.message || 'Invalid email/username or password', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const name     = fd.get('name').trim()
    const email    = fd.get('email').trim().toLowerCase()
    const password = fd.get('password')
    setLoading(true)
    try {
      const data = await api.signup(name, email, password)
      localStorage.setItem('skillbite_token', data.token)
      onAuth({ name: data.name, email: data.email })
      showToast("Account created — you're in!", 'success')
    } catch (err) {
      showToast(err.message || 'Signup failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md relative z-10 mx-auto">
      <div className="glass-card p-8 sm:p-12 space-y-8 w-full border-t border-t-accent-primary/20">

        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-dark-bg border border-accent-border/50 items-center justify-center mb-5 shadow-lg relative group overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-accent-primary/10 group-hover:bg-accent-primary/20 transition-colors duration-500 blur-xl"></div>
            <img src="/skill_bite_logo.png" alt="Skill Bite Logo" className="w-12 h-12 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" />
          </div>
          <h1 className="text-4xl font-black font-poppins tracking-tight glow-text mb-2">Skill Bite</h1>
          <p className="text-sm text-accent-neutral font-inter">Carve your path · Daily mastery</p>
        </div>

        {/* Login */}
        {view === 'login' && (
          <div>
            <h2 className="text-xl font-bold text-accent-light mb-6 text-center">Welcome Back</h2>
            <form onSubmit={handleLogin} className="space-y-4 flex flex-col" autoComplete="off">
              <div className="space-y-1.5 flex flex-col text-left">
                <label className="text-[11px] uppercase tracking-widest text-accent-neutral font-bold pl-1">Email / Reg. Number</label>
                <input name="email" type="text" required autoComplete="new-password"
                  className="w-full bg-dark-bg/50 border border-accent-border rounded-xl px-4 py-3.5 text-accent-light placeholder-accent-neutral/40 glow-focus transition-all text-sm outline-none" 
                  placeholder="University Email or Reg. Number" />
              </div>
              <div className="space-y-1.5 flex flex-col text-left">
                <label className="text-[11px] uppercase tracking-widest text-accent-neutral font-bold pl-1">Password</label>
                <input name="password" type="password" required minLength={4} autoComplete="new-password"
                  className="w-full bg-dark-bg/50 border border-accent-border rounded-xl px-4 py-3.5 text-accent-light placeholder-accent-neutral/40 glow-focus transition-all text-sm outline-none" 
                  placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 mt-4 bg-accent-primary hover:bg-accent-secondary text-dark-bg rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <div className="flex flex-col items-center gap-4 mt-8">
              <button type="button" onClick={() => navigateView('forgot')}
                className="text-sm text-accent-neutral font-semibold hover:text-accent-secondary transition-colors glow-text">
                Forgot password?
              </button>
              <p className="text-center text-sm text-accent-neutral">
                New here?{' '}
                <button type="button" onClick={() => navigateView('signup')}
                  className="text-accent-primary font-semibold hover:text-accent-secondary transition-colors glow-text">Create account</button>
              </p>
            </div>
          </div>
        )}

        {/* Signup */}
        {view === 'signup' && (
          <div>
            <h2 className="text-xl font-bold text-accent-light mb-6 text-center">Join the Journey</h2>
            <form onSubmit={handleSignup} className="space-y-4 flex flex-col">
              <div className="space-y-1.5 flex flex-col text-left">
                <label className="text-[11px] uppercase tracking-widest text-accent-neutral font-bold pl-1">Name</label>
                <input name="name" type="text" required autoComplete="name"
                  className="w-full bg-dark-bg/50 border border-accent-border rounded-xl px-4 py-3.5 text-accent-light placeholder-accent-neutral/40 glow-focus transition-all text-sm outline-none" 
                  placeholder="Your name" />
              </div>
              <div className="space-y-1.5 flex flex-col text-left">
                <label className="text-[11px] uppercase tracking-widest text-accent-neutral font-bold pl-1">Email</label>
                <input name="email" type="email" required autoComplete="email"
                  className="w-full bg-dark-bg/50 border border-accent-border rounded-xl px-4 py-3.5 text-accent-light placeholder-accent-neutral/40 glow-focus transition-all text-sm outline-none" 
                  placeholder="you@company.com" />
              </div>
              <div className="space-y-1.5 flex flex-col text-left">
                <label className="text-[11px] uppercase tracking-widest text-accent-neutral font-bold pl-1">Password</label>
                <input name="password" type="password" required minLength={4} autoComplete="new-password"
                  className="w-full bg-dark-bg/50 border border-accent-border rounded-xl px-4 py-3.5 text-accent-light placeholder-accent-neutral/40 glow-focus transition-all text-sm outline-none" 
                  placeholder="Min 4 characters" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 mt-4 bg-accent-primary hover:bg-accent-secondary text-dark-bg rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </form>
            <p className="text-center text-sm text-accent-neutral mt-8">
              Already have an account?{' '}
              <button type="button" onClick={() => navigateView('login')}
                className="text-accent-primary font-semibold hover:text-accent-secondary transition-colors glow-text">Log in</button>
            </p>
          </div>
        )}

        {/* Forgot Password */}
        {view === 'forgot' && (
          <div>
            <h2 className="text-xl font-bold text-accent-light mb-6 text-center">Reset Password</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              showToast('Password reset link sent to your email', 'success');
              navigateView('login');
            }} className="space-y-4 flex flex-col">
              <div className="space-y-1.5 flex flex-col text-left">
                <label className="text-[11px] uppercase tracking-widest text-accent-neutral font-bold pl-1">Email</label>
                <input name="email" type="email" required
                  className="w-full bg-dark-bg/50 border border-accent-border rounded-xl px-4 py-3.5 text-accent-light placeholder-accent-neutral/40 glow-focus transition-all text-sm outline-none" 
                  placeholder="University Email or Reg. Number" />
              </div>
              <button type="submit"
                className="w-full py-4 mt-4 bg-accent-primary hover:bg-accent-secondary text-dark-bg rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                Send Reset Link
              </button>
            </form>
            <div className="flex justify-center mt-6">
              <button type="button" onClick={() => navigateView('login')}
                className="flex items-center gap-2 text-sm font-semibold text-accent-neutral hover:text-white transition-colors">
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
