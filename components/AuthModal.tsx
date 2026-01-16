
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock Authentication Logic
    setTimeout(() => {
      if (email === 'admin@electrohub.com' && password === 'admin123') {
        dispatch({
          type: 'SET_USER',
          payload: { id: 'admin-1', name: 'Admin User', email, role: 'admin' }
        });
        onClose();
      } else if (email && password.length >= 6) {
        dispatch({
          type: 'SET_USER',
          payload: { id: 'user-' + Date.now(), name: email.split('@')[0], email, role: 'user' }
        });
        onClose();
      } else {
        setError('Invalid credentials. Use admin@electrohub.com / admin123 or any email with 6+ char password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-bolt-lightning text-sm"></i>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">ElectroHub</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-500 mt-2">{isLogin ? 'Enter your details to access your account' : 'Join our community of tech enthusiasts'}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start space-x-2">
              <i className="fa-solid fa-circle-exclamation mt-1"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Forgot password?</button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                <i className="fa-brands fa-google text-slate-600"></i>
                <span className="text-sm font-bold text-slate-700">Google</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                <i className="fa-brands fa-apple text-slate-600"></i>
                <span className="text-sm font-bold text-slate-700">Apple</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="ml-1 text-blue-600 font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
