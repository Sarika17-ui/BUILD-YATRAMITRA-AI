import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext();

// Default offline/fallback temple data so client runs instantly
export const FALLBACK_TEMPLES = [
  {
    id: "somnath",
    name_hi: "श्री सोमनाथ ज्योतिर्लिंग मंदिर",
    name_en: "Shree Somnath Jyotirlinga Temple",
    deity: "भगवान शिव (प्रथम ज्योतिर्लिंग)",
    location_hi: "प्रभास पाटन, वेरावल, गुजरात",
    location_en: "Prabhas Patan, Veraval, Gujarat",
    capacity: 18000,
    current_devotees: 6850,
    occupancy_pct: 38,
    wait_time_minutes: 25,
    crowd_level: "LOW_MODERATE",
    crowd_status_hi: "सामान्य - सुगम दर्शन",
    crowd_status_en: "Normal - Smooth Darshan",
    audio_greeting_hi: "जय सोमनाथ! प्रथम ज्योतिर्लिंग श्री सोमनाथ महादेव के पावन प्रांगण में आपका स्वागत है।",
    aarti_timings: [
      { name_hi: "प्रातः आरती", name_en: "Morning Aarti", time: "07:00 AM", status: "संपन्न" },
      { name_hi: "मध्याह्न आरती", name_en: "Noon Aarti", time: "12:00 PM", status: "आगामी" },
      { name_hi: "संध्या महाआरती", name_en: "Evening Maha Aarti", time: "07:00 PM", status: "आगामी" },
      { name_hi: "ध्वनि एवं प्रकाश शो", name_en: "Light & Sound Show", time: "08:00 PM", status: "विशेष आकर्षण" }
    ],
    gates: [
      { id: "G1", name_hi: "दिग्विजय द्वार (गेट 1)", name_en: "Digvijay Gate (Gate 1)", type: "MAIN_ENTRY", crowd: "मध्यम", wait: "20 मिनट", is_elderly_friendly: false },
      { id: "G2", name_hi: "शंख द्वार (गेट 2)", name_en: "Shankh Gate (Gate 2)", type: "SENIOR_ACCESSIBLE", crowd: "अल्प", wait: "8 मिनट", is_elderly_friendly: true, note_hi: "वरिष्ठ नागरिकों व व्हीलचेयर हेतु सुगम मार्ग" },
      { id: "G3", name_hi: "सागर दर्शन द्वार (गेट 3)", name_en: "Sagar Gate (Gate 3)", type: "EXIT_ONLY", crowd: "सामान्य", wait: "0 मिनट", is_elderly_friendly: true }
    ],
    facilities: [
      { id: "w1", type: "WATER", name_hi: "शीतल जल सेवा केंद्र 1", name_en: "Cold RO Drinking Water Post 1", location_hi: "दिग्विजय द्वार के पास, पूर्व दिशा", distance_meters: 45, approx_steps: 60, is_elderly_accessible: true },
      { id: "t1", type: "WASHROOM", name_hi: "सुगम प्रसाधन गृह (शौचालय)", name_en: "Accessible Restrooms & Toilets", location_hi: "शंख द्वार के दाहिनी ओर, रैंप उपलब्ध", distance_meters: 70, approx_steps: 95, is_elderly_accessible: true },
      { id: "s1", type: "SHOES", name_hi: "निःशुल्क जूता-चप्पल स्टैंड 'अ'", name_en: "Free Footwear Counter Block A", location_hi: "सुरक्षा जांच गेट के ठीक सामने", distance_meters: 30, approx_steps: 40, is_elderly_accessible: true },
      { id: "m1", type: "MEDICAL", name_hi: "24/7 प्राथमिक चिकित्सा एवं आपातकालीन केंद्र", name_en: "24/7 Emergency Medical Aid Post", location_hi: "ट्रस्ट कार्यालय भवन, गेट 2 के निकट", distance_meters: 90, approx_steps: 120, phone: "108 / 02876-231200", is_elderly_accessible: true },
      { id: "wc1", type: "WHEELCHAIR", name_hi: "सुगम दर्शन एवं निःशुल्क व्हीलचेयर सेवा", name_en: "Senior Citizen Wheelchair Helpdesk", location_hi: "शंख द्वार (गेट 2) रिसेप्शन", distance_meters: 50, approx_steps: 65, is_elderly_accessible: true },
      { id: "p1", type: "PRASAD", name_hi: "श्री सोमनाथ ट्रस्ट शुद्ध घी प्रसाद केंद्र", name_en: "Pure Ghee Laddu Prasad Counter", location_hi: "निकासी मार्ग, गेट 3 के सामने", distance_meters: 110, approx_steps: 150, is_elderly_accessible: true },
      { id: "pk1", type: "PARKING", name_hi: "मुख्य वाहन पार्किंग एवं ई-रिक्शा स्टैंड", name_en: "Main Parking Lot & E-Rickshaw Stand", location_hi: "मंदिर से 350 मीटर पूर्व, निःशुल्क बैटरी वाहन", distance_meters: 350, approx_steps: 450, is_elderly_accessible: true }
    ],
    helpline: "02876-231200",
    police_post: "02876-231211",
    safe_meet_points: [
      "गेट 2 वटवृक्ष छाया स्थल (Banyan Tree Shade, Gate 2)",
      "मुख्य ध्वज स्तंभ प्रांगण (Flagstaff Courtyard)",
      "जूता स्टैंड ब्लॉक 'अ' सूचना केंद्र (Shoe Stand Counter A)"
    ]
  },
  {
    id: "dwarka",
    name_hi: "श्री द्वारकाधीश मंदिर (जगत मंदिर)",
    name_en: "Shree Dwarkadhish Temple (Jagat Mandir)",
    deity: "भगवान श्रीकृष्ण (द्वारकाधीश)",
    location_hi: "द्वारका, देवभूमि द्वारका, गुजरात",
    location_en: "Dwarka, Devbhumi Dwarka, Gujarat",
    capacity: 15000,
    current_devotees: 8400,
    occupancy_pct: 56,
    wait_time_minutes: 40,
    crowd_level: "MODERATE",
    crowd_status_hi: "मध्यम भीड़ - व्यवस्थित कतार",
    crowd_status_en: "Moderate Crowd - Orderly Queue",
    audio_greeting_hi: "जय श्री कृष्णा! द्वारकाधीश जगत मंदिर में आपका हार्दिक स्वागत है।",
    aarti_timings: [
      { name_hi: "मंगला आरती", name_en: "Mangla Aarti", time: "06:30 AM", status: "संपन्न" },
      { name_hi: "शृंगार आरती", name_en: "Shringar Aarti", time: "10:30 AM", status: "संपन्न" },
      { name_hi: "संध्या आरती", name_en: "Sandhya Aarti", time: "07:30 PM", status: "आगामी" },
      { name_hi: "शयन आरती", name_en: "Shayan Aarti", time: "08:30 PM", status: "आगामी" }
    ],
    gates: [
      { id: "DG1", name_hi: "मोक्ष द्वार (मुख्य प्रवेश)", name_en: "Moksha Dwar (North Gate)", type: "MAIN_ENTRY", crowd: "मध्यम", wait: "35 मिनट", is_elderly_friendly: false },
      { id: "DG2", name_hi: "वरिष्ठ सुगम प्रवेश द्वार", name_en: "Senior Citizen Special Gate", type: "SENIOR_ACCESSIBLE", crowd: "अल्प", wait: "12 मिनट", is_elderly_friendly: true, note_hi: "बुजुर्गों के लिए सीढ़ी मुक्त रैंप प्रवेश" },
      { id: "DG3", name_hi: "स्वर्ग द्वार (गोमती घाट निकासी)", name_en: "Swarga Dwar (South Exit)", type: "EXIT_ONLY", crowd: "सामान्य", wait: "0 मिनट", is_elderly_friendly: false }
    ],
    facilities: [
      { id: "dw_w1", type: "WATER", name_hi: "शीतल जल सेवा मोक्ष द्वार", name_en: "Drinking Water Station Moksha Dwar", location_hi: "मोक्ष द्वार प्रवेश मार्ग पर", distance_meters: 35, approx_steps: 45, is_elderly_accessible: true },
      { id: "dw_t1", type: "WASHROOM", name_hi: "सार्वजनिक प्रसाधन गृह", name_en: "Public Restrooms", location_hi: "मोक्ष द्वार के बाहर बाजार चौक", distance_meters: 80, approx_steps: 110, is_elderly_accessible: true },
      { id: "dw_s1", type: "SHOES", name_hi: "मोक्ष द्वार पादुका स्टैंड", name_en: "Footwear Counter North", location_hi: "प्रवेश द्वार के बायीं ओर", distance_meters: 25, approx_steps: 35, is_elderly_accessible: true },
      { id: "dw_m1", type: "MEDICAL", name_hi: "रेड क्रॉस प्राथमिक चिकित्सा शिविर", name_en: "First Aid & Medical Post", location_hi: "देवस्थान समिति कार्यालय", distance_meters: 65, approx_steps: 85, phone: "02892-234080", is_elderly_accessible: true },
      { id: "dw_wc1", type: "WHEELCHAIR", name_hi: "दिव्यांग व वृद्ध सेवा केंद्र", name_en: "Wheelchair Assistance Counter", location_hi: "मोक्ष द्वार वरिष्ठ सहायता केंद्र", distance_meters: 40, approx_steps: 50, is_elderly_accessible: true },
      { id: "dw_p1", type: "PRASAD", name_hi: "द्वारकाधीश भोग एवं पेड़ा भंडार", name_en: "Temple Peda & Bhog Center", location_hi: "मंदिर प्रांगण निकासी", distance_meters: 95, approx_steps: 130, is_elderly_accessible: true }
    ],
    helpline: "02892-234080",
    police_post: "02892-234100",
    safe_meet_points: [
      "मोक्ष द्वार सुदामा सेतु प्रवेश (Sudama Setu Point)",
      "देवस्थान ट्रस्ट हॉल छतरी (Deosthan Trust Canopy)",
      "गोमती संगम स्नान घाट पुलिस चौकी (Gomti Police Post)"
    ]
  },
  {
    id: "ambaji",
    name_hi: "श्री आरासुरी अम्बाजी माता मंदिर",
    name_en: "Shree Arasuri Ambaji Mata Temple",
    deity: "माँ अम्बा (51 शक्तिपीठों में प्रधान)",
    location_hi: "अम्बाजी, दांता तालुका, बनासकांठा, गुजरात",
    location_en: "Ambaji, Banaskantha, Gujarat",
    capacity: 22000,
    current_devotees: 11200,
    occupancy_pct: 51,
    wait_time_minutes: 35,
    crowd_level: "MODERATE",
    crowd_status_hi: "मध्यम कतार - देवी दर्शन चालू",
    crowd_status_en: "Moderate - Darshan Running Smoothly",
    audio_greeting_hi: "जय माता दी! बोल माँ अम्बे, मात की जय! श्री अम्बाजी शक्तिपीठ में आपका स्वागत है।",
    aarti_timings: [
      { name_hi: "प्रातः आरती", name_en: "Morning Aarti", time: "07:30 AM", status: "संपन्न" },
      { name_hi: "राजभोग आरती", name_en: "Rajbhog Aarti", time: "12:00 PM", status: "आगामी" },
      { name_hi: "संध्या आरती", name_en: "Sandhya Aarti", time: "07:00 PM", status: "आगामी" }
    ],
    gates: [
      { id: "AG1", name_hi: "सिंह द्वार (गेट 1)", name_en: "Singh Dwar (Main Gate)", type: "MAIN_ENTRY", crowd: "मध्यम", wait: "30 मिनट", is_elderly_friendly: false },
      { id: "AG2", name_hi: "शक्ति द्वार (गेट 2)", name_en: "Shakti Dwar (Senior/Disabled)", type: "SENIOR_ACCESSIBLE", crowd: "अल्प", wait: "10 मिनट", is_elderly_friendly: true, note_hi: "बुजुर्गों एवं बच्चों हेतु छायादार कतार" },
      { id: "AG3", name_hi: "आनंद द्वार (गेट 3)", name_en: "Anand Dwar (Exit)", type: "EXIT_ONLY", crowd: "अल्प", wait: "0 मिनट", is_elderly_friendly: true }
    ],
    facilities: [
      { id: "amb_w1", type: "WATER", name_hi: "माँ अम्बे शीतल जल छबील", name_en: "Ambe Cold Water Post", location_hi: "सिंह द्वार के निकट", distance_meters: 40, approx_steps: 50, is_elderly_accessible: true },
      { id: "amb_t1", type: "WASHROOM", name_hi: "अम्बाजी आधुनिक प्रसाधन कॉम्प्लेक्स", name_en: "Modern Sanitation Complex", location_hi: "सिंह द्वार के पीछे", distance_meters: 60, approx_steps: 80, is_elderly_accessible: true },
      { id: "amb_s1", type: "SHOES", name_hi: "जूता घर संख्या 2", name_en: "Footwear Counter 2", location_hi: "सिंह द्वार प्रवेश के बायीं ओर", distance_meters: 30, approx_steps: 40, is_elderly_accessible: true },
      { id: "amb_m1", type: "MEDICAL", name_hi: "देवस्थान ट्रस्ट प्राथमिक चिकित्सा केंद्र", name_en: "Trust Primary Health Center", location_hi: "गेट 2 के सामने स्वास्थ्य कुटीर", distance_meters: 50, approx_steps: 65, phone: "02749-262136", is_elderly_accessible: true },
      { id: "amb_wc1", type: "WHEELCHAIR", name_hi: "माताजी सुगम सेवा (व्हीलचेयर)", name_en: "Wheelchair & Elderly Support", location_hi: "शक्ति द्वार (गेट 2)", distance_meters: 35, approx_steps: 45, is_elderly_accessible: true },
      { id: "amb_p1", type: "PRASAD", name_hi: "श्री अम्बाजी मोहनथाल प्रसाद काउंटर", name_en: "Famous Mohanthal Prasad Counter", location_hi: "आनंद द्वार (गेट 3)", distance_meters: 85, approx_steps: 115, is_elderly_accessible: true }
    ],
    helpline: "02749-262136",
    police_post: "02749-262233",
    safe_meet_points: [
      "शक्ति द्वार वटवृक्ष बैठक स्थल (Banyan Meeting Point Gate 2)",
      "मोहनथाल प्रसाद काउंटर छाया मंडप (Prasad Canopy Gate 3)",
      "सूचना प्रसारण केंद्र लाउडस्पीकर पोल 4 (PA System Pole 4)"
    ]
  },
  {
    id: "pavagadh",
    name_hi: "श्री महाकाली माताजी मंदिर, पावागढ़",
    name_en: "Shree Mahakali Mataji Temple, Pavagadh",
    deity: "माँ महाकाली (जागृत शक्तिपीठ)",
    location_hi: "पावागढ़ पहाड़ी, चंपानेर, पंचमहाल, गुजरात",
    location_en: "Pavagadh Hill, Champaner, Gujarat",
    capacity: 14000,
    current_devotees: 5200,
    occupancy_pct: 37,
    wait_time_minutes: 20,
    crowd_level: "LOW_MODERATE",
    crowd_status_hi: "सामान्य - रोपवे एवं दर्शन सुगम",
    crowd_status_en: "Normal - Ropeway & Darshan Operating Fast",
    audio_greeting_hi: "जय माताजी! पावागढ़ वाली माँ महाकाली के चरणों में आपका सादर प्रणाम।",
    ropeway_status: {
      is_running: true,
      wait_minutes: 15,
      status_hi: "उडनखटोला (रोपवे) सामान्य रूप से चालू है (प्रतीक्षा 15 मिनट)",
      senior_priority: true
    },
    aarti_timings: [
      { name_hi: "प्रातः आरती", name_en: "Morning Aarti", time: "06:00 AM", status: "संपन्न" },
      { name_hi: "संध्या आरती", name_en: "Evening Aarti", time: "06:30 PM", status: "आगामी" }
    ],
    gates: [
      { id: "PG1", name_hi: "रोपवे ऊपरी स्टेशन प्रवेश", name_en: "Ropeway Upper Station Gate", type: "MAIN_ENTRY", crowd: "मध्यम", wait: "15 मिनट", is_elderly_friendly: true },
      { id: "PG2", name_hi: "पैदल सीढ़ी मार्ग प्रवेश", name_en: "Stairs Route Gate", type: "STAIRS", crowd: "सामान्य", wait: "10 मिनट", is_elderly_friendly: false },
      { id: "PG3", name_hi: "शिखर निकासी द्वार", name_en: "Summit Exit Gate", type: "EXIT_ONLY", crowd: "सामान्य", wait: "0 मिनट", is_elderly_friendly: true }
    ],
    facilities: [
      { id: "pvg_w1", type: "WATER", name_hi: "पर्वत शिखर शीतल जल प्याऊ", name_en: "Summit Drinking Water Booth", location_hi: "रोपवे स्टेशन बाहर आते ही", distance_meters: 25, approx_steps: 30, is_elderly_accessible: true },
      { id: "pvg_t1", type: "WASHROOM", name_hi: "शिखर आधुनिक शौचालय", name_en: "Hilltop Restrooms", location_hi: "रोपवे बेस एवं शिखर दोनों जगह", distance_meters: 50, approx_steps: 65, is_elderly_accessible: true },
      { id: "pvg_s1", type: "SHOES", name_hi: "शिखर जूता स्टैंड", name_en: "Hilltop Shoe Counter", location_hi: "मंदिर सीढ़ी प्रारंभ बिंदु", distance_meters: 30, approx_steps: 40, is_elderly_accessible: true },
      { id: "pvg_m1", type: "MEDICAL", name_hi: "पर्वतीय प्राथमिक चिकित्सा व ऑक्सीजन केंद्र", name_en: "Hilltop Medical & Oxygen Booth", location_hi: "रोपवे अपर स्टेशन पुलिस बूथ", distance_meters: 40, approx_steps: 50, phone: "02676-245642", is_elderly_accessible: true },
      { id: "pvg_wc1", type: "WHEELCHAIR", name_hi: "डोली व पालकी सेवा (बुजुर्गों हेतु)", name_en: "Doli / Palki Service for Seniors", location_hi: "मांची बेस स्टेशन एवं अपर स्टेशन", distance_meters: 20, approx_steps: 25, is_elderly_accessible: true },
      { id: "pvg_p1", type: "PRASAD", name_hi: "माँ कालिका पेड़ा एवं नारियल प्रसाद", name_en: "Kalika Mata Prasad Store", location_hi: "शिखर निकासी परिसर", distance_meters: 60, approx_steps: 80, is_elderly_accessible: true }
    ],
    helpline: "02676-245642",
    police_post: "02676-245633",
    safe_meet_points: [
      "उडनखटोला (रोपवे) अपर स्टेशन प्रतीक्षालय (Ropeway Upper Waiting Hall)",
      "मांची बस स्टैंड विश्राम कुटीर (Manchi Rest Shelter)",
      "शिखर पुलिस सुरक्षा बूथ (Summit Police Post)"
    ]
  }
];

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('ym_lang') || 'hi');
  const [isBuzurgMode, setIsBuzurgMode] = useState(() => localStorage.getItem('ym_buzurg') === 'true');
  const [selectedTempleId, setSelectedTempleId] = useState('somnath');
  const [temples, setTemples] = useState(FALLBACK_TEMPLES);
  const [activeTab, setActiveTab] = useState('home'); // home, voice, facilities, family, control-room
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [familyGroup, setFamilyGroup] = useState(null);

  const synthRef = useRef(null);

  // Initialize SpeechSynthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Fetch live temples from backend if available
  useEffect(() => {
    fetch('/api/temples')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length > 0) {
          setTemples(data.data);
        }
      })
      .catch(err => {
        console.log("Using cached temple telemetry:", err.message);
      });
  }, []);

  // Current selected temple object
  const currentTemple = temples.find(t => t.id === selectedTempleId) || temples[0];

  // Language switcher
  const toggleLanguage = () => {
    const next = language === 'hi' ? 'en' : 'hi';
    setLanguage(next);
    localStorage.setItem('ym_lang', next);
    if (next === 'hi') {
      speakText("हिंदी भाषा चुनी गई।");
    } else {
      speakText("English language selected.");
    }
  };

  // Buzurg Mode toggle
  const toggleBuzurgMode = () => {
    const next = !isBuzurgMode;
    setIsBuzurgMode(next);
    localStorage.setItem('ym_buzurg', next ? 'true' : 'false');
    
    if (next) {
      speakText("बुजुर्ग मोड सक्रिय किया गया है। बड़े अक्षर, सरल भाषा एवं ध्वनि सहायता चालू है।");
    } else {
      speakText("सामान्य मोड सक्रिय।");
    }
  };

  // Voice output function with fallback
  const speakText = (text, customLang = null) => {
    if (!synthRef.current || !text) return;

    try {
      synthRef.current.cancel(); // Cancel ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = customLang || (language === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.lang = targetLang;
      
      // Elderly users need slower, soothing pace
      utterance.rate = isBuzurgMode ? 0.82 : 0.92;
      utterance.pitch = 1.0;

      // Select voice matching language if available
      const voices = synthRef.current.getVoices();
      const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.includes('Hindi'));
      const indianVoice = voices.find(v => v.lang.includes('IN'));

      if (targetLang.startsWith('hi') && hindiVoice) {
        utterance.voice = hindiVoice;
      } else if (indianVoice) {
        utterance.voice = indianVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        toggleLanguage,
        isBuzurgMode,
        toggleBuzurgMode,
        selectedTempleId,
        setSelectedTempleId,
        currentTemple,
        temples,
        activeTab,
        setActiveTab,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isSOSOpen,
        setIsSOSOpen,
        isSpeaking,
        speakText,
        stopSpeaking,
        announcements,
        setAnnouncements,
        familyGroup,
        setFamilyGroup
      }}
    >
      <div className={isBuzurgMode ? "buzurg-mode" : ""}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
