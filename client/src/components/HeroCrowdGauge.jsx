import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Clock, 
  Volume2, 
  Mic, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  HeartHandshake,
  CheckCircle2,
  TrendingDown,
  Info
} from 'lucide-react';

export default function HeroCrowdGauge() {
  const { 
    currentTemple, 
    language, 
    isBuzurgMode, 
    speakText, 
    setIsVoiceModalOpen,
    setActiveTab
  } = useApp();

  const [aiForecast, setAiForecast] = useState(null);

  // Fetch AI crowd prediction for current temple
  useEffect(() => {
    fetch(`/ai/predict?temple_id=${currentTemple.id}&hour=${new Date().getHours()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setAiForecast(data.data);
        }
      })
      .catch(() => {
        // Fallback calculation
        setAiForecast(null);
      });
  }, [currentTemple.id]);

  const waitTime = aiForecast?.estimated_wait_time_minutes || currentTemple.wait_time_minutes;
  const occupancyPct = aiForecast?.occupancy_percentage || currentTemple.occupancy_pct;
  const crowdStatusHi = aiForecast?.status_hi || currentTemple.crowd_status_hi;
  const devotees = aiForecast?.predicted_devotees || currentTemple.current_devotees;

  // Senior priority gate
  const seniorGate = currentTemple.gates.find(g => g.is_elderly_friendly) || currentTemple.gates[0];

  const handleReadStatus = () => {
    const text = language === 'hi'
      ? `${currentTemple.name_hi} में इस समय ${crowdStatusHi} है। दर्शन में लगभग ${waitTime} मिनट लगेंगे। वरिष्ठ नागरिकों के लिए ${seniorGate.name_hi} से प्रवेश करें जहाँ प्रतीक्षा केवल ${seniorGate.wait} है।`
      : `Current crowd at ${currentTemple.name_en} is ${currentTemple.crowd_status_en}. Expected wait time is ${waitTime} minutes. For seniors, use ${seniorGate.name_en} with wait time of ${seniorGate.wait}.`;
    speakText(text);
  };

  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:pt-6 sm:pb-12 bg-gradient-to-b from-[#FAF7F2] via-[#FAF6EE] to-[#F2ECE1]/60">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top greeting badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold shadow-xs">
            <span className="text-base">🚩</span>
            <span>{currentTemple.audio_greeting_hi?.split('!')[0] || 'सादर प्रणाम'}!</span>
            <span className="text-amber-500">•</span>
            <span className="text-slate-600 font-normal">{currentTemple.location_hi}</span>
          </div>

          {/* Quick Listen Button */}
          <button
            onClick={handleReadStatus}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-amber-200 text-[#0F4C5C] text-xs sm:text-sm font-semibold shadow-xs transition"
            title="Listen to Crowd Status"
          >
            <Volume2 className="w-4 h-4 text-[#E36414]" />
            <span>{language === 'hi' ? 'स्थिति सुनें' : 'Listen Status'}</span>
          </button>
        </div>

        {/* Temple Title & Deity */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-devanagari text-[#0F4C5C] tracking-tight leading-tight">
            {language === 'hi' ? currentTemple.name_hi : currentTemple.name_en}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl">
            {language === 'hi' ? currentTemple.short_desc_hi : currentTemple.short_desc_en}
          </p>
        </div>

        {/* Hero Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Crowd & Waiting Time Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-amber-200/70 flex flex-col justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute -right-8 -bottom-8 opacity-5 text-slate-800 text-9xl pointer-events-none select-none">
              🕉️
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
                    ● {language === 'hi' ? 'सीधा प्रसारण (LIVE)' : 'REAL-TIME STATUS'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                    {language === 'hi' ? 'दर्शन प्रतीक्षा एवं भीड़ स्थिति' : 'Darshan Wait Time & Crowd Meter'}
                  </h3>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-xl text-xs sm:text-sm font-bold ${
                    occupancyPct > 70 
                      ? 'bg-orange-100 text-[#E36414] border border-orange-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {crowdStatusHi}
                  </span>
                </div>
              </div>

              {/* Big Waiting Time Display */}
              <div className="my-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#FFFDF9] to-[#FAF6EE] border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0F4C5C] text-amber-300 flex items-center justify-center shadow-md">
                    <Clock className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
                      {language === 'hi' ? 'अनुमानित दर्शन प्रतीक्षा' : 'Estimated Darshan Wait'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-[#0F4C5C] tracking-tight">
                        {waitTime}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-700">
                        {language === 'hi' ? 'मिनट' : 'mins'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Occupancy bar */}
                <div className="w-full sm:w-48 text-right sm:text-left">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>{language === 'hi' ? 'परिसर भराव' : 'Occupancy'}</span>
                    <span className="font-bold text-[#0F4C5C]">{occupancyPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        occupancyPct > 75 ? 'bg-red-500' : occupancyPct > 45 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    ~{devotees.toLocaleString('hi-IN')} {language === 'hi' ? 'श्रद्धालु उपस्थित' : 'devotees present'}
                  </span>
                </div>
              </div>

              {/* Senior Citizen Priority Gate Callout */}
              <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-300/80 flex items-start gap-3">
                <HeartHandshake className="w-6 h-6 text-[#E36414] shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold text-[#5C3D2E] block">
                    {language === 'hi' ? 'बुजुर्गों एवं दिव्यांगों हेतु विशेष सलाह:' : 'Senior & Divyang Assistance Tip:'}
                  </span>
                  <p className="text-slate-700 mt-0.5">
                    {language === 'hi'
                      ? `कृपया ${seniorGate.name_hi} का उपयोग करें। यहाँ कतार मुक्त रैंप एवं व्हीलचेयर सुविधा है। प्रतीक्षा केवल ${seniorGate.wait} है!`
                      : `Please proceed to ${seniorGate.name_en}. Step-free ramp and wheelchairs available with only ${seniorGate.wait} wait.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Gate Comparison */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">
                {language === 'hi' ? 'गेटवार प्रतीक्षा:' : 'Gate-wise Wait:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {currentTemple.gates.map((g) => (
                  <span 
                    key={g.id} 
                    className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 ${
                      g.is_elderly_friendly
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {g.name_hi.split(' ')[0]} {g.name_hi.split(' ')[1]}: <span className="font-bold text-[#0F4C5C]">{g.wait}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: "Bolo Yatra" Voice Assistant Launch Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Massive Bolo Yatra Card */}
            <div className="bg-gradient-to-br from-[#0F4C5C] to-[#0A3A40] text-white rounded-3xl p-6 sm:p-7 shadow-sacred border border-teal-700/60 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-[#0F4C5C] text-xs font-black uppercase tracking-wider shadow-xs">
                    {language === 'hi' ? 'आवाज से पूछें' : 'VOICE ASSISTANT'}
                  </span>
                  <span className="text-amber-300 text-xs font-semibold">
                    {language === 'hi' ? 'टाइप करने की जरूरत नहीं' : 'Hands-free Voice'}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-devanagari text-white mb-2">
                  {language === 'hi' ? 'बोलो यात्रा AI' : 'Bolo Yatra Assistant'}
                </h3>
                <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
                  {language === 'hi'
                    ? 'बड़ा माइक बटन दबाएं और हिंदी में कुछ भी पूछें। जैसे: "मंदिर में कितनी भीड़ है?", "शौचालय कहाँ है?", या "पीने का पानी?"'
                    : 'Tap the large microphone and speak naturally in Hindi or English. Connected directly to live temple facts.'
                  }
                </p>
              </div>

              {/* Pulsating Voice Trigger Button */}
              <div className="my-6 flex flex-col items-center justify-center relative z-10">
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="relative group p-6 sm:p-7 rounded-full bg-gradient-to-tr from-[#E36414] to-[#FB8500] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-ring"
                  title="Click to speak with YatraMitra AI"
                >
                  <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
                </button>
                <span className="mt-4 text-xs sm:text-sm font-bold text-amber-200 tracking-wide">
                  {language === 'hi' ? '👉 यहाँ दबाकर बोलें 👈' : '👉 Tap to Speak 👈'}
                </span>
              </div>

              {/* Sample voice chip prompts */}
              <div className="relative z-10 pt-3 border-t border-teal-600/60">
                <span className="text-[11px] text-teal-200 block mb-1.5 font-medium">
                  {language === 'hi' ? 'उदाहरण प्रश्न (क्लिक करें):' : 'Try asking:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "भीड़ कितनी है?",
                    "शौचालय कहाँ है?",
                    "पीने का पानी?",
                    "जूता स्टैंड?"
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsVoiceModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-teal-800/80 hover:bg-teal-700 text-teal-100 text-xs transition border border-teal-600/40"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Aarti Widget */}
            <div className="bg-white rounded-3xl p-5 shadow-soft border border-amber-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#E36414] flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'hi' ? 'दैनिक आरती समय' : 'Daily Aarti Schedule'}
                  </span>
                  <span className="text-base font-bold text-slate-800">
                    {currentTemple.aarti_timings[1]?.name_hi || 'मध्याह्न आरती'} ({currentTemple.aarti_timings[1]?.time || '12:00 PM'})
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  const aartis = currentTemple.aarti_timings.map(a => `${a.name_hi}: ${a.time}`).join(', ');
                  speakText(aartis);
                }}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0F4C5C] transition"
                title="Hear Aarti timings"
              >
                <Volume2 className="w-5 h-5 text-[#E36414]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
