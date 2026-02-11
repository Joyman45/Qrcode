
export interface MemoryData {
  title: string;
  message: string;
  image: string | null; // Base64
  music: string | null; // Base64 or URL
  theme: 'romantic' | 'friendly' | 'elegant' | 'modern';
  createdAt: number;
  isPrivate: boolean;
  password?: string;
  autoPlayMusic: boolean;
}

export interface ThemeConfig {
  bgColor: string;
  cardColor: string;
  accentColor: string;
  textColor: string;
  fontClass: string;
}

export const THEMES: Record<MemoryData['theme'], ThemeConfig> = {
  romantic: {
    bgColor: 'bg-rose-50',
    cardColor: 'bg-white',
    accentColor: 'rose-500',
    textColor: 'text-rose-900',
    fontClass: 'font-cursive'
  },
  friendly: {
    bgColor: 'bg-yellow-50',
    cardColor: 'bg-white',
    accentColor: 'amber-500',
    textColor: 'text-amber-900',
    fontClass: 'font-sans'
  },
  elegant: {
    bgColor: 'bg-slate-900',
    cardColor: 'bg-slate-800',
    accentColor: 'indigo-400',
    textColor: 'text-slate-100',
    fontClass: 'font-serif'
  },
  modern: {
    bgColor: 'bg-cyan-50',
    cardColor: 'bg-white',
    accentColor: 'cyan-600',
    textColor: 'text-slate-800',
    fontClass: 'font-sans'
  }
};
