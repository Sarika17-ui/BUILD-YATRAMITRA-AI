import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Ticket, Mic, MapPin, AlertTriangle } from 'lucide-react';

export default function MobileBottomNav() {
  const { activeTab, setActiveTab, setIsVoiceModalOpen, setIsSOSOpen, language } = useApp();

  const navItems = [
    { id: 'home', label_hi: 'मुख्य', label_en: 'Home', icon: Home },
    { id: 'darshan', label_hi: 'दर्शन', label_en: 'Darshan', icon: Ticket },
    { id: 'voice', label_hi: 'बोलो', label_en: 'Voice', icon: Mic, highlight: true },
    { id: 'guide', label_hi: 'गाइड', label_en: 'Guide', icon: MapPin },
    { id: 'emergency', label_hi: 'मदद', label_en: 'SOS', icon: AlertTriangle, isAlert: true }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/80 shadow-2xl px-2 py-1.5 flex items-center justify-around font-devanagari select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.highlight) {
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab('voice');
              }}
              className="flex flex-col items-center justify-center -mt-5 relative group"
            >
              <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#E36414] to-[#FB8500] text-white flex items-center justify-center shadow-lg ring-4 ring-white animate-pulse">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-[#E36414] mt-0.5">
                {language === 'hi' ? item.label_hi : item.label_en}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.isAlert) {
                setActiveTab('emergency');
              } else {
                setActiveTab(item.id);
              }
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
              isActive
                ? item.isAlert
                  ? 'text-red-600 font-bold'
                  : 'text-[#0F4C5C] font-bold'
                : item.isAlert
                ? 'text-red-500'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${item.isAlert && isActive ? 'animate-bounce' : ''}`} />
            <span className="text-[10px] tracking-tight mt-0.5">
              {language === 'hi' ? item.label_hi : item.label_en}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
