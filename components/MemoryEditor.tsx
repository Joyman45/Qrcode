
import React, { useState } from 'react';
import { MemoryData } from '../types';
import { generateHeartfeltMessage } from '../services/geminiService';
import { Camera, Music, Type, Sparkles, Send, Loader2, Lock, Unlock, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';

interface MemoryEditorProps {
  onSave: (data: MemoryData) => void;
}

export const MemoryEditor: React.FC<MemoryEditorProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<Omit<MemoryData, 'createdAt'>>({
    title: '',
    message: '',
    image: null,
    music: null,
    theme: 'romantic',
    isPrivate: false,
    password: '',
    autoPlayMusic: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'music') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateMessage = async () => {
    if (!formData.title) {
      alert("الرجاء إدخال عنوان أولاً لمساعدتي في كتابة الرسالة");
      return;
    }
    setIsGenerating(true);
    const aiMessage = await generateHeartfeltMessage(formData.title, formData.theme);
    setFormData(prev => ({ ...prev, message: aiMessage }));
    setIsGenerating(false);
  };

  const validateAndSave = () => {
    if (!formData.title || !formData.message) {
      alert("الرجاء ملء العنوان والرسالة على الأقل");
      return;
    }
    if (formData.isPrivate && !formData.password) {
      alert("الرجاء إدخال كلمة مرور للصفحة الخاصة");
      return;
    }
    onSave({ ...formData, createdAt: Date.now() });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">اصنع ذكرى جديدة</h2>
        <p className="text-slate-500">شارك مشاعرك في صفحة خاصة ومميزة</p>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Type size={18} className="text-rose-500" /> عنوان الذكرى
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all arabic"
            placeholder="مثال: عيد ميلاد سعيد يا أغلى الناس"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Sparkles size={18} className="text-rose-500" /> رسالتك
            </label>
            <button 
              onClick={handleGenerateMessage}
              disabled={isGenerating}
              className="text-xs flex items-center gap-1 bg-rose-50 text-rose-600 px-3 py-1 rounded-full hover:bg-rose-100 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              كتابة ذكية
            </button>
          </div>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none h-32 transition-all arabic"
            placeholder="اكتب هنا ما يخطر ببالك..."
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          ></textarea>
        </div>

        {/* Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Camera size={18} className="text-rose-500" /> صورة
            </label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-rose-300 transition-colors">
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'image')} />
              <div className="text-center">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="h-16 w-16 mx-auto rounded-lg object-cover" />
                ) : (
                  <p className="text-xs text-slate-400">اسحب صورة هنا أو اضغط للتحميل</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Music size={18} className="text-rose-500" /> أغنية
            </label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-rose-300 transition-colors">
              <input type="file" accept="audio/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'music')} />
              <div className="text-center">
                {formData.music ? (
                  <div className="space-y-2">
                    <p className="text-xs text-green-500 font-bold">تم اختيار ملف صوتي</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, autoPlayMusic: !prev.autoPlayMusic })); }}
                      className={`text-[10px] flex items-center gap-1 mx-auto px-2 py-1 rounded-full transition-all border ${
                        formData.autoPlayMusic ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {formData.autoPlayMusic ? <Volume2 size={10} /> : <VolumeX size={10} />}
                      {formData.autoPlayMusic ? 'تشغيل تلقائي مفعل' : 'تفعيل التشغيل التلقائي'}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">اختر ملف MP3 مناسب</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Lock size={18} className="text-rose-500" /> إعدادات الخصوصية
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setFormData(prev => ({ ...prev, isPrivate: false }))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all border ${
                !formData.isPrivate 
                  ? 'bg-white text-rose-600 border-rose-200 shadow-sm font-bold' 
                  : 'bg-transparent text-slate-400 border-transparent'
              }`}
            >
              <Unlock size={16} /> عامة
            </button>
            <button
              onClick={() => setFormData(prev => ({ ...prev, isPrivate: true }))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all border ${
                formData.isPrivate 
                  ? 'bg-white text-rose-600 border-rose-200 shadow-sm font-bold' 
                  : 'bg-transparent text-slate-400 border-transparent'
              }`}
            >
              <Lock size={16} /> خاصة
            </button>
          </div>

          {formData.isPrivate && (
            <div className="relative animate-in slide-in-from-top-2 duration-300">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all pr-12 arabic"
                placeholder="أدخل كلمة مرور الصفحة"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}
        </div>

        {/* Theme Select */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">طابع الصفحة</label>
          <div className="flex gap-2">
            {(['romantic', 'friendly', 'elegant', 'modern'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFormData(prev => ({ ...prev, theme: t }))}
                className={`flex-1 py-2 px-3 rounded-lg text-xs capitalize transition-all border ${
                  formData.theme === t 
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-rose-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={validateAndSave}
          className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-600 shadow-lg shadow-rose-200 transform hover:-translate-y-1 transition-all"
        >
          <Send size={20} /> إنشاء ومشاركة
        </button>
      </div>
    </div>
  );
};
