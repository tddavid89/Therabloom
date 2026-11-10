import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  MessageSquareHeart, 
  Heart, 
  ShieldAlert, 
  Bot, 
  User, 
  Bookmark, 
  Trash2, 
  RefreshCw,
  Compass,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { JournalMessage, JournalEntry, Theme, Session, Homework } from '../types/therapy';
import { fireCelebration } from '../utils/confetti';

interface JournalCompanionProps {
  themes: Theme[];
  recentSessions: Session[];
  activeHomework: Homework[];
  onSaveJournalEntry: (entry: JournalEntry) => void;
  initialPrompt?: string;
  activeModalities?: string[];
}

export const JournalCompanion: React.FC<JournalCompanionProps> = ({
  themes,
  recentSessions,
  activeHomework,
  onSaveJournalEntry,
  initialPrompt,
  activeModalities,
}) => {
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const handleSpeakText = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };
  const [messages, setMessages] = useState<JournalMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content: `Hello, I'm Soma. I'm here as your compassionate between-session reflection partner. 

Whether you're feeling an anxious knot in your stomach, celebrating a boundary you held, or preparing your thoughts for your next session with ${recentSessions[0]?.counselorName || 'your therapist'}, we can gently unpack it together.

You can type or tap the microphone to speak your thoughts hands-free. What feels most present in your body or mind right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>('Open Reflection');
  const [savedTakeawayToast, setSavedTakeawayToast] = useState<string | null>(null);

  // Web Speech API state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, interimTranscript]);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcriptPiece + ' ';
          } else {
            currentInterim += transcriptPiece;
          }
        }

        if (finalChunk) {
          setInput((prev) => (prev ? `${prev.trim()} ${finalChunk.trim()}` : finalChunk.trim()));
          setInterimTranscript('');
        } else {
          setInterimTranscript(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access to speak hands-free.');
        } else if (event.error === 'no-speech') {
          // Normal timeout when quiet, keep ready
        } else {
          setSpeechError(`Speech error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.error('Failed to initialize SpeechRecognition:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      setSpeechError('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
      } catch (err: any) {
        console.error('Error starting speech recognition:', err);
        // If already started or pending, restart cleanly
        try {
          recognitionRef.current.abort();
          setTimeout(() => recognitionRef.current?.start(), 150);
        } catch (_) {}
      }
    }
  };

  const starterPrompts = [
    {
      label: '⚡ Unpack a Trigger',
      mode: 'Unpack Trigger',
      text: 'I just had a stressful interaction and my nervous system feels activated. Can you help me unpack what happened?',
    },
    {
      label: '🛡️ Process Boundary Guilt',
      mode: 'Boundary Guilt',
      text: 'I said "no" to someone today, and now I have a wave of guilt and fear that they are upset with me.',
    },
    {
      label: '💭 CBT Thought Record',
      mode: 'Cognitive Reframe',
      text: 'My mind is caught in a worst-case scenario spiral. Help me examine the evidence like Dr. Brooks taught me.',
    },
    {
      label: '🧘 Somatic Check-In',
      mode: 'Somatic Check-In',
      text: 'I feel physically tense in my chest and throat. Can you guide me through a mindful somatic check-in?',
    },
    {
      label: '📝 Prep for Next Session',
      mode: 'Session Prep',
      text: 'I want to organize what I noticed between sessions so I can bring it to my next counseling appointment.',
    },
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    // If user was speaking, stop recognition before sending
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }

    const userMsg: JournalMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setInterimTranscript('');
    setIsLoading(true);

    try {
      // Build context from active sessions and themes
      const activeThemes = themes.map((t) => t.name);
      const recentNotes = recentSessions.map((s) => `${s.focusTheme}: ${s.summary}`).slice(0, 2).join(' | ');
      const hwTasks = activeHomework.filter((h) => h.status !== 'completed').map((h) => h.title);

      const response = await fetch('/api/chat/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          sessionContext: {
            themes: activeThemes,
            recentNotes,
            activeHomework: hwTasks,
          },
          mode: selectedMode,
          activeModalities: activeModalities || ['CBT', 'Somatic Experiencing'],
        }),
      });

      let reply = '';
      if (response && response.ok) {
        const data = await response.json();
        reply = data.reply;
      }

      const assistantMsg: JournalMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: reply || "I'm holding space for this reflection. Take a slow, steady breath. What does your body notice most strongly right now?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (_err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: "I'm with you in this moment. Take a gentle breath. What feels most important to write down right now?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Maintaining identical saving logic for journal entries
  const handleSaveTakeaway = (msg: JournalMessage) => {
    const entry: JournalEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mode: selectedMode,
      topic: selectedMode,
      content: msg.content,
      moodTag: 'Reflective Insight',
      keyTakeaway: msg.content.slice(0, 140) + '...',
    };

    onSaveJournalEntry(entry);
    fireCelebration();
    setSavedTakeawayToast('Saved insight to your Between-Session Growth Log (+20 XP)');
    setTimeout(() => setSavedTakeawayToast(null), 3500);
  };

  const handleClearChat = () => {
    if (window.confirm('Start a fresh reflection session?')) {
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      setMessages([
        {
          id: `m-${Date.now()}`,
          role: 'assistant',
          content: 'Starting fresh. What would you like to reflect on right now?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4 text-[#A3E635]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E2922]">
              Soma: Guided Journaling Companion
            </h2>
          </div>
          <p className="text-xs text-[#607066] mt-0.5">
            Compassionate, CBT & somatic-informed reflection grounded in your therapy session notes (with Hands-Free Voice Recording)
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs text-[#607066] hover:text-[#1E2922] flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-[#E8E2D9] bg-white hover:bg-[#FAF8F5] transition cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>New Reflection</span>
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {starterPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedMode(p.mode);
              handleSendMessage(p.text);
            }}
            className="px-3 py-1.5 rounded-full bg-white border border-[#E8E2D9] hover:border-[#2D5A43] hover:text-[#2D5A43] text-xs font-medium text-[#4A574E] whitespace-nowrap transition cursor-pointer shadow-2xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Speech Error Banner if any */}
      {speechError && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{speechError}</span>
          </div>
          <button
            onClick={() => setSpeechError(null)}
            className="text-[11px] text-amber-700 hover:underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Chat Window */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xs flex flex-col h-[560px] overflow-hidden">
        
        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FCFBF9]">
          {messages.map((m) => {
            const isAsst = m.role === 'assistant';

            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${isAsst ? 'justify-start' : 'justify-end'}`}
              >
                {isAsst && (
                  <div className="w-8 h-8 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4 text-[#A3E635]" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isAsst ? '' : 'text-right'}`}>
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-2xs text-left ${
                      isAsst
                        ? 'bg-white border border-[#EAE3DA] text-[#243029]'
                        : 'bg-[#2D5A43] text-white rounded-tr-none'
                    }`}
                  >
                    {m.content}
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] text-[#8C9B90] px-1">
                    <span>{m.timestamp}</span>
                    {isAsst && (
                      <>
                        <button
                          onClick={() => handleSpeakText(m.id, m.content)}
                          className={`hover:underline font-semibold flex items-center space-x-0.5 cursor-pointer ${
                            speakingMessageId === m.id ? 'text-amber-700 font-bold animate-pulse' : 'text-[#607066]'
                          }`}
                          title="Listen to reflection spoken aloud"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{speakingMessageId === m.id ? 'Pause Voice' : 'Listen'}</span>
                        </button>

                        <span>•</span>

                        <button
                          onClick={() => handleSaveTakeaway(m)}
                          className="text-[#2D5A43] hover:underline font-semibold flex items-center space-x-0.5 cursor-pointer"
                          title="Save this reflection into your therapy progress log"
                        >
                          <Bookmark className="w-3 h-3" />
                          <span>Save Insight</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {!isAsst && (
                  <div className="w-8 h-8 rounded-xl bg-[#EFEAE2] text-[#4A574E] flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Active Voice Transcription Preview */}
          {interimTranscript && (
            <div className="flex items-start space-x-3 justify-end animate-fadeIn">
              <div className="max-w-[80%] p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 italic">
                <span className="font-semibold block text-[10px] uppercase tracking-wider text-emerald-700 not-italic mb-0.5 flex items-center space-x-1">
                  <Volume2 className="w-3 h-3 animate-pulse" />
                  <span>Transcribing Voice...</span>
                </span>
                "{interimTranscript}"
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#A3E635]" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#EAE3DA] flex items-center space-x-2 text-xs text-[#607066]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2D5A43]" />
                <span>Soma is reflecting with your therapy notes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Saved Toast Notification */}
        {savedTakeawayToast && (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-center space-x-1.5 border-t border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{savedTakeawayToast}</span>
          </div>
        )}

        {/* Hands-Free Voice Status Indicator */}
        {isListening && (
          <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-900 text-xs font-semibold flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
              <span>🎙️ Hands-Free Voice Recording Active — Speak your reflections naturally...</span>
            </div>
            <button
              onClick={toggleSpeechRecognition}
              className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-700 transition"
            >
              Stop Recording
            </button>
          </div>
        )}

        {/* Input Bar with Web Speech API Microphone Toggle */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#EAE3DA]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={
                !speechSupported
                  ? 'Speech recognition not supported in this browser'
                  : isListening
                  ? 'Stop Voice Recording'
                  : 'Start Hands-Free Voice Reflection (Web Speech API)'
              }
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white shadow-md ring-4 ring-rose-200 animate-pulse'
                  : 'bg-[#F4EFEA] hover:bg-[#EAE3DA] text-[#4A574E] hover:text-[#2D5A43]'
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Textarea */}
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isListening
                  ? 'Listening to your voice... (speak freely)'
                  : "Write or speak your reflections... (Press Enter to send)"
              }
              className="flex-1 py-2.5 px-4 rounded-2xl border border-[#E4DDD3] bg-[#FAF8F5] text-xs sm:text-sm text-[#243029] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 resize-none max-h-28"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !interimTranscript)}
              className="w-10 h-10 rounded-2xl bg-[#2D5A43] hover:bg-[#234734] disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shadow-xs shrink-0"
              title="Send to Soma"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Compassionate Emergency Disclaimer */}
          <div className="mt-2 text-center text-[11px] text-[#8C9B90] flex items-center justify-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-stone-400" />
            <span>
              Soma supports between-session reflection. In crisis? Call or text <strong>988</strong> anytime for free support.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
