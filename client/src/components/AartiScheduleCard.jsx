import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Clock, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AartiScheduleCard() {
  const { currentTemple, language, speakText } = useApp();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-soft font-devanagari">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E36414] to-[#FB8500] text-white flex items-center justify-center shadow-xs">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {language === 'hi' ? 'दैनिक आरती एवं दर्शन समय सारणी' : 'Daily Aarti & Darshan Schedule'}
            </h3>
            <span className="text-xs text-slate-500">
              {currentTemple.name_hi} • नित्य पूजन समय
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            const list = currentTemple.aarti_timings.map(a => `${a.name_hi} का समय ${a.time} है`).join('. ');
            speakText(`${currentTemple.name_hi} में आरती का समय: ${list}`);
          }}
          className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0F4C5C] text-xs font-bold flex items-center gap-1.5 transition"
          title="Listen Aarti timings"
        >
          <Volume2 className="w-4 h-4 text-[#E36414]" />
          <span className="hidden sm:inline">{language === 'hi' ? 'आरती समय सुनें' : 'Listen'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {currentTemple.aarti_timings.map((aarti, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/90 shadow-xs flex flex-col justify-between hover:border-amber-400 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#5C3D2E]">
                  {aarti.name_hi}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  aarti.status === 'संपन्न'
                    ? 'bg-slate-100 text-slate-600'
                    : aarti.status === 'आगामी'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {aarti.status}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#0F4C5C] tracking-tight">
                {aarti.time}
              </div>
            </div>

            <span className="text-[11px] text-slate-500 mt-2 block">
              {aarti.name_en}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-[#5C3D2E] flex items-center justify-between">
        <span>
          💡 <strong>परामर्श:</strong> वरिष्ठ नागरिकों को महाआरती से 20 मिनट पूर्व सुगम द्वार (गेट 2) पर पहुँचने की सलाह दी जाती है।
        </span>
      </div>
    </div>
  );
}
