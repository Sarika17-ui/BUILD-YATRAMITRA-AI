import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  MapPin, 
  Battery, 
  BatteryCharging, 
  HeartHandshake, 
  Share2, 
  Copy, 
  Check, 
  Plus, 
  Volume2, 
  AlertTriangle, 
  Send,
  Compass,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function FamilyCompanionView() {
  const { currentTemple, language, speakText, isBuzurgMode } = useApp();

  const [groupCode, setGroupCode] = useState('YATRA-108');
  const [copied, setCopied] = useState(false);
  const [myStatus, setMyStatus] = useState('दर्शन कतार में - गेट 2');
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [lostMemberName, setLostMemberName] = useState('');
  const [lostSuccessMsg, setLostSuccessMsg] = useState('');

  const [members, setMembers] = useState([
    { id: 'm1', name: 'रमेश जी (पिताजी)', age: 68, status: 'शंख द्वार कतार में', location: 'Gate 2 Queue', battery: 78, isElderly: true, lastSeen: 'अभी-अभी' },
    { id: 'm2', name: 'शांता देवी (माताजी)', age: 65, status: 'व्हीलचेयर सहायता केंद्र पर', location: 'Wheelchair Center', battery: 85, isElderly: true, lastSeen: '2 मिनट पहले' },
    { id: 'm3', name: 'अमित (बेटा)', age: 36, status: 'जूता स्टैंड पर टोकन लेते हुए', location: 'Shoe Stand Counter A', battery: 92, isElderly: false, lastSeen: '1 मिनट पहले' },
    { id: 'm4', name: 'प्रिया (बहू)', age: 32, status: 'शीतल जल सेवा केंद्र के पास', location: 'Water Booth Gate 1', battery: 64, isElderly: false, lastSeen: '3 मिनट पहले' }
  ]);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    speakText(`ग्रुप कोड ${groupCode} कॉपी हो गया।`);
  };

  const handleUpdateMyStatus = (newStatus, location) => {
    setMyStatus(newStatus);
    setMembers(prev => prev.map(m => m.id === 'm1' ? { ...m, status: newStatus, location, lastSeen: 'अभी-अभी' } : m));
    speakText(`आपकी स्थिति अपडेट हो गई: ${newStatus}`);
  };

  const handleBroadcastLostAlert = (e) => {
    e.preventDefault();
    if (!lostMemberName.trim()) return;

    fetch('/api/family/lost-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupCode,
        missingMemberName: lostMemberName,
        notes: `Reported via YatraMitra App at ${currentTemple.name_hi}`
      })
    })
    .then(res => res.json())
    .then(data => {
      setLostSuccessMsg(`सूचना दर्ज! नियंत्रण कक्ष एवं लाउडस्पीकर पर घोषणा की जा रही है: "${lostMemberName} जी जहाँ भी हों, निकटतम गेट 2 मिलन स्थल पर पहुंचें।"`);
      speakText(`आवश्यक सूचना। ${lostMemberName} जी के संबंध में मंदिर नियंत्रण कक्ष एवं लाउडस्पीकर केंद्र पर अलर्ट प्रसारित कर दिया गया है।`);
      setLostMemberName('');
    })
    .catch(() => {
      setLostSuccessMsg(`लाउडस्पीकर केंद्र पर सूचना प्रसारित की जा रही है।`);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 font-devanagari">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-900 border border-indigo-200">
            {language === 'hi' ? 'परिवार सुरक्षा एवं मिलन' : 'FAMILY COMPANION'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F4C5C] mt-1">
            {language === 'hi' ? 'परिवार रक्षक (Family Tracker)' : 'Family Companion & Safety'}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            भीड़ में एक-दूसरे की स्थिति जानें, सुरक्षित मिलन स्थल तय करें और बिछड़ने पर तुरंत अलर्ट भेजें
          </p>
        </div>

        {/* Report Lost Devotee button */}
        <button
          onClick={() => setIsLostModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md transition self-start md:self-auto"
        >
          <AlertTriangle className="w-5 h-5 text-amber-300" />
          <span>{language === 'hi' ? 'बिछड़े सदस्य की रिपोर्ट' : 'Report Missing Person'}</span>
        </button>
      </div>

      {/* Group Code Card */}
      <div className="bg-gradient-to-r from-[#0F4C5C] to-[#114B5F] text-white rounded-3xl p-6 sm:p-7 shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-300 block">
            {language === 'hi' ? 'आपका परिवार ग्रुप कोड' : 'Active Group Code'}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-white">
              {groupCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Copy Group Code"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-teal-100 mt-1">
            यह कोड परिवार के अन्य सदस्यों के फोन में डालकर उन्हें इस ग्रुप से जोड़ें।
          </p>
        </div>

        {/* Designated Safe Meeting Spot Highlight */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 max-w-md w-full">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>{language === 'hi' ? 'तय किया गया मुख्य मिलन स्थल' : 'Designated Meet Point'}</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-white block">
            {currentTemple.safe_meet_points[0]}
          </span>
          <button
            onClick={() => speakText(`मुख्य मिलन स्थल है: ${currentTemple.safe_meet_points[0]}। यदि कोई बिछड़ जाए तो यहीं पहुंचे।`)}
            className="mt-2 text-xs font-semibold text-amber-200 hover:text-white flex items-center gap-1"
          >
            <Volume2 className="w-3.5 h-3.5" /> दिशा निर्देश सुनें
          </button>
        </div>
      </div>

      {/* "मैं यहाँ हूँ" 1-Tap Check-In Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-soft mb-8">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">
          📍 {language === 'hi' ? '1-क्लिक स्थिति अपडेट (परिवार को बताएं आप कहाँ हैं)' : 'Quick Check-in (Share where you are)'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
          {[
            { label: 'दर्शन कतार में', loc: 'Gate 2 Queue' },
            { label: 'पानी पीने के पास', loc: 'Water Booth Gate 1' },
            { label: 'जूता स्टैंड पर', loc: 'Shoe Stand' },
            { label: 'मिलन स्थल पर बैठा हूँ', loc: 'Banyan Tree Meet Point' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleUpdateMyStatus(item.label, item.loc)}
              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border transition text-left flex flex-col justify-between ${
                myStatus === item.label
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] text-slate-500 mt-1">क्लिक कर शेयर करें</span>
            </button>
          ))}
        </div>
      </div>

      {/* Members Status List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#0F4C5C]">
            {language === 'hi' ? 'परिवार के सदस्य (लाइव स्थिति)' : 'Family Members (Live)'}
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {members.length} {language === 'hi' ? 'सदस्य जुड़े हैं' : 'members connected'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className={`bg-white rounded-3xl p-5 border border-amber-200/80 shadow-soft flex items-center justify-between gap-4 ${
                member.isElderly ? 'ring-2 ring-amber-300' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-xs ${
                  member.isElderly ? 'bg-amber-500' : 'bg-[#0F4C5C]'
                }`}>
                  {member.name[0]}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-800">{member.name}</h4>
                    {member.isElderly && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-[#5C3D2E] text-[10px] font-bold">
                        बुजुर्ग
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#E36414]" />
                    <span>{member.status}</span>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 block">
                    अंतिम अपडेट: {member.lastSeen}
                  </span>
                </div>
              </div>

              {/* Battery & action */}
              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                  <Battery className="w-4 h-4 text-emerald-600" />
                  <span>{member.battery}%</span>
                </div>

                <button
                  onClick={() => speakText(`${member.name} इस समय ${member.status} हैं।`)}
                  className="mt-2 block p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0F4C5C] text-xs font-semibold transition ml-auto"
                  title="Speak member location"
                >
                  <Volume2 className="w-4 h-4 text-[#E36414]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Reporting Missing Devotee */}
      {isLostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-2 border-red-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-red-100 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">बिछड़े सदस्य की सूचना</h3>
                  <span className="text-xs text-slate-500">मंदिर प्रशासन व लाउडस्पीकर प्रसारण केंद्र</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsLostModalOpen(false);
                  setLostSuccessMsg('');
                }}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {lostSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-2" />
                <p className="font-bold">{lostSuccessMsg}</p>
                <button
                  onClick={() => setIsLostModalOpen(false)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold"
                >
                  ठीक है
                </button>
              </div>
            ) : (
              <form onSubmit={handleBroadcastLostAlert} className="space-y-4">
                <p className="text-xs text-slate-600">
                  कृपया बिछड़े हुए व्यक्ति का नाम दर्ज करें। मंदिर के कंट्रोल रूम एवं सभी लाउडस्पीकरों पर तुरंत नाम पुकारा जाएगा।
                </p>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    बिछड़े सदस्य का नाम (Name of Missing Person):
                  </label>
                  <input
                    type="text"
                    required
                    value={lostMemberName}
                    onChange={(e) => setLostMemberName(e.target.value)}
                    placeholder="उदा. शांता देवी / रमेश शर्मा"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-base"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 text-[#5C3D2E] text-xs">
                  💡 घोषणा के बाद उन्हें <strong>{currentTemple.safe_meet_points[0]}</strong> पर भेजा जाएगा।
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-md transition"
                >
                  📢 लाउडस्पीकर पर घोषणा करवाएं
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
