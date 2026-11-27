import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';
import HeroCrowdGauge from './HeroCrowdGauge';
import AartiScheduleCard from './AartiScheduleCard';
import { 
  Megaphone, 
  Volume2, 
  ArrowRight, 
  Ticket, 
  MapPin, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export default function PilgrimHomeDashboard() {
  const {
    currentTemple,
    announcements,
    activeToken,
    setActiveTab,
    setIsVoiceModalOpen,
    setIsSOSOpen,
    toggleBuzurgMode,
    speakText
  } = useApp();
  const { language, t } = useLanguage();

  return (
    <div className="font-devanagari space-y-6">
      
      {/* Important Announcements Feed Banner */}
      {announcements.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0 mt-0.5">
                <Megaphone className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E36414]">
                    {t('dashboard.officialNotice')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">({announcements[0].time})</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  {language === 'hi' ? announcements[0].title_hi : announcements[0].title_en}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  {language === 'hi' ? announcements[0].message_hi : announcements[0].message_en}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const text = language === 'hi' 
                  ? `${announcements[0].title_hi}. ${announcements[0].message_hi}` 
                  : `${announcements[0].title_en}. ${announcements[0].message_en}`;
                speakText(text);
              }}
              className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100 text-[#0F4C5C] text-xs font-bold flex items-center gap-1.5 border border-amber-300 shadow-xs transition shrink-0"
              title="Listen announcement"
            >
              <Volume2 className="w-4 h-4 text-[#E36414]" />
              <span>{t('dashboard.listen')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Hero & Live Crowd Status Gauge */}
      <HeroCrowdGauge />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Active Digital Token Widget (if created) */}
        {activeToken && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xl shadow-xs">
                🎟️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    {t('dashboard.tokenActive')}
                  </span>
                  <span className="text-xs text-slate-500">{activeToken.slotTime}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  टोकन #{activeToken.tokenNumber} ({activeToken.devoteeName})
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  कतार में आपकी स्थिति: <strong>{activeToken.queuePosition} श्रद्धालु आगे हैं</strong> • अनुमानित प्रतीक्षा: ~{activeToken.estWaitMinutes} मिनट
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('darshan')}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition"
            >
              {t('dashboard.viewDigitalPass')}
            </button>
          </div>
        )}

        {/* Daily Aarti Schedule */}
        <AartiScheduleCard />

        {/* 4 Feature Action Cards Grid */}
        <div>
          <h3 className="text-xl font-bold text-[#0F4C5C] mb-4">
            {language === 'hi' ? 'सुगम दर्शन व तीर्थ सेवाएं' : 'Pilgrim Services & Navigation'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Smart Darshan / Digital Token */}
            <div 
              onClick={() => setActiveTab('darshan')}
              className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-soft hover:shadow-card cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#E36414] flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Ticket className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">
                  सुगम दर्शन व डिजिटल टोकन
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ई-दर्शन स्लॉट बुक करें, डिजिटल कतार टोकन प्राप्त करें और लंबी लाइनों से बचें।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F4C5C]">
                <span>टोकन बुक करें</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* 2. Temple Guide */}
            <div 
              onClick={() => setActiveTab('guide')}
              className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-soft hover:shadow-card cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#0F4C5C] flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">
                  मंदिर मार्गदर्शिका (कहाँ क्या है?)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  पानी, शौचालय, जूता स्टैंड, व्हीलचेयर व मेडिकल बूथ की सटीक दूरी व कदम।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F4C5C]">
                <span>परिसर मैप देखें</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* 3. Saathi Circle */}
            <div 
              onClick={() => setActiveTab('saathi')}
              className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-soft hover:shadow-card cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">
                  साथी सर्कल (परिवार रक्षक)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  परिवार के सदस्यों की लाइव स्थिति देखें, 1-क्लिक स्थान साझा करें और तय मिलन स्थल पर मिलें।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F4C5C]">
                <span>परिवार से जुड़ें</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* 4. Emergency Help */}
            <div 
              onClick={() => setActiveTab('emergency')}
              className="bg-white rounded-3xl p-5 border border-red-200 shadow-soft hover:shadow-card cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">
                  आपातकालीन सहायता (SOS)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  108 एम्बुलेंस, डॉक्टर, सुरक्षा गार्ड या बिछड़े सदस्य की त्वरित सूचना भेजें।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600">
                <span>मदद मांगें (SOS)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
