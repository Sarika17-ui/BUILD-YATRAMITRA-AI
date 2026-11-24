import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  MapPin,
  Ambulance,
  Radio
} from 'lucide-react';

export default function EmergencySOSModal() {
  const { isSOSOpen, setIsSOSOpen, currentTemple, language, speakText, stopSpeaking } = useApp();
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  // Stop siren when modal closes
  useEffect(() => {
    if (!isSOSOpen) {
      stopSiren();
      setSosSent(false);
    } else {
      // Trigger API SOS log and calming voice reassurance
      triggerSOSDispatch();
    }
    return () => stopSiren();
  }, [isSOSOpen]);

  const triggerSOSDispatch = () => {
    setSosSent(true);
    fetch('/api/emergency/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templeId: currentTemple.id,
        userName: "श्रद्धालु / Devotee",
        location: "मंदिर परिसर कतार",
        type: "MEDICAL_OR_CROWD_DISTRESS"
      })
    }).catch(() => {});

    const reassurance = language === 'hi'
      ? `आपातकालीन सहायता सक्रिय। घबराएं नहीं। मंदिर सुरक्षा दल एवं मेडिकल टीम को सूचना भेज दी गई है। प्राथमिक सहायता केंद्र गेट 2 पर स्थित है। सहायता हेल्पलाइन 108 या ${currentTemple.helpline} है।`
      : `Emergency assistance triggered. Do not panic. Security and medical teams have been notified. Nearest aid post is at Gate 2. Helpline: 108 or ${currentTemple.helpline}.`;
    
    speakText(reassurance);
  };

  const toggleSiren = () => {
    if (isSirenOn) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscRef.current = osc;
      setIsSirenOn(true);
    } catch (e) {
      console.warn("AudioContext siren error:", e);
    }
  };

  const stopSiren = () => {
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch(e) {}
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch(e) {}
      audioCtxRef.current = null;
    }
    setIsSirenOn(false);
  };

  if (!isSOSOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fade-in font-devanagari">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-red-500 overflow-hidden flex flex-col">
        {/* Top Emergency Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shadow-lg animate-pulse">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'hi' ? 'आपातकालीन सहायता (SOS)' : 'EMERGENCY SOS ASSISTANCE'}
              </h2>
              <span className="text-xs text-red-100 font-semibold block">
                {currentTemple.name_hi} • 24/7 तुरंत सहायता
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              stopSiren();
              setIsSOSOpen(false);
            }}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
            title="Close SOS"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SOS Body */}
        <div className="p-6 space-y-6 bg-[#FFFDF9]">
          
          {/* Dispatch Notice Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold block">
                {language === 'hi' ? 'सुरक्षा एवं त्वरित राहत दल (QRT) को सूचना भेजी गई!' : 'Security & Quick Response Team Notified!'}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 mt-1">
                {language === 'hi'
                  ? 'कृपया जहाँ हैं वहीं सुरक्षित खड़े रहें। निकटतम सुरक्षा गार्ड आपकी ओर आ रहे हैं।'
                  : 'Please remain where you are. Stationed guards and first-responders are en route.'}
              </p>
            </div>
          </div>

          {/* Siren Alarm Toggle Button */}
          <div className="text-center">
            <button
              onClick={toggleSiren}
              className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-md ${
                isSirenOn
                  ? 'bg-amber-500 text-white ring-4 ring-amber-300 animate-pulse'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-300'
              }`}
            >
              <Radio className="w-6 h-6" />
              <span>{isSirenOn ? '🚨 सायरन ध्वनि बंद करें' : '🔊 आस-पास का ध्यान खींचने हेतु सायरन बजाएं'}</span>
            </button>
          </div>

          {/* Direct Emergency Dials */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500">
              {language === 'hi' ? 'सीधे फोन करें (Direct Helpline Numbers):' : 'Instant Helplines:'}
            </h4>

            {/* Ambulance */}
            <a
              href="tel:108"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-red-500 shadow-xs transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-base text-slate-900 block">
                    108 एम्बुलेंस एवं प्राथमिक उपचार
                  </span>
                  <span className="text-xs text-slate-500">निःशुल्क आपातकालीन चिकित्सा सेवा</span>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-xs">
                Call 108
              </span>
            </a>

            {/* Temple Police Post */}
            <a
              href={`tel:${currentTemple.police_post}`}
              className="flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-500 shadow-xs transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-base text-slate-900 block">
                    मंदिर सुरक्षा नियंत्रण कक्ष
                  </span>
                  <span className="text-xs text-slate-500">फोन: {currentTemple.police_post}</span>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#0F4C5C] text-white text-xs font-bold shadow-xs">
                Call Security
              </span>
            </a>

            {/* Temple Trust Helpline */}
            <a
              href={`tel:${currentTemple.helpline}`}
              className="flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-500 shadow-xs transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-base text-slate-900 block">
                    देवस्थान ट्रस्ट सहायता हेल्पलाइन
                  </span>
                  <span className="text-xs text-slate-500">फोन: {currentTemple.helpline}</span>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-xs">
                Call Trust
              </span>
            </a>
          </div>

          {/* Location Reassurance */}
          <div className="p-3 rounded-xl bg-slate-100 text-slate-700 text-xs flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#E36414] shrink-0" />
            <span>
              निकटतम मेडिकल पोस्ट: <strong>गेट 2 (शंख द्वार) के ठीक पास</strong> (दूरी ~80 मीटर)
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              stopSpeaking();
              stopSiren();
              setIsSOSOpen(false);
            }}
            className="w-full py-3 rounded-2xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-900 transition"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
