import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Volume2, 
  VolumeX, 
  Languages, 
  HeartHandshake, 
  AlertTriangle, 
  MapPin, 
  Compass, 
  Users, 
  Mic, 
  ShieldCheck,
  Building2,
  Ticket,
  Type,
  Home
} from 'lucide-react';

export default function Navbar() {
  const {
    language,
    toggleLanguage,
    isBuzurgMode,
    toggleBuzurgMode,
    fontSize,
    cycleFontSize,
    selectedTempleId,
    setSelectedTempleId,
    currentTemple,
    temples,
    activeTab,
    setActiveTab,
    setIsVoiceModalOpen,
    setIsSOSOpen,
    isSpeaking,
    stopSpeaking,
    speakText
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-sm transition-all duration-200">
      
      {/* Top emergency & accessibility bar */}
      <div className="bg-[#0F4C5C] text-white px-3 sm:px-6 py-1.5 flex items-center justify-between text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="tracking-wide">
            {language === 'hi' ? 'आपकी यात्रा, आपकी भाषा, आपकी सुरक्षा।' : 'Your Pilgrimage, Your Language, Your Safety.'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Font Size Adjuster Button */}
          <button
            onClick={cycleFontSize}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-lg text-xs font-bold transition"
            title="Adjust Font Size (Normal / Large / Extra Large)"
          >
            <Type className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase text-[10px]">
              {fontSize === 'xlarge' ? 'A++' : fontSize === 'large' ? 'A+' : 'A'}
            </span>
          </button>

          {/* Read aloud helper status */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1 bg-amber-500/90 text-white px-2 py-0.5 rounded-full text-xs hover:bg-amber-600 transition"
              title="Stop audio"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'आवाज रोकें' : 'Stop Audio'}</span>
            </button>
          )}

          {/* Quick SOS Trigger in Header */}
          <button
            onClick={() => {
              setActiveTab('emergency');
              setIsSOSOpen(true);
            }}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 rounded-full font-bold text-xs tracking-wider shadow-sm transition animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SOS {language === 'hi' ? 'मदद' : 'HELP'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#0F4C5C] to-[#114B5F] p-0.5 shadow-md flex items-center justify-center text-white ring-2 ring-amber-400/50">
            <span className="text-xl sm:text-2xl font-heading text-amber-300">🕉️</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold font-devanagari tracking-tight text-[#0F4C5C]">
                यात्रामित्र <span className="text-[#E36414]">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-100 text-[#E36414] border border-amber-300">
                सुगम
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {currentTemple?.name_hi?.slice(0, 24)}
            </p>
          </div>
        </div>

        {/* Temple Selector Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#FAF6EE] p-1.5 rounded-2xl border border-amber-200/80">
          {temples.map((t) => {
            const isSelected = t.id === selectedTempleId;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTempleId(t.id);
                  speakText(`${t.name_hi} चुना गया।`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0F4C5C] text-white shadow-sm ring-1 ring-[#0F4C5C]'
                    : 'text-slate-700 hover:bg-amber-100/60'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-slate-400'}`} />
                {language === 'hi' ? t.name_hi.split(' ')[1] || t.name_hi : t.name_en.split(' ')[1] || t.name_en}
              </button>
            );
          })}
        </div>

        {/* Action Controls: Buzurg Mode, Language, Voice */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Buzurg Mode (Elderly Mode) Toggle */}
          <button
            onClick={toggleBuzurgMode}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl font-bold transition-all duration-200 shadow-sm border ${
              isBuzurgMode
                ? 'bg-amber-500 text-white border-amber-600 ring-4 ring-amber-200'
                : 'bg-amber-50 text-[#5C3D2E] border-amber-300 hover:bg-amber-100'
            }`}
            title="Toggle Elderly Friendly Buzurg Mode"
          >
            <HeartHandshake className={`w-5 h-5 ${isBuzurgMode ? 'animate-bounce text-white' : 'text-[#E36414]'}`} />
            <div className="text-left hidden sm:block">
              <span className="block text-xs leading-tight">
                {language === 'hi' ? 'बुजुर्ग मोड' : 'Senior Mode'}
              </span>
              <span className={`text-[9px] block leading-none ${isBuzurgMode ? 'text-amber-100 font-bold' : 'text-slate-500'}`}>
                {isBuzurgMode ? 'सक्रिय है' : 'सरल व बड़े अक्षर'}
              </span>
            </div>
          </button>

          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-[#0F4C5C]" />
            <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Voice Assistant Trigger */}
          <button
            onClick={() => setActiveTab('voice')}
            className="flex items-center gap-1.5 bg-[#E36414] hover:bg-[#C84C04] text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl font-bold text-xs shadow-md hover:shadow-lg transition transform active:scale-95"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">{language === 'hi' ? 'बोलो यात्रा' : 'Voice'}</span>
          </button>
        </div>
      </div>

      {/* Primary Desktop Navigation Bar with 9 Pages */}
      <div className="border-t border-slate-100 bg-[#FAF7F2] overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap">
            
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'landing'
                  ? 'bg-[#0F4C5C] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-[#0F4C5C] hover:bg-amber-100/50'
              }`}
            >
              <span>🚩</span>
              <span>{language === 'hi' ? 'परिचय' : 'Landing'}</span>
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-[#0F4C5C] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-[#0F4C5C] hover:bg-amber-100/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'voice'
                  ? 'bg-[#0F4C5C] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-[#0F4C5C] hover:bg-amber-100/50'
              }`}
            >
              <Mic className="w-4 h-4 text-[#E36414]" />
              <span>{language === 'hi' ? 'बोलो यात्रा' : 'Voice'}</span>
            </button>

            <button
              onClick={() => setActiveTab('darshan')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'darshan'
                  ? 'bg-[#0F4C5C] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-[#0F4C5C] hover:bg-amber-100/50'
              }`}
            >
              <Ticket className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'सुगम दर्शन व टोकन' : 'Smart Darshan'}</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-[#0F4C5C] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-[#0F4C5C] hover:bg-amber-100/50'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>{language === 'hi' ? 'मंदिर गाइड (कहाँ क्या है)' : 'Temple Guide'}</span>
            </button>

            <button
              onClick={() => setActiveTab('saathi')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'saathi'
                  ? 'bg-[#0F4C5C] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-[#0F4C5C] hover:bg-amber-100/50'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>{language === 'hi' ? 'साथी सर्कल (परिवार)' : 'Saathi Circle'}</span>
            </button>

            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'emergency'
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'text-red-700 hover:bg-red-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>{language === 'hi' ? 'आपातकाल SOS' : 'Emergency Help'}</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ml-auto ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-amber-300 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>{language === 'hi' ? 'प्रशासन केंद्र' : 'Admin'}</span>
            </button>

          </nav>
        </div>
      </div>
    </header>
  );
}
