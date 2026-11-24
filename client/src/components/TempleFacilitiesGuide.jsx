import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Droplets, 
  Bath, 
  Footprints, 
  HeartPulse, 
  Accessibility, 
  Gift, 
  Car, 
  Volume2, 
  MapPin, 
  Compass, 
  CheckCircle2, 
  Navigation,
  Search,
  Filter
} from 'lucide-react';

export default function TempleFacilitiesGuide() {
  const { currentTemple, language, speakText, isBuzurgMode } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [onlyElderly, setOnlyElderly] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'WATER': return <Droplets className="w-6 h-6 text-blue-500" />;
      case 'WASHROOM': return <Bath className="w-6 h-6 text-teal-600" />;
      case 'SHOES': return <Footprints className="w-6 h-6 text-amber-700" />;
      case 'MEDICAL': return <HeartPulse className="w-6 h-6 text-red-600" />;
      case 'WHEELCHAIR': return <Accessibility className="w-6 h-6 text-emerald-600" />;
      case 'PRASAD': return <Gift className="w-6 h-6 text-orange-500" />;
      case 'PARKING': return <Car className="w-6 h-6 text-indigo-600" />;
      default: return <MapPin className="w-6 h-6 text-slate-600" />;
    }
  };

  const filteredFacilities = currentTemple.facilities.filter(f => {
    if (filterType !== 'ALL' && f.type !== filterType) return false;
    if (onlyElderly && !f.is_elderly_accessible) return false;
    return true;
  });

  const handleSpeakDirections = (facility) => {
    const text = language === 'hi'
      ? `${facility.name_hi} ${facility.location_hi} स्थित है। दूरी लगभग ${facility.distance_meters} मीटर यानी ${facility.approx_steps} कदम है। ${facility.status_hi}`
      : `${facility.name_en} is located at ${facility.location_hi}, ${facility.distance_meters} meters away (${facility.approx_steps} steps).`;
    speakText(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-devanagari">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-[#0F4C5C] border border-teal-200">
            {language === 'hi' ? 'परिसर नेविगेशन व सुविधाएं' : 'CAMPUS GUIDE'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F4C5C] mt-1">
            {language === 'hi' ? 'कहाँ क्या है? - मंदिर सुविधाएं' : 'Temple Facilities & Navigation'}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            {currentTemple.name_hi} परिसर में स्थित सभी आवश्यक सेवाओं की सटीक दूरी एवं दिशा
          </p>
        </div>

        {/* Listen summary button */}
        <button
          onClick={() => {
            const list = currentTemple.facilities.slice(0, 4).map(f => `${f.name_hi} ${f.distance_meters} मीटर दूर`).join(', ');
            speakText(`परिसर की मुख्य सुविधाएं: ${list}`);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0F4C5C] text-white text-sm font-bold shadow-sm hover:bg-[#114B5F] transition self-start md:self-auto"
        >
          <Volume2 className="w-5 h-5 text-amber-300" />
          <span>{language === 'hi' ? 'सुविधाएं सुनें' : 'Listen Facilities'}</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-2 bg-white rounded-2xl border border-amber-200/80 shadow-xs">
        {[
          { id: 'ALL', label_hi: 'सभी सुविधाएं', label_en: 'All' },
          { id: 'WATER', label_hi: 'पीने का पानी', label_en: 'Water' },
          { id: 'WASHROOM', label_hi: 'शौचालय', label_en: 'Toilets' },
          { id: 'SHOES', label_hi: 'जूता स्टैंड', label_en: 'Footwear' },
          { id: 'MEDICAL', label_hi: 'चिकित्सा सहायता', label_en: 'Medical' },
          { id: 'WHEELCHAIR', label_hi: 'व्हीलचेयर सेवा', label_en: 'Wheelchair' },
          { id: 'PRASAD', label_hi: 'प्रसाद काउंटर', label_en: 'Prasad' },
          { id: 'PARKING', label_hi: 'पार्किंग', label_en: 'Parking' }
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilterType(chip.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              filterType === chip.id
                ? 'bg-[#0F4C5C] text-white shadow-xs'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            {language === 'hi' ? chip.label_hi : chip.label_en}
          </button>
        ))}

        {/* Toggle Elderly Only */}
        <button
          onClick={() => setOnlyElderly(!onlyElderly)}
          className={`ml-auto px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 transition ${
            onlyElderly
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-amber-50 text-[#5C3D2E] border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Accessibility className="w-4 h-4" />
          <span>{language === 'hi' ? 'केवल बुजुर्ग/रैंप अनुकूल' : 'Seniors Accessible'}</span>
        </button>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFacilities.map((facility) => (
          <div
            key={facility.id}
            className={`bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-soft hover:shadow-md transition flex flex-col justify-between ${
              facility.is_elderly_accessible ? 'ring-1 ring-emerald-200' : ''
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs">
                  {getIcon(facility.type)}
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#0F4C5C] block">
                    {facility.distance_meters}m
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold block">
                    ~{facility.approx_steps} {language === 'hi' ? 'कदम' : 'steps'}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 leading-snug">
                {language === 'hi' ? facility.name_hi : facility.name_en}
              </h3>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-medium">
                <MapPin className="w-4 h-4 text-[#E36414] shrink-0" />
                <span>{facility.location_hi}</span>
              </div>

              {facility.status_hi && (
                <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{facility.status_hi}</span>
                </div>
              )}

              {facility.phone && (
                <div className="mt-2 text-xs font-bold text-red-600">
                  📞 फोन: {facility.phone}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleSpeakDirections(facility)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0F4C5C] text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-200 transition"
              >
                <Volume2 className="w-4 h-4 text-[#E36414]" />
                <span>{language === 'hi' ? 'दिशा निर्देश सुनें' : 'Audio Guide'}</span>
              </button>

              <button
                onClick={() => {
                  alert(language === 'hi' 
                    ? `दिशा निर्देश: ${facility.name_hi} - ${facility.location_hi}। लगभग ${facility.approx_steps} कदम आगे बढ़ें।`
                    : `Navigating to ${facility.name_en} (${facility.distance_meters}m). Follow main courtyard signs.`);
                }}
                className="py-2.5 px-3 rounded-xl bg-[#0F4C5C] hover:bg-[#114B5F] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition"
              >
                <Navigation className="w-4 h-4" />
                <span>{language === 'hi' ? 'मार्ग' : 'Route'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Campus Designated Safe Reunion Points Banner */}
      <div className="mt-8 bg-gradient-to-r from-[#FAF6EE] to-[#FFFDF9] border-2 border-amber-300 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#5C3D2E] flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#5C3D2E]">
              {language === 'hi' ? 'मंदिर के प्रमुख मिलन स्थल (Lost & Found Reunion Points)' : 'Designated Safe Reunion Points'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              भीड़ में परिवार से बिछड़ने पर इन स्थानों पर पहुंचे और बैठें। यहाँ सुरक्षा कर्मी व लाउडस्पीकर केंद्र हैं:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {currentTemple.safe_meet_points.map((pt, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs"
                >
                  📍 {pt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
