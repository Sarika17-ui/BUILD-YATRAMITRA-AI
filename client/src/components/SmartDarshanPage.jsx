import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Ticket, 
  Users, 
  Clock, 
  CheckCircle2, 
  QrCode, 
  Printer, 
  Volume2, 
  ShieldCheck, 
  HeartHandshake, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function SmartDarshanPage() {
  const { 
    currentTemple, 
    temples, 
    setSelectedTempleId, 
    tokens, 
    activeToken, 
    setActiveToken, 
    registerDigitalToken, 
    language, 
    speakText 
  } = useApp();

  const [devoteeName, setDevoteeName] = useState('');
  const [phone, setPhone] = useState('');
  const [devoteeCount, setDevoteeCount] = useState(2);
  const [isSenior, setIsSenior] = useState(true);
  const [slotTime, setSlotTime] = useState('11:30 AM - 12:00 PM (मध्याह्न दर्शन)');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!devoteeName.trim()) return;

    const token = registerDigitalToken({
      devoteeName,
      phone: phone || "+91 98765 00000",
      devoteeCount,
      isSenior,
      slotTime
    });

    setIsSuccess(true);
    setDevoteeName('');
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const handleSpeakToken = (tok) => {
    const text = `आपका ई-दर्शन टोकन नंबर ${tok.tokenNumber} है। श्रद्धालु नाम: ${tok.devoteeName}। कतार में आपसे आगे ${tok.queuePosition} श्रद्धालु हैं। अनुमानित प्रतीक्षा समय ${tok.estWaitMinutes} मिनट है। कृपया ${tok.gate} पर रिपोर्ट करें।`;
    speakText(text);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 font-devanagari space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            डिजिटल कतार व टोकन सेवा
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F4C5C] mt-1">
            {language === 'hi' ? 'सुगम दर्शन एवं ई-टोकन पंजीयन' : 'Smart Darshan & Digital Queue'}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            लंबी लाइनों में घंटों खड़े रहने से बचें। डिजिटल टोकन लें और अपने निर्धारित समय पर सुगम दर्शन करें।
          </p>
        </div>

        {/* Temple Selector Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-amber-200 shadow-xs">
          {temples.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTempleId(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                t.id === currentTemple.id
                  ? 'bg-[#0F4C5C] text-white'
                  : 'text-slate-600 hover:bg-amber-50'
              }`}
            >
              {t.name_hi.split(' ')[1] || t.name_hi}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Queue Progress Summary Card */}
      <div className="bg-gradient-to-r from-[#0F4C5C] to-[#114B5F] text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-300 block">
            वर्तमान कतार स्थिति • {currentTemple.name_hi}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mt-1">
            {currentTemple.crowd_status_hi} (प्रतीक्षा ~{currentTemple.wait_time_minutes} मिनट)
          </h3>
          <p className="text-xs sm:text-sm text-teal-100 mt-1">
            कतार गति: <strong>3.2 मीटर प्रति मिनट</strong> • वरिष्ठ नागरिकों हेतु <strong>गेट 2 से विशेष सुगम मार्ग</strong>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20">
          <div>
            <span className="text-[11px] text-teal-200 uppercase font-bold block">परिसर भराव</span>
            <span className="text-2xl font-black text-white">{currentTemple.occupancy_pct}%</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <span className="text-[11px] text-teal-200 uppercase font-bold block">अनुमानित कतार</span>
            <span className="text-2xl font-black text-amber-300">~{currentTemple.current_devotees.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Registration Form (7 cols) + Active Token Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Registration Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#E36414] flex items-center justify-center font-bold">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                नया ई-दर्शन टोकन प्राप्त करें
              </h3>
              <p className="text-xs text-slate-500">
                निःशुल्क डिजिटल कतार पास • वरिष्ठ नागरिकों हेतु प्राथमिकता
              </p>
            </div>
          </div>

          {isSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>बधाई हो! आपका डिजिटल टोकन सफलतापूर्वक जनरेट हो गया है। दाईं ओर टोकन विवरण देखें।</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                मुख्य श्रद्धालु का नाम (Devotee Full Name):
              </label>
              <input 
                type="text"
                required
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                placeholder="उदा. रमेश कुमार शर्मा"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  मोबाइल नंबर (Mobile Number):
                </label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  श्रद्धालुओं की संख्या (Devotees Count):
                </label>
                <select
                  value={devoteeCount}
                  onChange={(e) => setDevoteeCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-sm font-medium"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                    <option key={n} value={n}>{n} श्रद्धालु ({n} Person{n > 1 ? 's' : ''})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                पसंदीदा दर्शन समय स्लॉट (Preferred Time Slot):
              </label>
              <select
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-sm font-medium"
              >
                <option value="11:30 AM - 12:00 PM (मध्याह्न दर्शन)">11:30 AM - 12:00 PM (मध्याह्न दर्शन - कम भीड़)</option>
                <option value="12:00 PM - 12:30 PM (राजभोग आरती)">12:00 PM - 12:30 PM (राजभोग आरती स्लॉट)</option>
                <option value="02:00 PM - 02:30 PM (सुगम दोपहर दर्शन)">02:00 PM - 02:30 PM (सुगम दोपहर दर्शन - न्यूनतम प्रतीक्षा)</option>
                <option value="06:30 PM - 07:00 PM (संध्या महाआरती)">06:30 PM - 07:00 PM (संध्या महाआरती स्लॉट)</option>
              </select>
            </div>

            {/* Senior Citizen Priority Checkbox */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
              <input 
                type="checkbox"
                id="seniorCheck"
                checked={isSenior}
                onChange={(e) => setIsSenior(e.target.checked)}
                className="w-5 h-5 text-[#E36414] rounded focus:ring-[#E36414] mt-0.5"
              />
              <label htmlFor="seniorCheck" className="text-xs sm:text-sm text-[#5C3D2E] font-medium cursor-pointer">
                <strong>वरिष्ठ नागरिक / दिव्यांग सदस्य उपस्थित हैं (Senior Citizen Present)</strong>
                <span className="block text-xs text-slate-600 mt-0.5">
                  इसे चुनने पर आपको गेट 2 (शंख द्वार) से व्हीलचेयर सुगम रैंप एवं कतार प्राथमिकता मिलेगी।
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0F4C5C] to-[#114B5F] hover:from-[#0B3844] hover:to-[#0F4C5C] text-white font-bold text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Ticket className="w-5 h-5 text-amber-300" />
              <span>ई-दर्शन टोकन जनरेट करें (Generate Token)</span>
            </button>
          </form>
        </div>

        {/* Active Token Display Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeToken ? (
            <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-card relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-4 border-b border-amber-200">
                <span className="text-xs font-black uppercase tracking-wider text-[#0F4C5C]">
                  🕉️ श्री सोमनाथ ट्रस्ट ई-दर्शन पास
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ● सक्रिय पास
                </span>
              </div>

              {/* Token Number Highlight */}
              <div className="my-5 text-center">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                  टोकन क्रमांक / Token Number
                </span>
                <div className="text-4xl sm:text-5xl font-mono font-black text-[#0F4C5C] tracking-widest mt-1">
                  {activeToken.tokenNumber}
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-1 block">
                  {activeToken.devoteeName} ({activeToken.devoteeCount} सदस्य)
                </span>
              </div>

              {/* Status details */}
              <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-amber-200/80 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">स्लॉट समय:</span>
                  <span className="font-bold text-slate-800">{activeToken.slotTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">कतार में आगे:</span>
                  <span className="font-bold text-[#E36414]">{activeToken.queuePosition} श्रद्धालु</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">अनुमानित प्रतीक्षा:</span>
                  <span className="font-bold text-emerald-700">~{activeToken.estWaitMinutes} मिनट</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">प्रवेश द्वार:</span>
                  <span className="font-bold text-[#0F4C5C]">{activeToken.gate}</span>
                </div>
              </div>

              {/* Visual Simulated QR Code */}
              <div className="my-4 p-3 bg-white rounded-2xl border border-dashed border-slate-300 flex items-center justify-center gap-3">
                <div className="w-16 h-16 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center text-white">
                  <QrCode className="w-12 h-12" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono text-slate-400 block">QR VERIFICATION</span>
                  <span className="text-xs font-bold text-slate-800 block">गेट स्कैनर पर दिखाएं</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">स्कैन के लिए तैयार</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSpeakToken(activeToken)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>टोकन विवरण सुनें</span>
                </button>

                <button
                  onClick={() => window.print?.()}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 hover:bg-slate-50 transition"
                  title="Print Token Pass"
                >
                  <Printer className="w-4 h-4" />
                  <span>प्रिंट</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-8 border border-dashed border-slate-300 text-center text-slate-400">
              <Ticket className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">कोई सक्रिय टोकन नहीं मिला।</p>
              <span className="text-xs">बाईं ओर दिए गए फॉर्म से नया टोकन जनरेट करें।</span>
            </div>
          )}

          {/* Past Tokens List */}
          {tokens.length > 1 && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                आपके हालिया टोकन (Recent Passes)
              </h4>
              <div className="space-y-2">
                {tokens.slice(1, 4).map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setActiveToken(t)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 cursor-pointer flex items-center justify-between transition text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 font-mono block">#{t.tokenNumber}</span>
                      <span className="text-slate-500">{t.devoteeName} ({t.slotTime.split(' ')[0]})</span>
                    </div>
                    <span className="text-emerald-700 font-bold">सक्रिय</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
