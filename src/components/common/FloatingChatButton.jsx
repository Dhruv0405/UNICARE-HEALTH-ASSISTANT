import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChatStore } from '../../store/chatStore';
import { useGeminiChat } from '../../hooks/useGeminiChat';
import {
  Sparkles,
  X,
  Send,
  Maximize2,
  Bot,
  User,
} from 'lucide-react';

export default function FloatingChatButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { messages, isTyping } = useChatStore();
  const { sendMessage } = useGeminiChat();
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isTyping) return;
    const text = inputText.trim();
    setInputText('');
    await sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Do not render the floating button on the main AI Chat page to avoid overlapping
  if (location.pathname === '/ai') {
    return null;
  }

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-96 h-[520px] z-50 
            bg-white dark:bg-dark-surface-container rounded-2xl shadow-modal border border-outline-variant/20 dark:border-dark-surface-container-high/50
            flex flex-col overflow-hidden"
          style={{ animation: 'scaleIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
          id="floating-chat-widget"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-500 to-teal-500 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">UNICARE AI</h3>
                <p className="text-[10px] text-white/70">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setIsOpen(false); navigate('/ai'); }}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Open full chat"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-primary-500" />
                </div>
                <p className="text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1">Hi there! 👋</p>
                <p className="text-xs text-on-surface-variant">Ask me anything about your health.</p>
              </div>
            )}

            {messages.slice(-30).map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === 'user'
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                    : 'bg-gradient-to-br from-primary-500 to-teal-500 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-tr-sm'
                      : 'bg-surface-container-low dark:bg-dark-surface border border-outline-variant/10 dark:border-dark-surface-container-high/30 text-on-surface dark:text-dark-on-surface rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <p className={`text-[9px] text-on-surface-variant/50 mt-0.5 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="bg-surface-container-low dark:bg-dark-surface rounded-xl rounded-tl-sm px-4 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-outline-variant/20 dark:border-dark-surface-container-high/50 px-3 py-2.5">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your health..."
                className="flex-1 bg-surface-container-low dark:bg-dark-surface rounded-lg px-3 py-2.5 text-xs
                  text-on-surface dark:text-dark-on-surface placeholder:text-outline
                  border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                id="floating-chat-input"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-9 h-9 rounded-lg bg-primary-500 text-white flex items-center justify-center
                  hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                id="floating-chat-send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-elevated z-50
          hover:shadow-modal hover:scale-105 active:scale-95 transition-all duration-200
          flex items-center justify-center ${
            isOpen
              ? 'bg-on-surface dark:bg-dark-on-surface text-surface dark:text-dark-surface'
              : 'bg-gradient-to-br from-primary-500 to-teal-500 text-white'
          }`}
        aria-label={isOpen ? 'Close AI Chat' : 'Open AI Health Assistant'}
        id="floating-chat-btn"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            {/* Unread indicator */}
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-dark-surface">
                {messages.length > 9 ? '9+' : messages.length}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
