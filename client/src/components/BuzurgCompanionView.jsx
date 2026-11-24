import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Volume2, 
  Mic, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Droplets, 
  Bath, 
  Footprints, 
  Users, 
  HeartHandshake, 
  PhoneCall, 
  Sparkles,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export default function BuzurgCompanionView() {
  const { 
    currentTemple, 
    language, 
    speakText, 
    setIsVoiceModalOpen, 
    setIsSOSOpen, 
    setActiveTab,
    toggleBuzurgMode 
  } = useApp();

  const seniorGate = currentTemple.gates.find(g => g.is_elderly_friendly) || currentTemple.gates[0];
  const water = currentTemple.facilities.find(f => f.type === 'WATER');
  const washroom = currentTemple.facilities.find(f => f.type === 'WASHROOM');
  const shoes = currentTemple.facilities.find(f => f.type === 'SHOES');
  const medical = currentTemple.facilities.find(f => f.type === 'MEDICAL');

  const handleReadFullGreeting = () => {
    const text = `सादर प्रणाम। आप ${currentTemple.name_hi} के परिसर में हैं। दर्शन में इस समय लगभग ${currentTemple.wait_time_minutes} मिनट का समय लग रहा है। आप ${seniorGate.name_hi} से जाएं जहाँ वरिष्ठ नागरिकों हेतु विशेष सुगम मार्ग है। किसी भी सहायता के लिए नीचे दिए गए बड़े माइक बटन को दबाकर बोलें।`;
    speakText(text);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 font-devanagari">
      {/* Elderly Welcome Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-card mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0F4C5C] text-amber-300 flex items-center justify-center shrink-0 shadow-md">
              <HeartHandshake className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-[#0F4C5C] text-white text-xs font-bold uppercase tracking-wider">
                बुजुर्ग साथी मोड (सक्रिय)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#5C3D2E] mt-1">
                प्रणाम! यात्रामित्र आपके साथ है
              </h2>
              <p className="text-base sm:text-lg text-slate-700 font-medium">
                {currentTemple.name_hi} • बड़े बटन दबाएं या आवाज सुनें
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleReadFullGreeting}
              className="px-5 py-3 rounded-2xl bg-[#0F4C5C] hover:bg-[#114B5F] text-white text-base sm:text-lg font-bold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Volume2 className="w-6 h-6 text-amber-300" />
              <span>पूरी बात सुनें</span>
            </button>

            <button
              onClick={toggleBuzurgMode}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 text-sm font-semibold transition"
            >
              सामान्य मोड पर जाएं
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 5 Giant Essential Cards */}
      <div className="space-y-6">
        
        {/* CARD 1: दर्शन का समय व भीड़ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-teal-700 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-teal-50 border-2 border-teal-300 text-[#0F4C5C] flex items-center justify-center shrink-0">
              <Clock className="w-12 h-12" />
            </div>
            <div>
              <span className="text-sm font-bold text-teal-800 uppercase tracking-wider block">
                १. दर्शन में कितना समय लगेगा?
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black text-[#0F4C5C]">
                  {currentTemple.wait_time_minutes}
                </span>
                <span className="text-2xl font-bold text-slate-700">मिनट</span>
                <span className="ml-3 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-sm font-bold">
                  {currentTemple.crowd_status_hi}
                </span>
              </div>
              <p className="text-base text-slate-600 mt-2 font-medium">
                👉 आपके लिए विशेष गेट: <strong className="text-teal-900">{seniorGate.name_hi}</strong> (प्रतीक्षा केवल {seniorGate.wait})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              speakText(`दर्शन में लगभग ${currentTemple.wait_time_minutes} मिनट लगेंगे। बुजुर्गों के लिए ${seniorGate.name_hi} से जाएं जहाँ प्रतीक्षा केवल ${seniorGate.wait} है।`);
            }}
            className="w-full md:w-auto px-6 py-4 rounded-2xl bg-[#0F4C5C] text-white text-lg font-bold flex items-center justify-center gap-3 shadow hover:bg-[#114B5F] active:scale-95 transition"
          >
            <Volume2 className="w-7 h-7 text-amber-300" />
            <span>आवाज में सुनें</span>
          </button>
        </div>

        {/* CARD 2: बोलो यात्रा - वॉयस असिस्टेंट */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-sacred flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0">
              <Mic className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-bold text-amber-200 uppercase tracking-wider block">
                २. आवाज से पूछें (टाइप न करें)
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                बोलो यात्रा - कुछ भी पूछें
              </h3>
              <p className="text-base sm:text-lg text-amber-100 mt-1 font-medium">
                बड़ा माइक दबाकर कहें: "शौचालय कहाँ है?", "पानी कहाँ है?", "आरती का समय क्या है?"
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="w-full md:w-auto px-8 py-5 rounded-2xl bg-white text-[#C84C04] hover:bg-amber-50 text-xl font-black flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition"
          >
            <Mic className="w-8 h-8 text-[#E36414]" />
            <span>माइक दबाएं और बोलें</span>
          </button>
        </div>

        {/* CARD 3: कहाँ क्या है? (पानी, शौचालय, जूता घर) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm font-bold text-amber-800 uppercase tracking-wider block">
                ३. मुख्य सुविधाएं (कहाँ क्या है?)
              </span>
              <h3 className="text-2xl font-bold text-slate-800">
                पानी, शौचालय एवं जूता स्टैंड
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('facilities')}
              className="text-sm font-bold text-[#0F4C5C] underline"
            >
              सभी सुविधाएं देखें
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {/* Water */}
            <div 
              onClick={() => speakText(`पीने का शीतल पानी ${water?.location_hi || 'पास में'} है। दूरी ${water?.distance_meters || 45} मीटर है।`)}
              className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-blue-500 text-white">
                  <Droplets className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-blue-950">पीने का पानी</h4>
                  <span className="text-sm text-blue-700 font-semibold">{water?.distance_meters || 45} मीटर दूर</span>
                </div>
              </div>
              <p className="text-xs text-slate-600">{water?.location_hi}</p>
              <span className="mt-3 text-xs font-bold text-blue-800 flex items-center gap-1">
                <Volume2 className="w-4 h-4" /> दिशा सुनें
              </span>
            </div>

            {/* Washroom */}
            <div 
              onClick={() => speakText(`शौचालय ${washroom?.location_hi || 'गेट के पास'} है। दूरी ${washroom?.distance_meters || 70} मीटर है। यह बुजुर्गों एवं रैंप के अनुकूल है।`)}
              className="p-5 rounded-2xl bg-teal-50 border-2 border-teal-200 cursor-pointer hover:bg-teal-100 transition flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-teal-600 text-white">
                  <Bath className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-teal-950">शौचालय</h4>
                  <span className="text-sm text-teal-700 font-semibold">{washroom?.distance_meters || 70} मीटर दूर</span>
                </div>
              </div>
              <p className="text-xs text-slate-600">{washroom?.location_hi}</p>
              <span className="mt-3 text-xs font-bold text-teal-800 flex items-center gap-1">
                <Volume2 className="w-4 h-4" /> दिशा सुनें
              </span>
            </div>

            {/* Footwear */}
            <div 
              onClick={() => speakText(`जूता-चप्पल स्टैंड ${shoes?.location_hi || 'प्रवेश द्वार'} पर है। दूरी ${shoes?.distance_meters || 30} मीटर है।`)}
              className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 cursor-pointer hover:bg-amber-100 transition flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-amber-600 text-white">
                  <Footprints className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-amber-950">जूता स्टैंड</h4>
                  <span className="text-sm text-amber-700 font-semibold">{shoes?.distance_meters || 30} मीटर दूर</span>
                </div>
              </div>
              <p className="text-xs text-slate-600">{shoes?.location_hi}</p>
              <span className="mt-3 text-xs font-bold text-amber-800 flex items-center gap-1">
                <Volume2 className="w-4 h-4" /> दिशा सुनें
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: परिवार रक्षक एवं मिलन स्थल */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-300 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 border-2 border-indigo-300 text-indigo-700 flex items-center justify-center shrink-0">
              <Users className="w-12 h-12" />
            </div>
            <div>
              <span className="text-sm font-bold text-indigo-800 uppercase tracking-wider block">
                ४. यदि कोई बिछड़ जाए तो कहाँ मिलें?
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                निर्धारित मिलन स्थल: {currentTemple.safe_meet_points[0]}
              </h3>
              <p className="text-base text-slate-600 mt-1 font-medium">
                परिवार से बिछड़ने पर यहीं बैठें। मंदिर सुरक्षा कर्मी आपको परिवार से मिला देंगे।
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('family')}
            className="w-full md:w-auto px-6 py-4 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white text-lg font-bold flex items-center justify-center gap-2 shadow transition"
          >
            <span>परिवार रक्षक खोलें</span>
          </button>
        </div>

        {/* CARD 5: GIANT UNMISTAKABLE SOS EMERGENCY BUTTON */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-red-300 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white text-red-600 flex items-center justify-center shrink-0 shadow-lg">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <div>
              <span className="text-sm font-black text-red-100 uppercase tracking-widest block">
                ५. आपातकालीन सहायता (तबीयत खराब या खो जाना)
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white mt-1">
                आपातकाल SOS - मदद चाहिए
              </h3>
              <p className="text-base sm:text-lg text-red-100 mt-1 font-semibold">
                डॉक्टर, एम्बुलेंस (108) एवं सुरक्षा दल को तुरंत बुलाने के लिए यह लाल बटन दबाएं
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSOSOpen(true)}
            className="w-full md:w-auto px-10 py-5 rounded-2xl bg-white text-red-700 hover:bg-red-50 text-2xl font-black shadow-2xl active:scale-95 transition"
          >
            🚨 SOS मदद दबाएं
          </button>
        </div>

      </div>
    </div>
  );
}
