import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Users, 
  Droplets, 
  Bath, 
  Footprints, 
  HeartPulse, 
  Accessibility, 
  Flame, 
  Car, 
  Gift, 
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { parseAndResolveVoiceQuery } from '../../../server/services/intentService.js'; // Fallback import or local resolver

export default function BoloYatraVoiceModal() {
  const { 
    isVoiceModalOpen, 
    setIsVoiceModalOpen, 
    currentTemple, 
    language, 
    isBuzurgMode, 
    speakText, 
    stopSpeaking,
    isSpeaking 
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      sender: 'bot',
      text: language === 'hi' 
        ? `जय सोमनाथ! मैं यात्रामित्र हूँ। आप मुझसे मंदिर में भीड़, दर्शन प्रतीक्षा, शौचालय, पानी या जूता स्टैंड के बारे में पूछ सकते हैं।`
        : `Greetings! I am YatraMitra AI. You can ask me about crowd, wait times, washrooms, water, or shoe counters in Hindi or English.`,
      cards: []
    }
  ]);

  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  // Initialize SpeechRecognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          if (event.results[0].isFinal) {
            handleProcessQuery(currentTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language, currentTemple.id]);

  // Auto scroll conversation to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, isLoading, isListening]);

  if (!isVoiceModalOpen) return null;

  // Toggle listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(language === 'hi' 
        ? "आपके ब्राउज़र में आवाज़ पहचान (Web Speech API) सीधे सक्रिय नहीं है। कृपया नीचे दिए गए टेक्स्ट बॉक्स में लिखकर पूछें।" 
        : "Speech Recognition is not directly supported in this browser. Please use the text input below.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      stopSpeaking();
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition start error:", e);
      }
    }
  };

  // Process user query (via Backend API or local intelligent engine)
  const handleProcessQuery = async (queryText) => {
    const textToProcess = (queryText || inputText).trim();
    if (!textToProcess) return;

    setInputText('');
    setTranscript('');
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }

    // Add user query to conversation
    setConversation(prev => [...prev, { sender: 'user', text: textToProcess }]);
    setIsLoading(true);

    try {
      // First attempt: call backend API
      const res = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToProcess,
          templeId: currentTemple.id,
          language: language
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const botData = json.data;
        setConversation(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            text: botData.displayText, 
            cards: botData.cards || [],
            voiceText: botData.voiceText
          }
        ]);
        // Speak response aloud!
        speakText(botData.voiceText);
      } else {
        throw new Error("Backend response error");
      }
    } catch (err) {
      // Fallback: Local client-side intelligence
      const fallbackResult = localIntentResolver(textToProcess, currentTemple, language);
      setConversation(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text: fallbackResult.text, 
          cards: fallbackResult.cards,
          voiceText: fallbackResult.text 
        }
      ]);
      speakText(fallbackResult.text);
    } finally {
      setIsLoading(false);
    }
  };

  // Repeat last bot utterance
  const handleRepeatSpeech = (text) => {
    if (text) {
      speakText(text);
    }
  };

  const getCardIcon = (iconName) => {
    switch (iconName) {
      case 'Users': return <Users className="w-5 h-5 text-[#E36414]" />;
      case 'Clock': return <Clock className="w-5 h-5 text-[#0F4C5C]" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'Bath': return <Bath className="w-5 h-5 text-teal-600" />;
      case 'Footprints': return <Footprints className="w-5 h-5 text-amber-700" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-red-600" />;
      case 'Accessibility': return <Accessibility className="w-5 h-5 text-emerald-600" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Car': return <Car className="w-5 h-5 text-indigo-600" />;
      case 'Gift': return <Gift className="w-5 h-5 text-pink-600" />;
      default: return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-200/90 max-h-[92vh] ${
        isBuzurgMode ? 'ring-4 ring-amber-400' : ''
      }`}>
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F4C5C] to-[#114B5F] text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E36414] to-[#FB8500] flex items-center justify-center shadow-md">
              <Mic className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-devanagari tracking-tight">
                  {language === 'hi' ? 'बोलो यात्रा - हिंदी वॉयस असिस्टेंट' : 'Bolo Yatra Voice Assistant'}
                </h2>
                {isBuzurgMode && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#0F4C5C] text-[10px] font-black uppercase">
                    बुजुर्ग साथी
                  </span>
                )}
              </div>
              <p className="text-xs text-teal-100">
                {currentTemple.name_hi} • {language === 'hi' ? 'आवाज से पूछें' : 'Speak to inquire'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 rounded-xl bg-amber-500/80 hover:bg-amber-600 text-white transition"
                title="Stop speech"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => {
                stopSpeaking();
                setIsVoiceModalOpen(false);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF7F2]"
        >
          {conversation.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={index} 
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[88%] rounded-2xl p-4 shadow-sm ${
                    isUser
                      ? 'bg-[#0F4C5C] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-amber-200/80 rounded-bl-none'
                  } ${isBuzurgMode ? 'text-lg sm:text-xl leading-relaxed p-5' : 'text-sm sm:text-base'}`}
                >
                  <p className="font-medium whitespace-pre-wrap">{msg.text}</p>

                  {/* Cards rendered inside bot response */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                      {msg.cards.map((card, cIdx) => (
                        <div 
                          key={cIdx}
                          className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3 flex items-start gap-3"
                        >
                          <div className="p-2 rounded-lg bg-white shadow-xs shrink-0 mt-0.5">
                            {getCardIcon(card.icon)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 text-sm sm:text-base">
                                {card.title}
                              </span>
                              {card.badge && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  {card.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                              {card.subtitle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Repeat voice button for bot message */}
                  {!isUser && msg.voiceText && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleRepeatSpeech(msg.voiceText)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E36414] hover:text-[#C84C04] transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'पुनः सुनें (Repeat)' : 'Repeat Audio'}</span>
                      </button>
                      <span className="text-[10px] text-slate-400">YatraMitra Verified</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Live listening transcription or loading indicator */}
          {isListening && (
            <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-[#5C3D2E]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-6 bg-[#E36414] rounded-full wave-bar-1" />
                <span className="w-2 h-8 bg-[#E36414] rounded-full wave-bar-2" />
                <span className="w-2 h-5 bg-[#E36414] rounded-full wave-bar-3" />
                <span className="w-2 h-9 bg-[#E36414] rounded-full wave-bar-4" />
                <span className="w-2 h-4 bg-[#E36414] rounded-full wave-bar-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-[#E36414] uppercase tracking-wider block">
                  {language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now'}
                </span>
                <p className="text-base font-semibold text-slate-800">
                  {transcript || (language === 'hi' ? 'हिंदी में बोलें...' : 'Speak in Hindi or English...')}
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm p-3">
              <span className="w-2 h-2 rounded-full bg-[#0F4C5C] animate-ping" />
              <span>{language === 'hi' ? 'जानकारी प्राप्त की जा रही है...' : 'Retrieving temple information...'}</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wide">
            {language === 'hi' ? 'जल्दी पूछें:' : 'Quick ask:'}
          </span>
          {[
            "मंदिर में कितनी भीड़ है?",
            "दर्शन में कितना समय लगेगा?",
            "शौचालय कहाँ है?",
            "पीने का पानी कहाँ मिलेगा?",
            "मेडिकल सहायता कहाँ मिलेगी?",
            "पार्किंग कहाँ है?",
            "जूता स्टैंड कहाँ है?",
            "व्हीलचेयर कहाँ मिलेगी?"
          ].map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleProcessQuery(prompt)}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-[#0F4C5C] border border-amber-200 text-xs font-semibold transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Voice & Text Input Control Bar */}
        <div className="p-4 bg-white border-t border-amber-200/80 flex flex-col sm:flex-row items-center gap-3">
          {/* Giant Mic Button */}
          <button
            onClick={toggleListening}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-md ${
              isListening
                ? 'bg-red-600 text-white ring-4 ring-red-200 animate-pulse'
                : 'bg-gradient-to-r from-[#E36414] to-[#FB8500] hover:from-[#C84C04] hover:to-[#E36414] text-white active:scale-95'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 animate-spin" />
                <span className="text-base font-devanagari">{language === 'hi' ? 'बोलना बंद करें' : 'Stop Listening'}</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 animate-pulse" />
                <span className="text-base font-devanagari">{language === 'hi' ? 'माइक दबाकर बोलें' : 'Tap to Speak'}</span>
              </>
            )}
          </button>

          {/* Text Input Fallback */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessQuery();
            }}
            className="w-full flex-1 flex items-center gap-2"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'hi' ? 'या यहाँ लिखकर पूछें (उदा. शौचालय, पानी)...' : 'Or type your question here...'}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-sm sm:text-base font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-[#0F4C5C] hover:bg-[#114B5F] disabled:opacity-40 text-white transition shadow-sm"
              title="Send question"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Client-side local intent fallback
function localIntentResolver(query, temple, lang) {
  const q = (query || '').toLowerCase();
  
  if (/भीड़|रश|crowd/i.test(q)) {
    return {
      text: `${temple.name_hi} में इस समय ${temple.crowd_status_hi} है। दर्शन में लगभग ${temple.wait_time_minutes} मिनट की प्रतीक्षा है।`,
      cards: [{ title: temple.crowd_status_hi, subtitle: `प्रतीक्षा: ${temple.wait_time_minutes} मिनट`, icon: 'Users' }]
    };
  }
  if (/समय|देर|प्रतीक्षा|wait/i.test(q)) {
    return {
      text: `दर्शन में लगभग ${temple.wait_time_minutes} मिनट लगेंगे। बुजुर्गों हेतु गेट 2 सुगम कतार उपलब्ध है।`,
      cards: [{ title: `प्रतीक्षा: ${temple.wait_time_minutes} मिनट`, subtitle: "वरिष्ठ सुगम कतार", icon: 'Clock' }]
    };
  }
  if (/शौचालय|टॉयलेट|toilet|washroom/i.test(q)) {
    const f = temple.facilities.find(item => item.type === 'WASHROOM') || temple.facilities[1];
    return {
      text: `शौचालय ${f.location_hi} पर है। दूरी लगभग ${f.distance_meters} मीटर है।`,
      cards: [{ title: f.name_hi, subtitle: f.location_hi, icon: 'Bath' }]
    };
  }
  if (/पानी|जल|water/i.test(q)) {
    const f = temple.facilities.find(item => item.type === 'WATER') || temple.facilities[0];
    return {
      text: `पीने का पानी ${f.location_hi} पर उपलब्ध है। दूरी लगभग ${f.distance_meters} मीटर है।`,
      cards: [{ title: f.name_hi, subtitle: f.location_hi, icon: 'Droplets' }]
    };
  }
  if (/जूता|चप्पल|shoe|footwear/i.test(q)) {
    const f = temple.facilities.find(item => item.type === 'SHOES') || temple.facilities[2];
    return {
      text: `जूता-चप्पल स्टैंड ${f.location_hi} पर है। निःशुल्क टोकन सेवा उपलब्ध है।`,
      cards: [{ title: f.name_hi, subtitle: f.location_hi, icon: 'Footprints' }]
    };
  }
  if (/मेडिकल|दवाई|डॉक्टर|first aid/i.test(q)) {
    const f = temple.facilities.find(item => item.type === 'MEDICAL') || temple.facilities[3];
    return {
      text: `चिकित्सा केंद्र ${f.location_hi} पर है। हेल्पलाइन 108 या ${f.phone || temple.helpline} है।`,
      cards: [{ title: f.name_hi, subtitle: `फोन: ${f.phone || temple.helpline}`, icon: 'HeartPulse' }]
    };
  }
  return {
    text: `जय श्री। ${temple.name_hi} में इस समय दर्शन सुचारू हैं। प्रतीक्षा लगभग ${temple.wait_time_minutes} मिनट है।`,
    cards: [{ title: temple.name_hi, subtitle: temple.crowd_status_hi, icon: 'Sparkles' }]
  };
}
