/**
 * In-memory Store with Local Fallback and MongoDB Schema Support
 * Stores dynamic crowd logs, family groups, announcements, and emergency SOS alerts.
 */

// Simulated active family groups
export const activeFamilyGroups = new Map();

// Initialize default demo family group
activeFamilyGroups.set("YATRA-108", {
  code: "YATRA-108",
  templeId: "somnath",
  createdAt: new Date().toISOString(),
  leadName: "शर्मा परिवार (Sharma Family)",
  meetPoint: "गेट 2 वटवृक्ष छाया स्थल (Banyan Tree Shade, Gate 2)",
  members: [
    { id: "m1", name: "रमेश जी (पिताजी)", age: 68, status: "सुरक्षित - शंख द्वार कतार में", location: "Gate 2 Special Queue", battery: 78, isElderly: true, lastSeen: "अभी-अभी" },
    { id: "m2", name: "शांता देवी (माताजी)", age: 65, status: "व्हीलचेयर सहायता केंद्र पर", location: "Wheelchair Center", battery: 85, isElderly: true, lastSeen: "2 मिनट पहले" },
    { id: "m3", name: "अमित (बेटा)", age: 36, status: "जूता स्टैंड पर टोकन लेते हुए", location: "Shoe Stand Counter A", battery: 92, isElderly: false, lastSeen: "1 मिनट पहले" },
    { id: "m4", name: "प्रिया (बहू)", age: 32, status: "शीतल जल सेवा केंद्र के पास", location: "Water Booth Gate 1", battery: 64, isElderly: false, lastSeen: "3 मिनट पहले" }
  ]
});

// Broadcast announcements feed
export const announcementsFeed = [
  {
    id: "ann_1",
    templeId: "somnath",
    time: "10:15 AM",
    title_hi: "वरिष्ठ नागरिकों हेतु सूचना",
    title_en: "Notice for Senior Citizens",
    message_hi: "शंख द्वार (गेट 2) पर व्हीलचेयर एवं छायादार बैठने की विशेष व्यवस्था उपलब्ध है। कतार में न खड़े हों।",
    message_en: "Wheelchairs and shaded seating are available at Shankh Gate (Gate 2). Seniors need not stand in general queue.",
    priority: "HIGH",
    audio_auto_announce: true
  },
  {
    id: "ann_2",
    templeId: "somnath",
    time: "10:30 AM",
    title_hi: "मध्याह्न आरती दर्शन",
    title_en: "Noon Aarti Darshan",
    message_hi: "दोपहर 12:00 बजे की मध्याह्न आरती हेतु कतार में प्रवेश 11:30 बजे से आरंभ होगा।",
    message_en: "Queue entry for 12:00 PM Noon Aarti starts at 11:30 AM.",
    priority: "NORMAL",
    audio_auto_announce: false
  },
  {
    id: "ann_3",
    templeId: "dwarka",
    time: "09:45 AM",
    title_hi: "मोक्ष द्वार कतार व्यवस्था",
    title_en: "Moksha Dwar Queue Flow",
    message_hi: "मोक्ष द्वार पर प्रवेश गति सुचारू है। कृपया जूते-चप्पल निर्धारित स्टैंड पर ही जमा करें।",
    message_en: "Entry flow at Moksha Dwar is smooth. Please deposit footwear only at designated counters.",
    priority: "NORMAL",
    audio_auto_announce: false
  }
];

// Active Emergency SOS logs
export const sosIncidentLogs = [];
