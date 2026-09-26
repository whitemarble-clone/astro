import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Compass, HelpCircle, ExternalLink, RefreshCw, ChevronDown, Check, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

interface CosmoGuideChatProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchStellarium: () => void;
  currentTrackName?: string;
}

const STARTER_SUGGESTIONS = [
  'How do I polar align an equatorial mount?',
  'What are Dark, Flat, and Bias frames in astrophotography?',
  'How do I use Stellarium Web to locate the Orion Nebula?',
  'Tips to pass the Astrophotography Track Quiz',
  'What are the key astronomical events in 2026?'
];

export const CosmoGuideChat: React.FC<CosmoGuideChatProps> = ({
  isOpen,
  onClose,
  onLaunchStellarium,
  currentTrackName
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: `Greetings, stargazer! 🔭 I am **CosmoGuide AI**, the Astronomy Society's observatory assistant powered by Gemini. Ask me anything about course lessons, telescope optics, astrophotography calibration, star charts, or upcoming celestial events!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.8-flash'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          conversationHistory: messages.slice(-4).map(m => ({ sender: m.sender, text: m.text }))
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply || "Clear skies! I'm here to assist with your astronomical inquiries.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini-3.8-flash'
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn('Network call failed, utilizing client astronomy knowledge:', err);
      // Fallback response
      const fallbackReply = generateFallbackAstronomyAnswer(query);
      const botMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'observatory-offline-backup'
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'assistant',
        text: 'Observatory log cleared. Ask any astronomical or course-related question!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] h-[560px] max-h-[85vh] bg-[#0b101d] border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-cyan-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white tracking-wide">CosmoGuide AI</h3>
              <span className="text-[9px] bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono px-1.5 py-0.2 rounded-full">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Observatory Tutor & Research Fellow</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onLaunchStellarium}
            title="Launch Stellarium Web"
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 rounded-lg transition"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            title="Reset Chat"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Minimize"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stellarium Web Quick Action Ribbon */}
      <div className="bg-cyan-950/40 border-b border-cyan-800/30 px-3.5 py-1.5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Interactive Sky Simulation:</span>
        </div>
        <button
          onClick={onLaunchStellarium}
          className="text-[10px] font-mono font-medium text-cyan-400 hover:text-cyan-200 underline flex items-center gap-1"
        >
          <span>Open Stellarium Web</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-slate-100 ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800/80 rounded-tl-none leading-relaxed'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs">
                  {formatMarkdown(msg.text)}
                </div>
              </div>

              <div className="flex items-center gap-2 px-1 text-[9px] text-slate-500 font-mono">
                <span>{msg.timestamp}</span>
                {!isUser && (
                  <>
                    <span>•</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-300 transition flex items-center gap-0.5"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <span>Copy</span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 bg-slate-900/50 rounded-xl px-3 border border-slate-800/50 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span className="font-mono text-[11px]">Consulting astronomical data stream...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Drawer */}
      {messages.length < 4 && (
        <div className="px-3 pb-2 pt-1 border-t border-slate-800/60 bg-slate-950/60">
          <p className="text-[10px] text-slate-400 font-medium mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            <span>Suggested Questions:</span>
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {STARTER_SUGGESTIONS.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 px-2 py-1 rounded-lg transition text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask CosmoGuide about astronomy, lessons..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 bg-gradient-to-tr from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl shadow-md transition"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

// Helper: Simple markdown rendering for clean display
function formatMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Client Fallback Knowledge Generator
function generateFallbackAstronomyAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('polar') || q.includes('mount') || q.includes('equatorial')) {
    return "🔭 **Polar Alignment Essentials**:\n\n1. Level the tripod precisely.\n2. Match altitude axis to your local latitude.\n3. Align your reticle crosshair with Polaris (or Octantis).\n4. Perform drift alignment: star drifting north/south indicates azimuth or altitude deviation.";
  }
  if (q.includes('flat') || q.includes('dark') || q.includes('bias')) {
    return "📷 **Calibration Frames Breakdown**:\n\n- **Dark Frames**: Match exposure, ISO, temperature; telescope capped to eliminate thermal noise.\n- **Flat Frames**: Uniform light panel to correct optical vignetting and sensor dust.\n- **Bias Frames**: Ultra-fast exposure (1/4000s) to map camera electronic readout noise.";
  }
  if (q.includes('stellarium')) {
    return "🌌 **Stellarium Web Guide**:\n\nClick the top **🔭 Stellarium** button or visit `https://stellarium-web.org`. Use Search to find Messier deep-sky objects (e.g. M42, M31) and match your local horizon!";
  }
  if (q.includes('quiz') || q.includes('exam')) {
    return "📝 **Quiz Strategy**:\n\nCarefully review key terms: RA & Dec coordinates, camera calibration ratios, and telescope focal ratios (f/4 is fast for deep sky, f/10 provides high magnification for planetary surfaces). A score of 70% earns you certification, and 100% unlocks the Quiz Ace badge!";
  }

  return `✨ **CosmoGuide Note on "${query}"**:\n\nIn observational astronomy, verifying your telescope collimation, checking the lunar phase, and matching target coordinates in Stellarium Web will provide optimal clarity. Let me know if you would like step-by-step guidance on this specific module!`;
}
