import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
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
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

export default function VoiceAssistantPage() {
  const { 
    currentTemple, 
    language, 
    isBuzurgMode, 
    speakText, 
    stopSpeaking,
    isSpeaking,
    setActiveTab 
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: language === 'hi' 
        ? `जय सोमनाथ! मैं यात्रामित्र का वॉयस असिस्टेंट हूँ। आप नीचे दिए गए बड़े माइक को दबाकर कुछ भी पूछ सकते हैं। जैसे: "भीड़ कितनी है?", "दर्शन में कितना समय लगेगा?", "शौचालय कहाँ है?" आदि।`
        : `Greetings! I am YatraMitra Voice Assistant. Tap the microphone and ask any question about crowd, waiting times, water, or restrooms in Hindi or English.`,
      cards: [
        { title: currentTemple.crowd_status_hi, subtitle: `वर्तमान प्रतीक्षा: ${currentTemple.wait_time_minutes} मिनट`, icon: 'Users' }
      ]
    }
  ]);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Initialize Web Speech API
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening, isLoading]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(language === 'hi'
        ? "आपके ब्राउज़र में Web Speech Recognition सीधे सक्रिय नहीं है। कृपया नीचे दिए गए टेक्स्ट इनपुट में लिखकर पूछें।"
        : "Speech Recognition is not available in this browser. Please use the text input below.");
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
        console.warn("Error starting mic:", e);
      }
    }
  };

  const handleProcessQuery = async (queryText) => {
    const textToProcess = (queryText || inputText).trim();
    if (!textToProcess) return;

    setInputText('');
    setTranscript('');
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: textToProcess }]);
    setIsLoading(true);

    try {
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
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now() + 1,
            sender: 'bot', 
            text: botData.displayText, 
            cards: botData.cards || [],
            voiceText: botData.voiceText
          }
        ]);
        speakText(botData.voiceText);
      } else {
        throw new Error("Backend query error");
      }
    } catch (err) {
      // Local fallback
      const fallback = localResolve(textToProcess, currentTemple);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1,
          sender: 'bot', 
          text: fallback.text, 
          cards: fallback.cards,
          voiceText: fallback.text 
        }
      ]);
      speakText(fallback.text);
    } finally {
      setIsLoading(false);
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
      default: return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 font-devanagari space-y-6">
      
      {/* Top Banner & Temple Badge */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F4C5C] hover:text-[#114B5F]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य डैशबोर्ड पर लौटें</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-[#5C3D2E] text-xs font-bold border border-amber-300">
          <span>🚩 {currentTemple.name_hi}</span>
        </div>
      </div>

      {/* Main Voice Assistant Console */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/90 shadow-card overflow-hidden flex flex-col min-h-[580px]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F4C5C] to-[#114B5F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E36414] to-[#FB8500] flex items-center justify-center text-white shadow-md">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">बोलो यात्रा - हिंदी वॉयस असिस्टेंट</h2>
              <span className="text-xs text-teal-100">
                Web Speech API • बोलें और सुनें • मंदिर वास्तविक आंकड़े
              </span>
            </div>
          </div>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1"
            >
              <VolumeX className="w-4 h-4" />
              <span>आवाज रोकें</span>
            </button>
          )}
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-[#FAF7F2] max-h-[420px]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-xs ${
                    isUser
                      ? 'bg-[#0F4C5C] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-amber-200/80 rounded-bl-none'
                  } ${isBuzurgMode ? 'text-xl leading-relaxed' : 'text-sm sm:text-base'}`}
                >
                  <p className="font-medium whitespace-pre-wrap">{msg.text}</p>

                  {/* Associated facts cards */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                      {msg.cards.map((c, i) => (
                        <div key={i} className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white shadow-xs shrink-0 mt-0.5">
                            {getCardIcon(c.icon)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-sm sm:text-base block">{c.title}</span>
                            <span className="text-xs sm:text-sm text-slate-600 mt-0.5 block">{c.subtitle}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isUser && msg.voiceText && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => speakText(msg.voiceText)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E36414] hover:text-[#C84C04] transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>पुनः सुनें (Repeat Speech)</span>
                      </button>
                      <span className="text-[10px] text-slate-400">सत्यापित मंदिर जानकारी</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Listening Live Waveform Indicator */}
          {isListening && (
            <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
              <div className="flex items-center gap-1">
                <span className="w-2 h-6 bg-[#E36414] rounded-full wave-bar-1" />
                <span className="w-2 h-10 bg-[#E36414] rounded-full wave-bar-2" />
                <span className="w-2 h-7 bg-[#E36414] rounded-full wave-bar-3" />
                <span className="w-2 h-12 bg-[#E36414] rounded-full wave-bar-4" />
                <span className="w-2 h-5 bg-[#E36414] rounded-full wave-bar-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#E36414] uppercase tracking-wider block">
                  सुन रहा हूँ... बोलिए
                </span>
                <p className="text-base font-semibold text-slate-800">
                  {transcript || "हिंदी में प्रश्न बोलें..."}
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm p-2">
              <span className="w-2 h-2 rounded-full bg-[#0F4C5C] animate-ping" />
              <span>मंदिर डेटाबेस से जानकारी प्राप्त हो रही है...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions Chips */}
        <div className="px-5 py-3 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase">सुझाव प्रश्न:</span>
          {[
            "मंदिर में कितनी भीड़ है?",
            "दर्शन में कितना समय लगेगा?",
            "मेडिकल सहायता कहाँ है?",
            "पार्किंग कहाँ मिलेगी?",
            "शौचालय कहाँ है?",
            "पीने का पानी कहाँ मिलेगा?",
            "जूता स्टैंड कहाँ है?",
            "व्हीलचेयर कहाँ मिलेगी?"
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleProcessQuery(prompt)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-[#0F4C5C] border border-amber-200 text-xs font-semibold transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Big Mic Button & Text Fallback Bar */}
        <div className="p-5 bg-white border-t border-amber-200/90 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={toggleListening}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-md ${
              isListening
                ? 'bg-red-600 text-white ring-4 ring-red-200 animate-pulse'
                : 'bg-gradient-to-r from-[#E36414] to-[#FB8500] hover:from-[#C84C04] hover:to-[#E36414] text-white active:scale-95'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 animate-spin" />
                <span>सुनना बंद करें</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 animate-pulse" />
                <span>माइक दबाएं और बोलें</span>
              </>
            )}
          </button>

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
              placeholder="या यहाँ लिखकर पूछें (उदा. शौचालय, पानी, व्हीलचेयर)..."
              className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] text-sm sm:text-base font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3.5 rounded-2xl bg-[#0F4C5C] hover:bg-[#114B5F] disabled:opacity-40 text-white transition shadow-xs"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

function localResolve(q, temple) {
  const query = (q || '').toLowerCase();
  if (/भीड़|crowd/i.test(query)) {
    return {
      text: `${temple.name_hi} में इस समय ${temple.crowd_status_hi} है। दर्शन में लगभग ${temple.wait_time_minutes} मिनट लगेंगे।`,
      cards: [{ title: temple.crowd_status_hi, subtitle: `प्रतीक्षा: ${temple.wait_time_minutes} मिनट`, icon: 'Users' }]
    };
  }
  if (/समय|देर|wait/i.test(query)) {
    return {
      text: `दर्शन में लगभग ${temple.wait_time_minutes} मिनट की प्रतीक्षा है। बुजुर्गों हेतु गेट 2 सुगम कतार उपलब्ध है।`,
      cards: [{ title: `प्रतीक्षा: ${temple.wait_time_minutes} मिनट`, subtitle: "गेट 2 सुगम कतार", icon: 'Clock' }]
    };
  }
  if (/शौचालय|toilet|washroom/i.test(query)) {
    const f = temple.facilities.find(item => item.type === 'WASHROOM') || temple.facilities[1];
    return {
      text: `शौचालय ${f.location_hi} पर है (दूरी लगभग ${f.distance_meters} मीटर)।`,
      cards: [{ title: f.name_hi, subtitle: f.location_hi, icon: 'Bath' }]
    };
  }
  if (/पानी|जल|water/i.test(query)) {
    const f = temple.facilities.find(item => item.type === 'WATER') || temple.facilities[0];
    return {
      text: `शीतल जल सेवा ${f.location_hi} पर उपलब्ध है (दूरी ${f.distance_meters} मीटर)।`,
      cards: [{ title: f.name_hi, subtitle: f.location_hi, icon: 'Droplets' }]
    };
  }
  if (/मेडिकल|doctor|medical/i.test(query)) {
    const f = temple.facilities.find(item => item.type === 'MEDICAL') || temple.facilities[3];
    return {
      text: `प्राथमिक चिकित्सा केंद्र ${f.location_hi} पर स्थित है। फोन: ${f.phone || temple.helpline}`,
      cards: [{ title: f.name_hi, subtitle: `फोन: ${f.phone || temple.helpline}`, icon: 'HeartPulse' }]
    };
  }
  return {
    text: `जय श्री। ${temple.name_hi} में इस समय दर्शन सुचारू हैं। प्रतीक्षा लगभग ${temple.wait_time_minutes} मिनट है।`,
    cards: [{ title: temple.name_hi, subtitle: temple.crowd_status_hi, icon: 'Sparkles' }]
  };
}
