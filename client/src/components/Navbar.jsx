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
  Building2
} from 'lucide-react';

export default function Navbar() {
  const {
    language,
    toggleLanguage,
    isBuzurgMode,
    toggleBuzurgMode,
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

        <div className="flex items-center gap-3">
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
            onClick={() => setIsSOSOpen(true)}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 rounded-full font-bold text-xs tracking-wider shadow-sm transition animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SOS {language === 'hi' ? 'मदद' : 'HELP'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#0F4C5C] to-[#114B5F] p-0.5 shadow-md flex items-center justify-center text-white ring-2 ring-amber-400/50">
            <span className="text-2xl sm:text-3xl font-heading text-amber-300">🕉️</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-devanagari tracking-tight text-[#0F4C5C]">
                यात्रामित्र <span className="text-[#E36414]">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-100 text-[#E36414] border border-amber-300">
                सुगम
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {currentTemple?.name_hi?.slice(0, 26)}
            </p>
          </div>
        </div>

        {/* Temple Selector Pills */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#FAF6EE] p-1.5 rounded-2xl border border-amber-200/80">
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

        {/* Actions & Toggles: Buzurg Mode, Language, Voice */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Buzurg Mode (Elderly Mode) Switch - Big and unmistakable */}
          <button
            onClick={toggleBuzurgMode}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-bold transition-all duration-200 shadow-sm border ${
              isBuzurgMode
                ? 'bg-amber-500 text-white border-amber-600 ring-4 ring-amber-200'
                : 'bg-amber-50 text-[#5C3D2E] border-amber-300 hover:bg-amber-100'
            }`}
            title="Toggle Elderly Friendly Buzurg Mode"
          >
            <HeartHandshake className={`w-5 h-5 ${isBuzurgMode ? 'animate-bounce text-white' : 'text-[#E36414]'}`} />
            <div className="text-left">
              <span className="block text-xs sm:text-sm leading-tight">
                {language === 'hi' ? 'बुजुर्ग मोड' : 'Senior Mode'}
              </span>
              <span className={`text-[10px] block leading-none ${isBuzurgMode ? 'text-amber-100' : 'text-slate-500'}`}>
                {isBuzurgMode ? (language === 'hi' ? 'सक्रिय है' : 'Active') : (language === 'hi' ? 'सरल व बड़े अक्षर' : 'Large & Easy')}
              </span>
            </div>
          </button>

          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition"
            title="Switch Language"
          >
            <Languages className="w-4 h-4 text-[#0F4C5C]" />
            <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Floating/Navbar Voice Button */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#E36414] hover:bg-[#C84C04] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition transform active:scale-95"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">{language === 'hi' ? 'बोलो यात्रा' : 'Voice Guide'}</span>
          </button>
        </div>
      </div>

      {/* Mobile temple selector bar */}
      <div className="flex md:hidden overflow-x-auto py-1.5 px-4 bg-[#FAF6EE] border-t border-amber-200/40 gap-2 no-scrollbar">
        {temples.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTempleId(t.id);
              speakText(`${t.name_hi} चुना गया।`);
            }}
            className={`whitespace-nowrap px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition ${
              t.id === selectedTempleId
                ? 'bg-[#0F4C5C] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-amber-200'
            }`}
          >
            {language === 'hi' ? t.name_hi.split(' ')[1] || t.name_hi : t.name_en.split(' ')[1] || t.name_en}
          </button>
        ))}
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex items-center justify-between overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 sm:space-x-4 py-1.5 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'home'
                ? 'bg-[#0F4C5C]/10 text-[#0F4C5C] font-bold'
                : 'text-slate-600 hover:text-[#0F4C5C]'
            }`}
          >
            🏠 {language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'facilities'
                ? 'bg-[#0F4C5C]/10 text-[#0F4C5C] font-bold'
                : 'text-slate-600 hover:text-[#0F4C5C]'
            }`}
          >
            📍 {language === 'hi' ? 'कहाँ क्या है? (सुविधाएं)' : 'Campus Facilities'}
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'family'
                ? 'bg-[#0F4C5C]/10 text-[#0F4C5C] font-bold'
                : 'text-slate-600 hover:text-[#0F4C5C]'
            }`}
          >
            👨‍👩‍👧‍👦 {language === 'hi' ? 'परिवार रक्षक' : 'Family Companion'}
          </button>

          <button
            onClick={() => setActiveTab('control-room')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'control-room'
                ? 'bg-[#0F4C5C]/10 text-[#0F4C5C] font-bold'
                : 'text-slate-600 hover:text-[#0F4C5C]'
            }`}
          >
            📊 {language === 'hi' ? 'प्रशासन नियंत्रण कक्ष' : 'Control Room'}
          </button>
        </nav>
      </div>
    </header>
  );
}
