import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import LandingPage from './components/LandingPage';
import PilgrimHomeDashboard from './components/PilgrimHomeDashboard';
import VoiceAssistantPage from './components/VoiceAssistantPage';
import BuzurgCompanionView from './components/BuzurgCompanionView';
import SmartDarshanPage from './components/SmartDarshanPage';
import TempleFacilitiesGuide from './components/TempleFacilitiesGuide';
import FamilyCompanionView from './components/FamilyCompanionView';
import EmergencyHelpPage from './components/EmergencyHelpPage';
import TempleControlRoomDashboard from './components/TempleControlRoomDashboard';
import BoloYatraVoiceModal from './components/BoloYatraVoiceModal';
import EmergencySOSModal from './components/EmergencySOSModal';
import { Mic } from 'lucide-react';

function MainLayout() {
  const { 
    isBuzurgMode, 
    activeTab, 
    setActiveTab, 
    setIsVoiceModalOpen, 
    currentTemple,
    language 
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-800 font-devanagari relative">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-12">
        {/* Render 9 core pages cleanly */}
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'home' && <PilgrimHomeDashboard />}
        {activeTab === 'voice' && <VoiceAssistantPage />}
        {activeTab === 'buzurg' && <BuzurgCompanionView />}
        {activeTab === 'darshan' && <SmartDarshanPage />}
        {activeTab === 'guide' && <TempleFacilitiesGuide />}
        {activeTab === 'saathi' && <FamilyCompanionView />}
        {activeTab === 'emergency' && <EmergencyHelpPage />}
        {activeTab === 'admin' && <TempleControlRoomDashboard />}
      </main>

      {/* Floating Bolo Yatra Voice Assistant Button (hidden on voice page) */}
      {activeTab !== 'voice' && (
        <div className="fixed bottom-18 md:bottom-6 right-5 md:right-6 z-30 flex flex-col items-end gap-3">
          <button
            onClick={() => setActiveTab('voice')}
            className="group flex items-center gap-3 bg-gradient-to-tr from-[#E36414] to-[#FB8500] hover:from-[#C84C04] hover:to-[#E36414] text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-amber-300/40"
            title="Open Bolo Yatra Voice Assistant"
          >
            <Mic className="w-6 h-6 animate-pulse" />
            <span className="text-base font-bold font-devanagari tracking-wide">
              {language === 'hi' ? 'बोलो यात्रा' : 'Bolo Yatra'}
            </span>
          </button>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals for Quick Invocations */}
      <BoloYatraVoiceModal />
      <EmergencySOSModal />
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
