/**
 * Natural Language Voice Intent Parser for YatraMitra AI
 * Accurately analyzes Hindi (and English) pilgrim questions and maps to
 * verified temple facts, facilities, waiting times, and safety guidance.
 */

import { TEMPLES } from '../data/templeData.js';

export function parseAndResolveVoiceQuery(queryText, templeId = 'somnath', userLanguage = 'hi') {
  const query = (queryText || '').toLowerCase().trim();
  const temple = TEMPLES.find(t => t.id === templeId) || TEMPLES[0];

  // Intent patterns
  const intents = {
    CROWD: /(भीड़|रश|कितने लोग|गर्दी|crowd|rush|busy|occupancy|kitni bhid)/i,
    WAIT_TIME: /(समय|कितना समय|देर|प्रतीक्षा|टाइम|darshan time|wait|how long|wait time|samay|kitna samay)/i,
    WASHROOM: /(शौचालय|टॉयलेट|बाथरूम|मूत्रालय|प्रसाधन|toilet|washroom|restroom|latrine|shauchalay)/i,
    WATER: /(पानी|जल|प्याऊ|प्यास|शीतल जल|water|drinking water|cold water|paani)/i,
    SHOES: /(जूता|जूते|चप्पल|पादुका|जूता स्टैंड|shoe|shoes|footwear|chappal|juta)/i,
    MEDICAL: /(मेडिकल|डॉक्टर|दवाई|दवा|तबीयत|चक्कर|उल्टी|चोट|दर्द|अस्पताल|फर्स्ट एड|medical|doctor|medicine|first aid|sick|hospital|ill)/i,
    WHEELCHAIR: /(व्हीलचेयर|बुजुर्ग|कुर्सी|लाठी|विकलांग|दिव्यांग|सीनियर|wheelchair|senior|elderly|disabled|chair)/i,
    AARTI: /(आरती|पूजा|भोग|शृंगार|आरती का समय|दर्शन कब|aarti|timing|puja|darshan timing)/i,
    PRASAD: /(प्रसाद|लड्डू|पेड़ा|भोग|मिठाई|prasad|laddu|peda|bhog)/i,
    PARKING: /(पार्किंग|गाड़ी|कार|बस|वाहन|parking|vehicle|car|bus|gaadi)/i,
    ROPEWAY: /(रोपवे|उडनखटोला|केबल कार|लिफ्ट|ropeway|cable car|udankhatola)/i,
    FAMILY: /(परिवार|खो गया|गुम|बच्चा|साथी|सदस्य|मिलन स्थल|family|lost|member|child)/i,
    EMERGENCY: /(मदद|बचाओ|आपातकाल|पुलिस|सुरक्षा|खतरा|help|sos|police|emergency|danger)/i
  };

  // Identify matching intent
  let matchedIntent = 'GENERAL';
  for (const [key, regex] of Object.entries(intents)) {
    if (regex.test(query)) {
      matchedIntent = key;
      break;
    }
  }

  // Construct response based on intent and real temple data
  let voiceResponseHi = '';
  let voiceResponseEn = '';
  let cards = [];
  let quickActions = [];

  switch (matchedIntent) {
    case 'CROWD': {
      const wait = temple.wait_time_minutes;
      const count = temple.current_devotees.toLocaleString('hi-IN');
      const status = temple.crowd_status_hi;
      voiceResponseHi = `${temple.name_hi} में इस समय ${status} है। मंदिर परिसर में लगभग ${count} श्रद्धालु उपस्थित हैं। दर्शन में लगभग ${wait} मिनट का समय लगेगा।`;
      voiceResponseEn = `Currently at ${temple.name_en}, there is ${temple.crowd_status_en}. Approximately ${temple.current_devotees.toLocaleString()} devotees are in the complex. Expected darshan time is ${wait} minutes.`;
      
      cards.push({
        title: temple.crowd_status_hi,
        subtitle: `वर्तमान प्रतीक्षा: ${wait} मिनट | श्रद्धालु: ~${count}`,
        icon: 'Users',
        badge: temple.crowd_level,
        color: temple.occupancy_pct > 70 ? 'orange' : 'teal'
      });
      break;
    }

    case 'WAIT_TIME': {
      const wait = temple.wait_time_minutes;
      const seniorGate = temple.gates.find(g => g.is_elderly_friendly) || temple.gates[0];
      voiceResponseHi = `दर्शन में इस समय लगभग ${wait} मिनट की प्रतीक्षा है। यदि आपके साथ कोई बुजुर्ग या दिव्यांग हैं, तो ${seniorGate.name_hi} से जाएं, जहाँ प्रतीक्षा केवल ${seniorGate.wait} है।`;
      voiceResponseEn = `Expected wait time for Darshan is around ${wait} minutes. For seniors and divyang devotees, please use ${seniorGate.name_en} where wait time is only ${seniorGate.wait}.`;

      cards.push({
        title: `दर्शन प्रतीक्षा: ${wait} मिनट`,
        subtitle: `वरिष्ठ नागरिकों हेतु सुगम गेट: ${seniorGate.name_hi} (${seniorGate.wait})`,
        icon: 'Clock',
        badge: 'LIVE',
        color: 'teal'
      });
      break;
    }

    case 'WASHROOM': {
      const washroom = temple.facilities.find(f => f.type === 'WASHROOM');
      if (washroom) {
        voiceResponseHi = `शौचालय ${washroom.location_hi} स्थित है। यहाँ से दूरी लगभग ${washroom.distance_meters} मीटर (लगभग ${washroom.approx_steps} कदम) है। यह बुजुर्गों एवं व्हीलचेयर हेतु सुगम है।`;
        voiceResponseEn = `The nearest restroom is located at ${washroom.location_hi}, about ${washroom.distance_meters} meters away (${washroom.approx_steps} steps). Accessible ramps available.`;
        cards.push({
          title: washroom.name_hi,
          subtitle: `${washroom.location_hi} (दूरी: ${washroom.distance_meters} मीटर / ${washroom.approx_steps} कदम)`,
          icon: 'Bath',
          distance: `${washroom.distance_meters}m`,
          badge: 'सुगम रैंप युक्त',
          color: 'teal'
        });
      }
      break;
    }

    case 'WATER': {
      const water = temple.facilities.find(f => f.type === 'WATER');
      if (water) {
        voiceResponseHi = `पीने के शुद्ध शीतल जल की व्यवस्था ${water.location_hi} पर है। यह यहाँ से मात्र ${water.distance_meters} मीटर की दूरी पर है।`;
        voiceResponseEn = `Cold drinking water is available at ${water.location_hi}, approximately ${water.distance_meters} meters away.`;
        cards.push({
          title: water.name_hi,
          subtitle: `${water.location_hi} (दूरी: ${water.distance_meters} मीटर)`,
          icon: 'Droplets',
          distance: `${water.distance_meters}m`,
          badge: 'निःशुल्क RO जल',
          color: 'teal'
        });
      }
      break;
    }

    case 'SHOES': {
      const shoe = temple.facilities.find(f => f.type === 'SHOES');
      if (shoe) {
        voiceResponseHi = `जूता-चप्पल जमा करने का स्टैंड ${shoe.location_hi} पर है। यहाँ से दूरी लगभग ${shoe.distance_meters} मीटर है। यहाँ निःशुल्क टोकन दिया जाता है।`;
        voiceResponseEn = `The footwear counter is located at ${shoe.location_hi}, ${shoe.distance_meters} meters away. Free token system available.`;
        cards.push({
          title: shoe.name_hi,
          subtitle: `${shoe.location_hi} (दूरी: ${shoe.distance_meters} मीटर)`,
          icon: 'Footprints',
          distance: `${shoe.distance_meters}m`,
          badge: 'सुरक्षित निःशुल्क',
          color: 'forest'
        });
      }
      break;
    }

    case 'MEDICAL': {
      const med = temple.facilities.find(f => f.type === 'MEDICAL');
      voiceResponseHi = `चिकित्सा सहायता केंद्र ${med.location_hi} पर स्थित है। दूरी ${med.distance_meters} मीटर है। आपातकालीन हेल्पलाइन नंबर ${med.phone || temple.helpline} है। डॉक्टर एवं एम्बुलेंस 24 घंटे तैनात हैं।`;
      voiceResponseEn = `Medical aid post is situated at ${med.location_hi}, ${med.distance_meters} meters away. Helpline: ${med.phone || temple.helpline}. Doctors and ambulance on standby.`;
      cards.push({
        title: med.name_hi,
        subtitle: `${med.location_hi} | फोन: ${med.phone || temple.helpline}`,
        icon: 'HeartPulse',
        distance: `${med.distance_meters}m`,
        badge: '24/7 आपातकाल',
        color: 'red'
      });
      break;
    }

    case 'WHEELCHAIR': {
      const wc = temple.facilities.find(f => f.type === 'WHEELCHAIR');
      voiceResponseHi = `बुजुर्गों एवं दिव्यांगों हेतु निःशुल्क व्हीलचेयर ${wc.location_hi} पर उपलब्ध है। यहाँ से दूरी ${wc.distance_meters} मीटर है। साथ में सहायता हेतु सेवक भी उपलब्ध हैं।`;
      voiceResponseEn = `Complimentary wheelchair assistance is stationed at ${wc.location_hi}, ${wc.distance_meters} meters away. Dedicated assistants available.`;
      cards.push({
        title: wc.name_hi,
        subtitle: `${wc.location_hi} (दूरी: ${wc.distance_meters} मीटर)`,
        icon: 'Accessibility',
        distance: `${wc.distance_meters}m`,
        badge: 'निःशुल्क सेवा',
        color: 'saffron'
      });
      break;
    }

    case 'AARTI': {
      const aartis = temple.aarti_timings.map(a => `${a.name_hi}: ${a.time}`).join(', ');
      voiceResponseHi = `${temple.name_hi} में आरती का समय इस प्रकार है: ${aartis}। कृपया आरती से 20 मिनट पूर्व कतार में स्थान लें।`;
      voiceResponseEn = `Aarti timings at ${temple.name_en}: ${temple.aarti_timings.map(a => `${a.name_en}: ${a.time}`).join(', ')}. Please assemble 20 minutes prior.`;
      temple.aarti_timings.forEach(a => {
        cards.push({
          title: a.name_hi,
          subtitle: `समय: ${a.time} (${a.status})`,
          icon: 'Flame',
          badge: a.time,
          color: 'saffron'
        });
      });
      break;
    }

    case 'PRASAD': {
      const prasad = temple.facilities.find(f => f.type === 'PRASAD');
      voiceResponseHi = `शुद्ध प्रसाद काउंटर ${prasad.location_hi} पर स्थित है। यहाँ से दूरी लगभग ${prasad.distance_meters} मीटर है।`;
      voiceResponseEn = `Sacred Prasad counter is located at ${prasad.location_hi}, ${prasad.distance_meters} meters away.`;
      cards.push({
        title: prasad.name_hi,
        subtitle: `${prasad.location_hi} (दूरी: ${prasad.distance_meters} मीटर)`,
        icon: 'Gift',
        distance: `${prasad.distance_meters}m`,
        badge: 'शुद्ध सामग्री',
        color: 'saffron'
      });
      break;
    }

    case 'PARKING': {
      const park = temple.facilities.find(f => f.type === 'PARKING');
      voiceResponseHi = `मुख्य वाहन पार्किंग ${park.location_hi} पर है। यहाँ से बुजुर्गों हेतु निःशुल्क ई-रिक्शा सेवा उपलब्ध है।`;
      voiceResponseEn = `Main parking is located at ${park.location_hi}. Free e-rickshaw shuttle is available for seniors.`;
      cards.push({
        title: park.name_hi,
        subtitle: `${park.location_hi} (दूरी: ${park.distance_meters} मीटर)`,
        icon: 'Car',
        distance: `${park.distance_meters}m`,
        badge: 'ई-रिक्शा उपलब्ध',
        color: 'forest'
      });
      break;
    }

    case 'ROPEWAY': {
      if (temple.ropeway_status) {
        const rw = temple.ropeway_status;
        voiceResponseHi = `पावागढ़ उडनखटोला (रोपवे) सामान्य रूप से चालू है। वर्तमान प्रतीक्षा समय लगभग ${rw.wait_minutes} मिनट है। वरिष्ठ नागरिकों हेतु विशेष प्राथमिकता कतार है।`;
        voiceResponseEn = `Pavagadh Ropeway is operating smoothly. Current wait time is about ${rw.wait_minutes} minutes. Senior citizens have priority queue.`;
        cards.push({
          title: 'माँ महाकाली उडनखटोला (रोपवे)',
          subtitle: `स्थिति: चालू | प्रतीक्षा: ~${rw.wait_minutes} मिनट`,
          icon: 'Mountain',
          badge: 'वरिष्ठ प्राथमिकता',
          color: 'teal'
        });
      } else {
        voiceResponseHi = `${temple.name_hi} में रोपवे सेवा की आवश्यकता नहीं है। मंदिर भूतल पर सुगम स्थित है।`;
        voiceResponseEn = `Ropeway is not applicable at ${temple.name_en}. The temple is directly accessible on ground.`;
      }
      break;
    }

    case 'FAMILY': {
      const points = temple.safe_meet_points.join(', ');
      voiceResponseHi = `यदि परिवार का कोई सदस्य बिछड़ जाए, तो घबराएं नहीं। मंदिर के मुख्य मिलन स्थल हैं: ${points}। आप परिवार रक्षक फीचर में 'मैं यहाँ हूँ' बटन दबाकर अपना स्थान साझा कर सकते हैं।`;
      voiceResponseEn = `If separated from family, do not panic. Safe meeting points are: ${points}. Use Family Companion to check-in or broadcast an alert.`;
      temple.safe_meet_points.forEach((pt, idx) => {
        cards.push({
          title: `निर्धारित मिलन स्थल #${idx + 1}`,
          subtitle: pt,
          icon: 'MapPin',
          badge: 'सुरक्षित स्थान',
          color: 'forest'
        });
      });
      break;
    }

    case 'EMERGENCY': {
      voiceResponseHi = `आपातकाल सहायता! सुरक्षा नियंत्रण कक्ष को अलर्ट भेजा जा सकता है। पुलिस सहायता नंबर ${temple.police_post} और एम्बुलेंस नंबर 108 है। तुरंत निकटतम सुरक्षा कर्मी या गेट 2 मेडिकल पोस्ट से संपर्क करें।`;
      voiceResponseEn = `Emergency Assistance! Security control room can be notified immediately. Police: ${temple.police_post}, Medical: 108. Approach the nearest security personnel at once.`;
      cards.push({
        title: 'आपातकालीन सहायता डेस्क',
        subtitle: `पुलिस: ${temple.police_post} | हेल्पलाइन: ${temple.helpline}`,
        icon: 'AlertTriangle',
        badge: 'URGENT SOS',
        color: 'red'
      });
      break;
    }

    default: {
      voiceResponseHi = `जय श्री। ${temple.name_hi} में इस समय दर्शन सुचारू हैं। प्रतीक्षा समय लगभग ${temple.wait_time_minutes} मिनट है। आप मुझसे भीड़, दर्शन का समय, पीने का पानी, शौचालय, जूता स्टैंड या व्हीलचेयर के बारे में पूछ सकते हैं।`;
      voiceResponseEn = `Greetings. Darshan is running smoothly at ${temple.name_en} with ~${temple.wait_time_minutes} minutes wait. You can ask me about crowd, wait time, water, washrooms, shoes, or wheelchairs.`;
      cards.push({
        title: temple.name_hi,
        subtitle: `दर्शन प्रतीक्षा: ${temple.wait_time_minutes} मिनट | स्थिति: ${temple.crowd_status_hi}`,
        icon: 'Info',
        badge: 'सक्रिय',
        color: 'teal'
      });
      break;
    }
  }

  return {
    query,
    intent: matchedIntent,
    templeId: temple.id,
    templeNameHi: temple.name_hi,
    voiceText: userLanguage === 'en' ? voiceResponseEn : voiceResponseHi,
    displayText: userLanguage === 'en' ? voiceResponseEn : voiceResponseHi,
    cards,
    suggestedQueries: [
      "मंदिर में कितनी भीड़ है?",
      "दर्शन में कितना समय लगेगा?",
      "शौचालय कहाँ है?",
      "पीने का पानी कहाँ मिलेगा?",
      "जूता स्टैंड कहाँ है?",
      "मेडिकल सहायता कहाँ मिलेगी?",
      "व्हीलचेयर कहाँ मिलेगी?",
      "आरती का समय क्या है?"
    ]
  };
}
