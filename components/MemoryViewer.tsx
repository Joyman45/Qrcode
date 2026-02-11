
import React, { useState } from 'react';
import { MemoryData, THEMES } from '../types';
import { MusicPlayer } from './MusicPlayer';
import { Heart, Stars, Lock, Key, ArrowRight } from 'lucide-react';

interface MemoryViewerProps {
  data: MemoryData;
}

export const MemoryViewer: React.FC<MemoryViewerProps> = ({ data }) => {
  const [isAuthorized, setIsAuthorized] = useState(!data.isPrivate);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [error, setError] = useState(false);
  
  const theme = THEMES[data.theme];

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordAttempt === data.password) {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      // Shake effect or simple red border
    }
  };

  if (!isAuthorized) {
    return (
      <div className={`min-h-screen ${theme.bgColor} flex items-center justify-center p-6`}>
        <div className={`max-w-md w-full ${theme.cardColor} rounded-[2.5rem] shadow-2xl p-10 text-center space-y-8 animate-in zoom-in duration-500`}>
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
            <Lock size={40} />
          </div>
          <div className="space-y-2">
            <h2 className={`text-2xl font-bold ${theme.textColor} arabic`}>هذه الصفحة محمية</h2>
            <p className="text-slate-500 text-sm arabic">يرجى إدخال كلمة المرور لرؤية محتوى الذكرى</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all text-center arabic ${
                  error ? 'border-red-400 bg-red-50' : 'border-slate-100 focus:border-rose-400'
                }`}
                placeholder="كلمة المرور"
                value={passwordAttempt}
                onChange={(e) => setPasswordAttempt(e.target.value)}
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-2 arabic">كلمة المرور غير صحيحة، حاول مجدداً</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
            >
              فتح الذكرى <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bgColor} flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-1000`}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <Stars className="absolute top-10 right-10 text-white/20 animate-pulse" size={40} />
        <Heart className="absolute bottom-10 left-10 text-rose-200/20 animate-bounce" size={60} />
      </div>

      <div className={`max-w-lg w-full ${theme.cardColor} rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-500 border border-white/20`}>
        {data.image && (
          <div className="w-full h-72 overflow-hidden relative group">
            <img 
              src={data.image} 
              alt="Memory" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        )}

        <div className="p-8 text-center relative">
          <h1 className={`${theme.fontClass} text-4xl mb-6 ${theme.textColor} arabic`}>
            {data.title}
          </h1>
          
          <div className="w-12 h-1 bg-rose-200 mx-auto mb-6 rounded-full opacity-50"></div>

          <p className="text-lg leading-relaxed mb-8 italic whitespace-pre-wrap arabic text-slate-700 dark:text-slate-200">
            "{data.message}"
          </p>

          {data.music && (
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700">
              <MusicPlayer src={data.music} autoPlay={data.autoPlayMusic} />
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-sm opacity-50 font-light tracking-widest text-slate-500">
        CREATED WITH MEMORIA
      </p>
    </div>
  );
};
