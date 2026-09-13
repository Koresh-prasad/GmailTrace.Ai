import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Shield,
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  RotateCcw,
  MessageSquare,
  Lock,
  Cpu
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { api } from '../../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export const FloatingCopilot: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check if current route is /results/:scanId
  const matchResult = location.pathname.match(/^\/results\/([^/]+)/);
  const activeScanId = matchResult ? matchResult[1] : null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message depending on route
  useEffect(() => {
    if (activeScanId) {
      setMessages([
        {
          id: 'welcome-context',
          sender: 'assistant',
          content: `Hello! I am MailShield AI Copilot in Context-Aware Mode for Case #${activeScanId.slice(0, 8)}. I have loaded the forensic header analysis, IP hop triangulation, and cryptographic evaluations for this email. How can I assist you?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      setMessages([
        {
          id: 'welcome-general',
          sender: 'assistant',
          content: `Hello! I am your MailShield Cybersecurity Copilot. Ask me about SPF, DKIM, DMARC protocols, email forensic procedures, or how to spot sophisticated spear-phishing attacks.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [activeScanId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Quick reply chips
  const quickChips = activeScanId
    ? [
        'Why is this email flagged?',
        'Where is this IP really located?',
        'Is this safe to click?',
        'Explain SPF/DKIM results'
      ]
    : [
        'What is phishing?',
        'How do I check SPF & DKIM records?',
        'What does CERT-In do?',
        'How to report malicious emails?'
      ];

  // Streaming typewriter simulator for realistic AI feel
  const streamResponse = async (fullText: string, messageId: string) => {
    const words = fullText.split(' ');
    let displayed = '';

    for (let i = 0; i < words.length; i++) {
      displayed += (i > 0 ? ' ' : '') + words[i];
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, content: displayed } : m))
      );
      await new Promise((r) => setTimeout(r, 28));
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isStreaming: false } : m))
    );
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isTyping) return;

    setInputQuery('');

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const botMsgId = `bot-${Date.now()}`;
    const initialBotMsg: ChatMessage = {
      id: botMsgId,
      sender: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    setMessages((prev) => [...prev, initialBotMsg]);

    try {
      let responseText = '';
      if (activeScanId) {
        const res = await api.askCopilot(activeScanId, query);
        responseText = res.answer;
      } else {
        const res = await api.chatGeneral(query);
        responseText = res.answer;
      }

      setIsTyping(false);
      await streamResponse(responseText, botMsgId);
    } catch (err: any) {
      setIsTyping(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? {
                ...m,
                content:
                  'Unable to reach forensic copilot backend. Please verify that the server is operational.',
                isStreaming: false
              }
            : m
        )
      );
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        content: activeScanId
          ? `Chat reset. Ready to answer further questions for Case #${activeScanId.slice(0, 8)}.`
          : `Chat reset. Ask me any email forensic or cybersecurity questions.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary via-blue-600 to-accent text-white shadow-glow-primary border border-white/20 flex items-center justify-center cursor-pointer select-none group p-1 overflow-hidden"
          aria-label="Open AI Copilot"
        >
          <img
            src="/chatbot-avatar.jpg"
            alt="MailShield AI Bot"
            className="w-full h-full object-cover rounded-xl transition-transform group-hover:scale-110"
          />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent border-2 border-background animate-pulse" />
        </motion.button>
      )}

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-[360px] sm:w-[420px] h-[540px] rounded-2xl glass-panel shadow-2xl border border-border/80 flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-border/70 bg-surface/90 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-primary/30 shadow-glow-primary shrink-0">
                  <img
                    src="/chatbot-avatar.jpg"
                    alt="Bot Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-sm text-text-primary">
                      MailShield Copilot
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary">
                      AI
                    </span>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono block -mt-0.5">
                    {activeScanId ? `Context: Case #${activeScanId.slice(0, 8)}` : 'General Cyber Advisor'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isUser && (
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-primary/40 shadow-sm mb-1">
                          <img src="/chatbot-avatar.jpg" alt="Bot" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl relative group ${
                          isUser
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                            : 'bg-surface/90 text-text-primary border border-border/70 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line leading-relaxed">{m.content}</p>

                        {/* Copy response button for AI */}
                        {!isUser && m.content && (
                          <button
                            onClick={() => handleCopy(m.content, m.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-surface border border-border text-text-muted hover:text-primary"
                            title="Copy message"
                          >
                            {copiedId === m.id ? (
                              <Check size={11} className="text-accent" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-text-muted mt-1 px-1 font-mono">
                      {m.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Typing indicator (animated dots) */}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-primary/40 shadow-sm mb-1">
                    <img src="/chatbot-avatar.jpg" alt="Bot" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl rounded-bl-none bg-surface/90 border border-border/70 w-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick-Reply Chips */}
            <div className="px-3 py-2 border-t border-border/60 bg-surface/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="whitespace-nowrap text-[10px] font-medium px-2.5 py-1 rounded-full bg-surface border border-border/80 text-text-muted hover:text-primary hover:border-primary/50 transition-colors shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-border/70 bg-surface/90 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={activeScanId ? 'Ask question about this case...' : 'Ask about email threats...'}
                className="flex-1 rounded-xl bg-background/80 border border-border px-3 py-2 text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2 rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-40 transition-colors shadow-glow-primary"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
