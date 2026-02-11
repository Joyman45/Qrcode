
import React, { useState, useEffect } from 'react';
import { MemoryData } from './types';
import { MemoryEditor } from './components/MemoryEditor';
import { MemoryViewer } from './components/MemoryViewer';
import { QRDisplay } from './components/QRDisplay';
import { Heart } from 'lucide-react';

// UTF-8 safe Base64 encoding/decoding helper functions
const toBase64 = (str: string) => {
  const bytes = new TextEncoder().encode(str);
  let binString = "";
  bytes.forEach((b) => binString += String.fromCharCode(b));
  return btoa(binString);
};

const fromBase64 = (str: string) => {
  try {
    const binString = atob(str);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    return null;
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'edit' | 'qr' | 'view'>('edit');
  const [memoryData, setMemoryData] = useState<MemoryData | null>(null);
  const [shareUrl, setShareUrl] = useState('');

  // Handle routing based on URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const decodedStr = fromBase64(hash);
        if (decodedStr) {
          try {
            const decoded = JSON.parse(decodedStr);
            setMemoryData(decoded);
            setView('view');
          } catch (e) {
            console.error("Invalid memory hash content", e);
          }
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSave = (data: MemoryData) => {
    setMemoryData(data);
    try {
        const jsonStr = JSON.stringify(data);
        const encoded = toBase64(jsonStr);
        const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
        setShareUrl(url);
        setView('qr');
    } catch (e) {
        alert("الملفات كبيرة جداً للتشفير في الرابط المباشر. يرجى استخدام نصوص قصيرة وصور مصغرة.");
        console.error(e);
    }
  };

  if (view === 'view' && memoryData) {
    return <MemoryViewer data={memoryData} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
            <Heart fill="currentColor" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">MEMORIA</span>
        </div>
        {view !== 'edit' && (
          <button 
            onClick={() => { setView('edit'); window.location.hash = ''; }}
            className="text-sm font-semibold text-rose-500 hover:text-rose-600"
          >
            جديد +
          </button>
        )}
      </nav>

      <main className="flex-1 pb-12">
        {view === 'edit' && <MemoryEditor onSave={handleSave} />}
        {view === 'qr' && <QRDisplay url={shareUrl} onBack={() => setView('edit')} />}
      </main>

      <footer className="p-8 text-center border-t border-slate-100">
        <p className="text-xs text-slate-400 font-medium">MADE WITH LOVE • 2024</p>
      </footer>
    </div>
  );
};

export default App;
