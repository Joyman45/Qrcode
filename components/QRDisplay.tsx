
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, ArrowLeft } from 'lucide-react';

interface QRDisplayProps {
  url: string;
  onBack: () => void;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({ url, onBack }) => {
  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      try {
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "memoria-qr-code.png";
        downloadLink.href = pngFile;
        downloadLink.click();
      } catch (e) {
        console.error("QR Code image export failed", e);
      }
    };
    
    // UTF-8 safe Base64 for SVG source
    const bytes = new TextEncoder().encode(svgData);
    let binString = "";
    bytes.forEach((b) => binString += String.fromCharCode(b));
    img.src = "data:image/svg+xml;base64," + btoa(binString);
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Memoria - ذكرى لك',
        text: 'لقد صنعت لك شيئاً مميزاً!',
        url: url,
      }).catch(err => {
        console.error("Web Share failed", err);
        navigator.clipboard.writeText(url);
        alert('تم نسخ الرابط!');
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('تم نسخ الرابط!');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 text-center space-y-8 animate-in zoom-in duration-500">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">جاهز للمشاركة!</h2>
        <div className="bg-slate-50 p-6 rounded-3xl inline-block border-4 border-rose-50">
          <QRCodeSVG 
            id="qr-code-svg"
            value={url} 
            size={200} 
            level="H" 
            includeMargin 
            fgColor="#f43f5e"
          />
        </div>
        
        <p className="text-slate-500 text-sm">امسح الكود لفتح الصفحة الخاصة بك</p>
        
        <div className="flex gap-4">
          <button 
            onClick={downloadQR}
            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
          >
            <Download size={18} /> تحميل الكود
          </button>
          <button 
            onClick={shareLink}
            className="flex-1 bg-rose-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
          >
            <Share2 size={18} /> مشاركة الرابط
          </button>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="text-slate-400 flex items-center gap-2 mx-auto hover:text-slate-600 transition-colors"
      >
        <ArrowLeft size={16} /> العودة للتعديل
      </button>
    </div>
  );
};
