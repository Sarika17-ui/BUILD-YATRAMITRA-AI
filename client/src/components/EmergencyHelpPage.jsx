import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  HeartPulse, 
  Users, 
  Radio, 
  HelpCircle, 
  CheckCircle2, 
  PhoneCall, 
  Volume2, 
  MapPin, 
  ShieldAlert,
  Send,
  Building2,
  Clock
} from 'lucide-react';

export default function EmergencyHelpPage() {
  const { currentTemple, temples, setSelectedTempleId, submitEmergencyAlert, language, speakText } = useApp();
  
  const [category, setCategory] = useState('MEDICAL');
  const [devoteeName, setDevoteeName] = useState('');
  const [phone, setPhone] = useState('');
  const [gateLocation, setGateLocation] = useState('Gate 2 (शंख द्वार के निकट)');
  const [description, setDescription] = useState('');
  const [submittedAlert, setSubmittedAlert] = useState(null);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);

  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  const toggleSiren = () => {
    if (isSirenPlaying) {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch(e){}
      }
      setIsSirenPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 0.35);
        osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.7);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioCtxRef.current = ctx;
        oscRef.current = osc;
        setIsSirenPlaying(true);
      } catch (e) {
        console.warn("Audio siren error:", e);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const alertRecord = submitEmergencyAlert({
      category,
      devoteeName: devoteeName || "श्रद्धालु",
      phone: phone || "Not given",
      gateLocation,
      description
    });
    setSubmittedAlert(alertRecord);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 font-devanagari space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
            आपातकालीन सेवा केंद्र (24x7 Emergency)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
            {language === 'hi' ? 'आपातकालीन सहायता एवं त्वरित राहत' : 'Emergency Assistance & Rapid Response'}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            तबीयत बिगड़ने, अत्यधिक भीड़ दबाव या बिछड़े सदस्य की त्वरित सूचना सीधे मंदिर सुरक्षा नियंत्रण कक्ष को भेजें
          </p>
        </div>

        {/* Temple selection */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-red-200 shadow-xs">
          {temples.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTempleId(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                t.id === currentTemple.id
                  ? 'bg-red-600 text-white'
                  : 'text-slate-600 hover:bg-red-50'
              }`}
            >
              {t.name_hi.split(' ')[1] || t.name_hi}
            </button>
          ))}
        </div>
      </div>

      {/* Prominent SOS Siren & Alert Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-red-300 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white text-red-600 flex items-center justify-center shrink-0 shadow-lg animate-pulse">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-200 block">
              तत्काल सुरक्षा व एम्बुलेंस अलर्ट
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              आपातकाल SOS सायरन
            </h3>
            <p className="text-xs sm:text-sm text-red-100 mt-1">
              अत्यधिक भीड़ में सुरक्षा कर्मियों का तुरंत ध्यान आकर्षित करने हेतु नीचे दिया गया सायरन बटन दबाएं।
            </p>
          </div>
        </div>

        <button
          onClick={toggleSiren}
          className={`w-full md:w-auto px-8 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-2xl active:scale-95 ${
            isSirenPlaying
              ? 'bg-amber-400 text-slate-900 ring-4 ring-amber-200 animate-pulse'
              : 'bg-white text-red-700 hover:bg-red-50'
          }`}
        >
          <Radio className="w-6 h-6 animate-pulse" />
          <span>{isSirenPlaying ? '🚨 सायरन बंद करें (Stop Siren)' : '🔊 सायरन बजाएं (Sound Siren)'}</span>
        </button>
      </div>

      {/* Confirmation Card after submission */}
      {submittedAlert && (
        <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-400 shadow-md animate-fade-in space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-emerald-950">
                आपातकालीन अलर्ट सफलतापूर्वक दर्ज! (Incident #{submittedAlert.id})
              </h3>
              <p className="text-sm text-emerald-800">
                मंदिर सुरक्षा नियंत्रण कक्ष एवं <strong>{submittedAlert.team}</strong> को आपकी स्थिति ({submittedAlert.gateLocation}) भेज दी गई है।
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-xs text-slate-700 flex flex-wrap gap-4">
            <span><strong>स्थान:</strong> {submittedAlert.gateLocation}</span>
            <span><strong>श्रेणी:</strong> {submittedAlert.category}</span>
            <span><strong>समय:</strong> {submittedAlert.time}</span>
            <span><strong>स्थिति:</strong> <span className="text-emerald-700 font-bold">सहायता दल रवाना (Dispatched)</span></span>
          </div>
        </div>
      )}

      {/* Main Form & Category Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            आपातकालीन सहायता अनुरोध फॉर्म (Emergency Report)
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Category selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                सहायता की श्रेणी चुनें (Select Assistance Type):
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'MEDICAL', label: 'चिकित्सा सहायता (Medical Aid)', desc: 'चक्कर, हृदय, चोट, उल्टी', icon: HeartPulse, color: 'text-red-600' },
                  { id: 'CROWD', label: 'भीड़ दबाव (Crowd Surge)', desc: 'कतार में घुटन, अत्यधिक दबाव', icon: Users, color: 'text-amber-600' },
                  { id: 'MISSING', label: 'बिछड़ा सदस्य (Missing Person)', desc: 'बुजुर्ग या बच्चा गुम होना', icon: HelpCircle, color: 'text-blue-600' },
                  { id: 'GENERAL', label: 'सामान्य सुरक्षा (General SOS)', desc: 'चोरी, विवाद, अन्य सहायता', icon: ShieldAlert, color: 'text-teal-600' }
                ].map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-2xl text-left border transition flex flex-col justify-between ${
                        category === cat.id
                          ? 'bg-red-50 border-red-500 ring-2 ring-red-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-5 h-5 ${cat.color}`} />
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{cat.label.split(' ')[0]} {cat.label.split(' ')[1]}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{cat.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  आपका नाम (Your Name):
                </label>
                <input 
                  type="text"
                  required
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  placeholder="उदा. अमित शर्मा"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  संपर्क फोन नंबर (Phone):
                </label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                वर्तमान स्थान / निकटतम गेट (Current Location):
              </label>
              <select
                value={gateLocation}
                onChange={(e) => setGateLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
              >
                <option value="Gate 1 (मुख्य दिग्विजय द्वार कतार)">Gate 1 (मुख्य दिग्विजय द्वार कतार)</option>
                <option value="Gate 2 (शंख द्वार - वरिष्ठ नागरिक सुगम मार्ग)">Gate 2 (शंख द्वार - वरिष्ठ नागरिक सुगम मार्ग)</option>
                <option value="Gate 3 (सागर दर्शन निकासी परिसर)">Gate 3 (सागर दर्शन निकासी परिसर)</option>
                <option value="मंदिर मुख्य गर्भगृह प्रांगण">मंदिर मुख्य गर्भगृह प्रांगण</option>
                <option value="जूता-चप्पल स्टैंड ब्लॉक 'अ'">जूता-चप्पल स्टैंड ब्लॉक 'अ'</option>
                <option value="शीतल जल सेवा केंद्र">शीतल जल सेवा केंद्र</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                स्थिति का संक्षिप्त विवरण (Optional Description):
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="उदा. पिताजी को चक्कर आ रहा है, कृपया व्हीलचेयर और डॉक्टर तुरंत भेजें..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>तुरंत आपातकालीन अलर्ट भेजें (Submit Alert)</span>
            </button>
          </form>
        </div>

        {/* Instant Helplines (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft">
            <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-red-600" />
              <span>सीधे फोन कॉल करें (Direct Helplines)</span>
            </h4>

            <div className="space-y-3 text-xs">
              <a
                href="tel:108"
                className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between hover:bg-red-100 transition group block"
              >
                <div>
                  <span className="font-bold text-sm text-red-900 block">108 आपातकालीन एम्बुलेंस</span>
                  <span className="text-slate-500">निःशुल्क 24 घंटे चिकित्सा वाहन</span>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold">Call 108</span>
              </a>

              <a
                href={`tel:${currentTemple.police_post}`}
                className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between hover:bg-blue-100 transition group block"
              >
                <div>
                  <span className="font-bold text-sm text-blue-900 block">मंदिर पुलिस सुरक्षा बूथ</span>
                  <span className="text-slate-500">{currentTemple.police_post}</span>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-[#0F4C5C] text-white font-bold">Call Police</span>
              </a>

              <a
                href={`tel:${currentTemple.helpline}`}
                className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between hover:bg-amber-100 transition group block"
              >
                <div>
                  <span className="font-bold text-sm text-[#5C3D2E] block">देवस्थान ट्रस्ट कंट्रोल रूम</span>
                  <span className="text-slate-500">{currentTemple.helpline}</span>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-[#E36414] text-white font-bold">Call Trust</span>
              </a>
            </div>
          </div>

          {/* Quick First Aid Post Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-[#E36414] text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">निकटतम प्राथमिक चिकित्सा केंद्र</h4>
                <span className="text-xs text-slate-500">{currentTemple.name_hi}</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 mt-2">
              गेट 2 (शंख द्वार) के पास स्थित ट्रस्ट कार्यालय में डॉक्टर, व्हीलचेयर, ऑक्सीजन सिलिंडर एवं प्राथमिक दवाएं 24 घंटे उपलब्ध हैं।
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
