import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mic, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Users, 
  HeartHandshake, 
  ShieldAlert, 
  MapPin, 
  Volume2, 
  Compass, 
  CheckCircle2, 
  PhoneCall,
  Flame,
  ChevronRight,
  ShieldCheck,
  Radio,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const { 
    language, 
    temples, 
    setSelectedTempleId, 
    setActiveTab, 
    setIsVoiceModalOpen, 
    setIsSOSOpen,
    toggleBuzurgMode,
    speakText 
  } = useApp();

  const handleSelectAndExplore = (templeId) => {
    setSelectedTempleId(templeId);
    setActiveTab('home');
    const temple = temples.find(t => t.id === templeId);
    speakText(`${temple?.name_hi || templeId} चुना गया। दर्शन डैशबोर्ड में आपका स्वागत है।`);
  };

  return (
    <div className="font-devanagari text-slate-800">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6EE] via-[#FFFDF9] to-[#F2ECE1]/50 pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-amber-200/60">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Spiritual Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold shadow-xs mb-6 animate-fade-in">
              <span className="text-base">🚩</span>
              <span>यात्रामित्र AI — भारत का प्रथम तीर्थयात्री साथी</span>
              <span className="text-amber-500">•</span>
              <span className="text-slate-600 font-medium">चार प्रमुख तीर्थों हेतु समर्पित</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-devanagari text-[#0F4C5C] tracking-tight leading-tight sm:leading-tight mb-4">
              {language === 'hi' ? 'आपकी यात्रा, आपकी भाषा, आपकी सुरक्षा।' : 'Your Pilgrimage, Your Language, Your Safety.'}
            </h1>

            {/* Sub-headline / Explanation */}
            <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              {language === 'hi'
                ? 'वरिष्ठ नागरिकों, ग्रामीण परिवारों एवं श्रद्धालुओं के लिए विशेष रूप से डिज़ाइन किया गया वॉयस-फर्स्ट प्लेटफॉर्म। बिना टाइप किए हिंदी में पूछें, भीड़ व प्रतीक्षा समय जानें, परिवार से जुड़े रहें और सुरक्षित दर्शन करें।'
                : 'A voice-first, accessibility-focused pilgrimage companion built for elderly devotees and families. Check crowd waiting times, get spoken Hindi guidance, and stay connected with loved ones.'
              }
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
              <button
                onClick={() => {
                  setActiveTab('home');
                  speakText("यात्रा आरंभ करें। दर्शन डैशबोर्ड में आपका स्वागत है।");
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0F4C5C] hover:bg-[#114B5F] text-white text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{language === 'hi' ? 'यात्रा आरंभ करें' : 'Start Your Journey'}</span>
                <ArrowRight className="w-5 h-5 text-amber-300" />
              </button>

              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E36414] to-[#FB8500] hover:from-[#C84C04] hover:to-[#E36414] text-white text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2.5 animate-pulse-ring"
              >
                <Mic className="w-5 h-5 animate-pulse" />
                <span>{language === 'hi' ? 'बोलो यात्रा (आवाज से पूछें)' : 'Voice Assistant'}</span>
              </button>
            </div>

            {/* Quick feature pill highlights */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>हिंदी वॉयस असिस्टेंट</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>बुजुर्ग साथी मोड (बड़े अक्षर)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>डिजिटल टोकन व कतार</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>परिवार रक्षक व मिलन स्थल</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SELECT YOUR PILGRIMAGE DESTINATION */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-[#5C3D2E] border border-amber-300">
            पवित्र धाम चयन
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0F4C5C] mt-2">
            {language === 'hi' ? 'अपने तीर्थ स्थल का चयन करें' : 'Select Your Pilgrimage Destination'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            प्रत्येक मंदिर की लाइव भीड़, दर्शन प्रतीक्षा समय एवं सुगम प्रवेश की वास्तविक स्थिति
          </p>
        </div>

        {/* 4 Temple Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {temples.map((temple) => (
            <div
              key={temple.id}
              className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image with subtle gradient overlay */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img 
                  src={temple.image} 
                  alt={temple.name_hi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  onError={(e) => {
                    // Graceful fallback gradient if external image fails
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-tr', 'from-[#0F4C5C]', 'to-[#114B5F]');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Live Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-800 shadow-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{temple.crowd_status_hi.split(' ')[0]}</span>
                  </span>
                </div>

                {/* Wait time badge on image */}
                <div className="absolute bottom-3 right-3 text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">दर्शन प्रतीक्षा</span>
                  <span className="text-xl font-black text-white">{temple.wait_time_minutes} मिनट</span>
                </div>

                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-xs text-amber-300 font-semibold">{temple.deity.split(' ')[0]}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0F4C5C] leading-snug">
                    {language === 'hi' ? temple.name_hi : temple.name_en}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E36414] shrink-0" />
                    <span>{temple.location_hi}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {language === 'hi' ? temple.short_desc_hi : temple.short_desc_en}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">सुगम गेट</span>
                    <span className="text-xs font-bold text-emerald-700">
                      {temple.gates.find(g => g.is_elderly_friendly)?.name_hi.split(' ')[0] || 'गेट 2'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectAndExplore(temple.id)}
                    className="px-4 py-2 rounded-xl bg-[#0F4C5C] hover:bg-[#114B5F] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <span>{language === 'hi' ? 'दर्शन देखें' : 'Explore'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: HOW YATRAMITRA WORKS */}
      <section className="py-14 sm:py-20 bg-[#FAF6EE] border-y border-amber-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-[#0F4C5C] border border-teal-200">
              सरल एवं सुरक्षित दर्शन प्रक्रिया
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0F4C5C] mt-2">
              {language === 'hi' ? 'यात्रामित्र AI कैसे काम करता है?' : 'How YatraMitra AI Works'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              तीर्थ यात्रा को बिना किसी तकनीकी जटिलता के सहज और तनाव-मुक्त बनाने हेतु 4 सरल चरण
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#E36414] flex items-center justify-center font-black text-2xl mb-4">
                १
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                अपनी भाषा में बोलें (Voice-First)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                फोन में टाइप करने की आवश्यकता नहीं। सिर्फ माइक दबाएं और हिंदी में पूछें—भीड़, कतार, पानी या शौचालय।
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-[#0F4C5C] flex items-center justify-center font-black text-2xl mb-4">
                २
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                लाइव भीड़ व प्रतीक्षा समय
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                एआई-संचालित सटीक प्रतीक्षा समय जानें और सबसे कम भीड़ वाले समय में सुगम दर्शन हेतु योजना बनाएं।
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-2xl mb-4">
                ३
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                बुजुर्ग साथी मोड (Buzurg Mode)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                एक क्लिक में विशाल फॉन्ट, बड़े बटन एवं स्वतः ध्वनि उद्घोषणा सक्रिय करें। वृद्धजनों हेतु विशेष कतार व रैंप।
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-2xl mb-4">
                ४
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                परिवार रक्षक व मिलन स्थल
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                भीड़ में परिवार से बिछड़ने का डर खत्म। 1-क्लिक स्थान शेयर करें और मंदिर के तय मिलन स्थल पर तुरंत पुनः मिलें।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: VOICE ASSISTANT SHOWCASE */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0F4C5C] to-[#0A3A40] text-white rounded-3xl p-8 sm:p-12 shadow-sacred relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-[#0F4C5C] text-xs font-black uppercase tracking-wider">
                🎙️ बोलो यात्रा - भारत की आवाज
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-devanagari text-white leading-tight">
                "मंदिर में कितनी भीड़ है?"<br />
                बस बोलें, यात्रामित्र तुरंत उत्तर देगा।
              </h2>
              <p className="text-sm sm:text-base text-teal-100 leading-relaxed">
                वेब स्पीच एपीआई और वास्तविक मंदिर डेटाबेस से जुड़ा यह असिस्टेंट केवल सामान्य चैटबॉट नहीं है। यह आपको सटीक दूरी, कदम, गेट नंबर और स्वास्थ्य सलाह बोलकर सुनाता है।
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                {["शौचालय कहाँ है?", "पीने का पानी?", "जूता स्टैंड?", "आरती का समय?", "मेडिकल सहायता?"].map((q, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-teal-800/80 border border-teal-600/50 text-amber-200">
                    "{q}"
                  </span>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E36414] to-[#FB8500] hover:from-[#C84C04] hover:to-[#E36414] text-white font-bold text-sm sm:text-base shadow-lg transition flex items-center gap-2"
                >
                  <Mic className="w-5 h-5 animate-pulse" />
                  <span>अभी आवाज से पूछें</span>
                </button>

                <button
                  onClick={() => setActiveTab('voice')}
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition"
                >
                  समर्पित वॉयस पेज देखें
                </button>
              </div>
            </div>

            {/* Interactive Voice Wave Visual Graphic */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E36414] to-[#FB8500] flex items-center justify-center text-white shadow-2xl animate-pulse-ring mb-4">
                <Mic className="w-12 h-12" />
              </div>
              <div className="flex items-center gap-1.5 my-3">
                <span className="w-2 h-6 bg-amber-400 rounded-full wave-bar-1" />
                <span className="w-2 h-10 bg-amber-400 rounded-full wave-bar-2" />
                <span className="w-2 h-7 bg-amber-400 rounded-full wave-bar-3" />
                <span className="w-2 h-12 bg-amber-400 rounded-full wave-bar-4" />
                <span className="w-2 h-5 bg-amber-400 rounded-full wave-bar-5" />
              </div>
              <span className="text-xs font-bold text-amber-300">
                Web Speech API (hi-IN) सक्रिय
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: BUZURG MODE & SMART SAFETY */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-white to-[#FAF6EE] border-b border-amber-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Buzurg Mode feature */}
            <div className="bg-amber-50/90 rounded-3xl p-8 border-2 border-amber-300 shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-[#0F4C5C] text-amber-300 flex items-center justify-center shadow-md mb-4">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                वरिष्ठ नागरिकों हेतु सुगम सेवा
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#5C3D2E] mt-1 mb-3">
                बुजुर्ग साथी मोड (Buzurg Mode)
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                अतिरिक्त बड़े अक्षर, न्यूनतम विकल्प, 68px+ बड़े टच बटन, स्वतः आवाज सहायता एवं विशाल SOS आपातकालीन बटन ताकि वरिष्ठ जन बिना किसी सहारे के आत्मनिर्भर होकर दर्शन कर सकें।
              </p>

              <button
                onClick={toggleBuzurgMode}
                className="px-6 py-3.5 rounded-2xl bg-[#0F4C5C] text-white font-bold text-sm sm:text-base shadow transition hover:bg-[#114B5F] flex items-center gap-2"
              >
                <span>बुजुर्ग साथी मोड चालू करें</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>

            {/* Smart Safety & SOS */}
            <div className="bg-rose-50/90 rounded-3xl p-8 border-2 border-red-300 shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md mb-4">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                आपदा व चिकित्सा सुरक्षा
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-3">
                त्वरित आपातकालीन सहायता (SOS)
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                तबीयत बिगड़ने, भीड़ में दबने या बिछड़ने पर 1-क्लिक अलर्ट मंदिर नियंत्रण कक्ष एवं त्वरित राहत दल (QRT) को संदेश भेजता है। साथ ही तेज सायरन बजाकर आस-पास का ध्यान खींचता है।
              </p>

              <button
                onClick={() => setIsSOSOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-red-600 text-white font-bold text-sm sm:text-base shadow-md transition hover:bg-red-700 flex items-center gap-2"
              >
                <span>आपातकालीन SOS इंटरफेस देखें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#FAF6EE] border-t border-amber-200 text-slate-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🕉️</span>
              <div>
                <span className="text-xl font-bold font-devanagari text-[#0F4C5C]">
                  यात्रामित्र <span className="text-[#E36414]">AI</span>
                </span>
                <p className="text-xs text-slate-500 font-medium">
                  आपकी यात्रा, आपकी भाषा, आपकी सुरक्षा।
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              तीर्थस्थलों में सुगम दर्शन, भीड़ प्रबंधन, वरिष्ठ नागरिक देखभाल और वॉयस-फर्स्ट मार्गदर्शिका हेतु समर्पित डिजिटल सेवा।
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              समर्पित तीर्थ धाम
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li onClick={() => handleSelectAndExplore('somnath')} className="cursor-pointer hover:text-[#0F4C5C]">
                • श्री सोमनाथ ज्योतिर्लिंग
              </li>
              <li onClick={() => handleSelectAndExplore('dwarka')} className="cursor-pointer hover:text-[#0F4C5C]">
                • श्री द्वारकाधीश मंदिर
              </li>
              <li onClick={() => handleSelectAndExplore('ambaji')} className="cursor-pointer hover:text-[#0F4C5C]">
                • श्री अम्बाजी शक्तिपीठ
              </li>
              <li onClick={() => handleSelectAndExplore('pavagadh')} className="cursor-pointer hover:text-[#0F4C5C]">
                • श्री महाकाली माताजी, पावागढ़
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              त्वरित सहायता संपर्क
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <p>🚑 एम्बुलेंस: <strong className="text-red-600 font-bold">108</strong></p>
              <p>👮 पुलिस सहायता: <strong className="text-[#0F4C5C] font-bold">112</strong></p>
              <p>📞 सोमनाथ ट्रस्ट: 02876-231200</p>
              <p>📞 द्वारका देवस्थान: 02892-234080</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>© 2026 YatraMitra AI. Built for Devotees, Families & Temple Authorities.</span>
          <span>सुगम भारत अभियान एवं डिजिटल तीर्थयात्रा पहल</span>
        </div>
      </footer>

    </div>
  );
}
