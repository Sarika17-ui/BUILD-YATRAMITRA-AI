import { parseAndResolveVoiceQuery } from './services/intentService.js';

const queries = [
  "मंदिर में कितनी भीड़ है?",
  "दर्शन में कितना समय लगेगा?",
  "शौचालय कहाँ है?",
  "पीने का पानी कहाँ मिलेगा?",
  "मेडिकल सहायता कहाँ मिलेगी?",
  "पार्किंग कहाँ है?",
  "जूता स्टैंड कहाँ है?",
  "व्हीलचेयर कहाँ मिलेगी?"
];

console.log("=== TESTING HINDI VOICE INTENT PARSER ===");
for (const q of queries) {
  const res = parseAndResolveVoiceQuery(q, 'somnath', 'hi');
  console.log(`\nQ: "${q}" => Intent: [${res.intent}]`);
  console.log(`Voice Output: "${res.voiceText}"`);
  console.log(`Cards returned: ${res.cards.length}`);
}
