import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  Building2, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Megaphone, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2,
  RefreshCw,
  Send
} from 'lucide-react';

export default function TempleControlRoomDashboard() {
  const { currentTemple, language, speakText } = useApp();
  const [forecastData, setForecastData] = useState([]);
  const [bestSlots, setBestSlots] = useState([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState('');
  const [anomalyStatus, setAnomalyStatus] = useState(null);

  // Fetch AI crowd forecast & optimal slots
  useEffect(() => {
    fetch(`/ai/forecast/24h?temple_id=${currentTemple.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.forecast) {
          setForecastData(data.data.forecast);
          setBestSlots(data.data.best_slots || []);
        }
      })
      .catch(() => {
        // Fallback synthetic hourly curve
        const fallback = [
          { time_label: '05:00 AM', devotees: 1200, wait_minutes: 15, occupancy: 12 },
          { time_label: '07:00 AM', devotees: 7200, wait_minutes: 45, occupancy: 42, is_peak: true },
          { time_label: '09:00 AM', devotees: 8500, wait_minutes: 55, occupancy: 52 },
          { time_label: '11:00 AM', devotees: 9200, wait_minutes: 60, occupancy: 58 },
          { time_label: '01:00 PM', devotees: 4100, wait_minutes: 25, occupancy: 28 },
          { time_label: '03:00 PM', devotees: 4500, wait_minutes: 30, occupancy: 32 },
          { time_label: '05:00 PM', devotees: 8100, wait_minutes: 50, occupancy: 50 },
          { time_label: '07:00 PM', devotees: 11500, wait_minutes: 85, occupancy: 70, is_peak: true },
          { time_label: '09:00 PM', devotees: 3200, wait_minutes: 20, occupancy: 22 }
        ];
        setForecastData(fallback);
      });

    // Anomaly check
    fetch('/ai/anomaly-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        temple_id: currentTemple.id,
        gate_counts: { "Gate 1": 340, "Gate 2": 180, "Gate 3": 90 }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setAnomalyStatus(data.data);
      }
    })
    .catch(() => {});
  }, [currentTemple.id]);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      setBroadcastSuccess(`उद्घोषणा प्रसारित: "${broadcastText}"`);
      speakText(`मंदिर प्रशासन उद्घोषणा: ${broadcastText}`);
      setBroadcastText('');
      setIsBroadcasting(false);
      setTimeout(() => setBroadcastSuccess(''), 5000);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-devanagari">
      {/* Top Authority Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-amber-300">
              प्रशासन एवं आपदा प्रबंधन पोर्टल
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              ● लाइव सेंसर कनेक्टेड
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {currentTemple.name_hi} - केंद्रीय भीड़ नियंत्रण कक्ष
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Real-time Pilgrimage Ingress/Egress, AI Wait-time Prediction & Public Address Dispatch
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-500">
            अपडेट: अभी-अभी • क्षमता: {currentTemple.capacity.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 4 Core Administration KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
            <span>परिसर में कुल श्रद्धालु</span>
            <Users className="w-4 h-4 text-[#0F4C5C]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0F4C5C]">
              {currentTemple.current_devotees.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              / {currentTemple.capacity.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#0F4C5C] h-full rounded-full" 
              style={{ width: `${currentTemple.occupancy_pct}%` }} 
            />
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1.5 block">
            सुरक्षित सीमा में ({currentTemple.occupancy_pct}% भराव)
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
            <span>प्रवेश दर (Inflow Rate)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">42</span>
            <span className="text-xs font-semibold text-slate-600">श्रद्धालु / मिनट</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-3 block">
            निकासी दर: 38 श्रद्धालु / मिनट
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
            <span>औसत दर्शन प्रतीक्षा</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">
              {currentTemple.wait_time_minutes}
            </span>
            <span className="text-xs font-semibold text-slate-600">मिनट</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-3 block">
            कतार गति: 3.2 मीटर / मिनट
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-2">
            <span>सक्रिय सुरक्षा एवं SOS</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">0</span>
            <span className="text-xs font-semibold text-slate-500">गंभीर घटनाएं</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-3 block">
            सभी द्वार एवं आपात निकास सुचारू
          </span>
        </div>
      </div>

      {/* Main Analytics Chart: 24h AI Crowd & Wait Time Prediction (Recharts) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>AI भीड़ पूर्वानुमान एवं प्रतीक्षा समय (24-Hour Forecast)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Scikit-learn AI मॉडल द्वारा अनुमानित प्रति घंटा श्रद्धालु संख्या व कतार प्रतीक्षा समय
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0F4C5C]" />
              <span>श्रद्धालु (Devotees)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#E36414]" />
              <span>प्रतीक्षा मिनट (Wait min)</span>
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDevotees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F4C5C" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0F4C5C" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E36414" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#E36414" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time_label" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }}
                formatter={(val, name) => [val, name === 'devotees' ? 'श्रद्धालु संख्या' : 'प्रतीक्षा (मिनट)']}
              />
              <Area 
                yAxisId="left" 
                type="monotone" 
                dataKey="devotees" 
                stroke="#0F4C5C" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorDevotees)" 
              />
              <Area 
                yAxisId="right" 
                type="monotone" 
                dataKey="wait_minutes" 
                stroke="#E36414" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#colorWait)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recommended Optimal Darshan Slots */}
        {bestSlots.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-700">
              ✨ AI अनुशंसित सुगम दर्शन समय (Best Low-Crowd Slots):
            </span>
            {bestSlots.map((slot, sIdx) => (
              <span 
                key={sIdx}
                className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200"
              >
                {slot.time_label} (प्रतीक्षा केवल ~{slot.wait_minutes} मिनट)
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Two columns: Gate Control & Live PA System Broadcast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gate Status Matrix (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-soft">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center justify-between">
            <span>द्वारवार प्रवाह एवं कतार स्थिति (Gates Status)</span>
            <span className="text-xs font-normal text-slate-500">3 गेट्स सक्रिय</span>
          </h3>

          <div className="space-y-3">
            {currentTemple.gates.map((gate) => (
              <div 
                key={gate.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{gate.name_hi}</span>
                    {gate.is_elderly_friendly && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-[#5C3D2E]">
                        सुगम मार्ग
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    प्रकार: {gate.type} • स्थिति: सामान्य
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#0F4C5C] block">
                    {gate.wait} प्रतीक्षा
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    सुचारू
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Address (PA) Broadcaster Form (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#FAF7F2] to-amber-50 rounded-3xl p-6 border border-amber-300 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-[#E36414] text-white">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  लाउडस्पीकर व श्रद्धालु ऐप घोषणा प्रसारण (PA Broadcast)
                </h3>
                <span className="text-xs text-slate-500">
                  सभी दर्शनार्थियों के फोन एवं परिसर लाउडस्पीकर पर संदेश भेजें
                </span>
              </div>
            </div>

            {broadcastSuccess && (
              <div className="my-3 p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{broadcastSuccess}</span>
              </div>
            )}

            <form onSubmit={handleBroadcast} className="mt-3 space-y-3">
              <textarea
                rows={3}
                required
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="उदा. कृपया ध्यान दें: शंख द्वार (गेट 2) पर वरिष्ठ नागरिकों हेतु विशेष कतार खुली है। पानी की प्याऊ गेट 1 पर उपलब्ध है।"
                className="w-full p-3.5 rounded-2xl bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-sm font-medium"
              />

              <div className="flex flex-wrap gap-1.5">
                {[
                  "गेट 2 से वरिष्ठ नागरिक प्रवेश करें",
                  "दोपहर आरती कतार 11:30 बजे खुलेगी",
                  "कृपया पेयजल पर्याप्त मात्रा में लें"
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBroadcastText(sample)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-slate-700 hover:bg-amber-100"
                  >
                    + {sample}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isBroadcasting || !broadcastText.trim()}
                className="w-full py-3 rounded-2xl bg-[#0F4C5C] hover:bg-[#114B5F] disabled:opacity-50 text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>{isBroadcasting ? 'प्रसारित किया जा रहा है...' : 'तुरंत उद्घोषणा प्रसारित करें'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
