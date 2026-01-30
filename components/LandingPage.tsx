import React from 'react';
import { Play, Code2, Cpu, Zap, Globe } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-2xl font-bold text-brand-900">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
            <Code2 size={20} />
          </div>
          NanoLang
        </div>
        <div className="flex gap-4">
           <button 
             onClick={toggleLanguage}
             className="flex items-center gap-2 text-slate-600 hover:text-brand-600 font-medium transition-colors"
           >
             <Globe size={20} />
             {language === 'en' ? 'English' : '日本語'}
           </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mt-10">
        <div className="inline-block px-4 py-1.5 bg-brand-100 text-brand-600 rounded-full text-sm font-bold mb-6 animate-fade-in-up">
          {t('heroTag')}
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
          {t('heroTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">{t('heroTitleAccent')}</span>.
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
          {t('heroDesc')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Button onClick={onStart} variant="primary" icon={<Play size={20} />} className="text-lg px-8 py-4">
            {t('startBtn')}
          </Button>
          <Button onClick={() => window.open('https://github.com', '_blank')} variant="secondary" className="text-lg px-8 py-4">
            {t('githubBtn')}
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 w-full mb-20 text-left">
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{t('featExecTitle')}</h3>
            <p className="text-slate-500">{t('featExecDesc')}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{t('featTranspileTitle')}</h3>
            <p className="text-slate-500">{t('featTranspileDesc')}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
              <Code2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{t('featAiTitle')}</h3>
            <p className="text-slate-500">{t('featAiDesc')}</p>
          </div>
        </div>
      </main>

       <footer className="w-full py-8 text-center text-slate-400 border-t border-slate-200">
        <p>© 2024 NanoLang. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
};