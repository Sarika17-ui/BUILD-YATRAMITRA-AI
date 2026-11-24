/**
 * YatraMitra AI - Express API Backend
 * Connects Temple Telemetry, Voice Intent Engine, Family Companion,
 * Emergency SOS, and AI Prediction Microservice.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TEMPLES } from './data/templeData.js';
import { parseAndResolveVoiceQuery } from './services/intentService.js';
import { activeFamilyGroups, announcementsFeed, sosIncidentLogs } from './services/store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.url}`);
  next();
});

// Root Health & Metadata
app.get('/api', (req, res) => {
  res.json({
    project: "YatraMitra AI Backend",
    tagline: "आपकी यात्रा, आपकी भाषा, आपकी सुरक्षा।",
    status: "online",
    temples_supported: TEMPLES.map(t => ({ id: t.id, name_hi: t.name_hi, name_en: t.name_en }))
  });
});

// GET all temples summary
app.get('/api/temples', (req, res) => {
  res.json({ success: true, count: TEMPLES.length, data: TEMPLES });
});

// GET single temple details
app.get('/api/temples/:id', (req, res) => {
  const temple = TEMPLES.find(t => t.id === req.params.id.toLowerCase());
  if (!temple) {
    return res.status(404).json({ success: false, error: "Temple not found" });
  }
  res.json({ success: true, data: temple });
});

// GET crowd status & sensor telemetry for a temple
app.get('/api/crowd/status/:id', (req, res) => {
  const temple = TEMPLES.find(t => t.id === req.params.id.toLowerCase()) || TEMPLES[0];
  
  // Real-time jitter for live telemetry simulation
  const jitter = Math.floor(Math.random() * 50) - 25;
  const currentDevotees = Math.max(500, temple.current_devotees + jitter);
  const occupancy = Math.min(100, Math.round((currentDevotees / temple.capacity) * 100));

  res.json({
    success: true,
    data: {
      temple_id: temple.id,
      temple_name_hi: temple.name_hi,
      capacity: temple.capacity,
      current_devotees: currentDevotees,
      occupancy_percentage: occupancy,
      wait_time_minutes: temple.wait_time_minutes,
      crowd_level: occupancy > 75 ? "HIGH" : occupancy > 45 ? "MODERATE" : "LOW",
      crowd_status_hi: occupancy > 75 ? "भारी भीड़" : occupancy > 45 ? "मध्यम भीड़" : "सामान्य - सुगम दर्शन",
      crowd_status_en: occupancy > 75 ? "Heavy Crowd" : occupancy > 45 ? "Moderate Crowd" : "Normal Flow",
      gates: temple.gates,
      updated_at: new Date().toISOString()
    }
  });
});

// POST Voice Assistant interaction
app.post('/api/voice-assistant', (req, res) => {
  const { query, templeId, language } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, error: "Query is required" });
  }

  const result = parseAndResolveVoiceQuery(query, templeId || 'somnath', language || 'hi');
  res.json({ success: true, data: result });
});

// GET Facilities for a temple
app.get('/api/facilities/:id', (req, res) => {
  const temple = TEMPLES.find(t => t.id === req.params.id.toLowerCase()) || TEMPLES[0];
  res.json({
    success: true,
    temple_id: temple.id,
    temple_name_hi: temple.name_hi,
    facilities: temple.facilities,
    safe_meet_points: temple.safe_meet_points,
    helpline: temple.helpline
  });
});

// GET/POST Family Group Companion
app.get('/api/family/:groupCode', (req, res) => {
  const code = req.params.groupCode.toUpperCase();
  const group = activeFamilyGroups.get(code);
  if (!group) {
    return res.status(404).json({ success: false, error: "Group code not found" });
  }
  res.json({ success: true, data: group });
});

app.post('/api/family/join', (req, res) => {
  const { groupCode, memberName, age, isElderly } = req.body;
  const code = (groupCode || '').toUpperCase();
  let group = activeFamilyGroups.get(code);

  if (!group) {
    // Auto-create new group if not found
    group = {
      code,
      templeId: "somnath",
      createdAt: new Date().toISOString(),
      leadName: `${memberName || 'यात्री'} का परिवार`,
      meetPoint: "गेट 2 वटवृक्ष छाया स्थल (Banyan Tree Shade, Gate 2)",
      members: []
    };
    activeFamilyGroups.set(code, group);
  }

  const newMember = {
    id: `m_${Date.now()}`,
    name: memberName || "नया सदस्य",
    age: Number(age) || 45,
    status: "सुरक्षित परिसर में",
    location: "मुख्य प्रवेश द्वार",
    battery: 95,
    isElderly: Boolean(isElderly),
    lastSeen: "अभी-अभी"
  };

  group.members.push(newMember);
  res.json({ success: true, data: group, memberId: newMember.id });
});

app.post('/api/family/update-status', (req, res) => {
  const { groupCode, memberId, status, location } = req.body;
  const group = activeFamilyGroups.get((groupCode || '').toUpperCase());
  if (!group) {
    return res.status(404).json({ success: false, error: "Group not found" });
  }

  const member = group.members.find(m => m.id === memberId);
  if (member) {
    if (status) member.status = status;
    if (location) member.location = location;
    member.lastSeen = "अभी-अभी";
  }

  res.json({ success: true, data: group });
});

app.post('/api/family/lost-alert', (req, res) => {
  const { groupCode, missingMemberName, notes } = req.body;
  
  const alertRecord = {
    id: `lost_${Date.now()}`,
    groupCode,
    missingMemberName,
    notes,
    time: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
    status: "BROADCASTED_TO_CONTROL_ROOM"
  };

  // Add high priority announcement
  announcementsFeed.unshift({
    id: `ann_lost_${Date.now()}`,
    templeId: "somnath",
    time: alertRecord.time,
    title_hi: "आवश्यक उद्घोषणा: बिछड़े सदस्य की सूचना",
    title_en: "Urgent Announcement: Missing Pilgrim",
    message_hi: `${missingMemberName} जी अपने परिवार से बिछड़ गए हैं। यदि आप इन्हें देखें तो कृपया निकटतम सुरक्षा बूथ या गेट 2 मिलन स्थल पर सूचित करें।`,
    message_en: `Pilgrim ${missingMemberName} is separated from family. Please report to nearest security kiosk or Gate 2 meet point.`,
    priority: "CRITICAL",
    audio_auto_announce: true
  });

  res.json({
    success: true,
    message_hi: "मंदिर नियंत्रण कक्ष एवं लाउडस्पीकर प्रसारण केंद्र को सूचना भेज दी गई है।",
    data: alertRecord
  });
});

// GET Announcements
app.get('/api/announcements', (req, res) => {
  const { templeId } = req.query;
  const filtered = templeId 
    ? announcementsFeed.filter(a => a.templeId === templeId)
    : announcementsFeed;
  res.json({ success: true, data: filtered });
});

// POST Emergency SOS
app.post('/api/emergency/sos', (req, res) => {
  const { templeId, userName, userPhone, location, type } = req.body;
  const temple = TEMPLES.find(t => t.id === templeId) || TEMPLES[0];

  const incident = {
    id: `SOS_${Date.now()}`,
    templeId: temple.id,
    userName: userName || "तीर्थयात्री",
    userPhone: userPhone || "Not provided",
    location: location || "मंदिर परिसर",
    type: type || "MEDICAL_OR_CROWD_DISTRESS",
    time: new Date().toISOString(),
    status: "DISPATCHED",
    response_team: "निकटतम त्वरित राहत दल (QRT Team 1)"
  };

  sosIncidentLogs.unshift(incident);

  res.json({
    success: true,
    incidentId: incident.id,
    message_hi: "आपातकालीन अलर्ट दर्ज! सुरक्षा एवं मेडिकल टीम आपकी ओर रवाना कर दी गई है।",
    helpline: temple.helpline,
    police: temple.police_post,
    ambulance: "108",
    first_aid_post: temple.facilities.find(f => f.type === 'MEDICAL')?.location_hi || "गेट 2 मेडिकल पोस्ट",
    voice_guidance_hi: "कृपया शांत रहें। सहायता दल कुछ ही पलों में पहुँच रहा है। सुरक्षा सहायता नंबर 108 या गेट 2 चिकित्सा केंद्र से संपर्क करें।"
  });
});

// Control Room Dashboard metrics endpoint
app.get('/api/control-room/metrics/:id', (req, res) => {
  const temple = TEMPLES.find(t => t.id === req.params.id.toLowerCase()) || TEMPLES[0];
  
  res.json({
    success: true,
    temple_id: temple.id,
    temple_name_hi: temple.name_hi,
    capacity: temple.capacity,
    current_devotees: temple.current_devotees,
    ingress_rate_per_min: 42,
    egress_rate_per_min: 38,
    queue_velocity_meters_per_min: 3.2,
    active_incidents: sosIncidentLogs.length,
    active_announcements: announcementsFeed.length,
    gates_flow: temple.gates.map(g => ({
      ...g,
      flow_rate_per_min: g.type === 'MAIN_ENTRY' ? 24 : g.type === 'SENIOR_ACCESSIBLE' ? 12 : 28,
      status: "OPERATIONAL"
    }))
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🕉️ YatraMitra AI Server listening on port ${PORT}`);
  console.log(`🚩 आपकी यात्रा, आपकी भाषा, आपकी सुरक्षा।`);
  console.log(`===============================================`);
});
