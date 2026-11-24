import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroCrowdGauge from './components/HeroCrowdGauge';
import BuzurgCompanionView from './components/BuzurgCompanionView';
import TempleFacilitiesGuide from './components/TempleFacilitiesGuide';
import FamilyCompanionView from './components/FamilyCompanionView';
import TempleControlRoomDashboard from './components/TempleControlRoomDashboard';
import AartiScheduleCard from './components/AartiScheduleCard';
import BoloYatraVoiceModal from './components/BoloYatraVoiceModal';
import EmergencySOSModal from './components/EmergencySOSModal';
import { Mic, HeartHandshake, AlertTriangle, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

function MainLayout() {
  const { 
    isBuzurgMode, 
    activeTab, 
    setActiveTab, 
    setIsVoiceModalOpen, 
    setIsSOSOpen, 
    currentTemple,
    language 
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-800 font-devanagari relative">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* If Buzurg Mode is active, provide the accessible simplified elderly companion */}
        {isBuzurgMode ? (
          <BuzurgCompanionView />
        ) : (
          <>
            {activeTab === 'home' && (
              <>
                <HeroCrowdGauge />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 my-8">
                  {/* Aarti Schedule Card */}
                  <AartiScheduleCard />

                  {/* Campus Quick Facilities & Reunion Teaser */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Facilities Teaser */}
                    <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-soft flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
                            परिसर सेवाएं
                          </span>
                          <span className="text-xs text-slate-500">7 आवश्यक सेवाएं</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          कहाँ क्या है? (पीने का पानी, शौचालय, जूता स्टैंड)
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                          परिसर में स्थित सभी सुविधाओं की सटीक दूरी एवं व्हीलचेयर सुगम रैंप की जानकारी।
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab('facilities')}
                        className="py-3 px-4 rounded-2xl bg-[#0F4C5C] hover:bg-[#114B5F] text-white text-sm font-bold flex items-center justify-center gap-2 transition"
                      >
                        <span>सभी सुविधाएं एवं नेविगेशन देखें</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Family Teaser */}
                    <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-soft flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md">
                            परिवार सुरक्षा
                          </span>
                          <span className="text-xs text-slate-500">ग्रुप: YATRA-108</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          परिवार रक्षक - बिछड़ने का डर खत्म
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                          1-क्लिक स्थान साझा करें। मुख्य मिलन स्थल: <strong>{currentTemple.safe_meet_points[0]}</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab('family')}
                        className="py-3 px-4 rounded-2xl bg-indigo-800 hover:bg-indigo-900 text-white text-sm font-bold flex items-center justify-center gap-2 transition"
                      >
                        <span>परिवार रक्षक खोलें</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'facilities' && <TempleFacilitiesGuide />}
            {activeTab === 'family' && <FamilyCompanionView />}
            {activeTab === 'control-room' && <TempleControlRoomDashboard />}
          </>
        )}
      </main>

      {/* Floating Bolo Yatra Voice Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="group flex items-center gap-3 bg-gradient-to-tr from-[#E36414] to-[#FB8500] hover:from-[#C84C04] hover:to-[#E36414] text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-amber-300/40"
          title="Open Bolo Yatra Voice Assistant"
        >
          <Mic className="w-6 h-6 animate-pulse" />
          <span className="text-base font-bold font-devanagari tracking-wide">
            {language === 'hi' ? 'बोलो यात्रा' : 'Bolo Yatra'}
          </span>
        </button>
      </div>

      {/* Global Modals */}
      <BoloYatraVoiceModal />
      <EmergencySOSModal />

      {/* Spiritual & Accessible Footer */}
      <footer className="bg-[#FAF6EE] border-t border-amber-200/80 text-slate-600 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕉️</span>
            <div>
              <span className="font-bold text-base text-[#0F4C5C] block">
                यात्रामित्र AI (YatraMitra AI)
              </span>
              <p className="text-xs text-slate-500">
                आपकी यात्रा, आपकी भाषा, आपकी सुरक्षा।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-600">
            <span>सोमनाथ</span>
            <span>•</span>
            <span>द्वारका</span>
            <span>•</span>
            <span>अम्बाजी</span>
            <span>•</span>
            <span>पावागढ़</span>
          </div>

          <p className="text-xs text-slate-400">
            Designed for elderly accessibility, voice-first pilgrimage guidance, and smart crowd control.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
