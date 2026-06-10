import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { useGeminiLive } from '../../hooks/useGeminiLive';
import { useGeminiChat } from '../../hooks/useGeminiChat';
import {
  Sparkles,
  Phone,
  PhoneOff,
  Send,
  Trash2,
  Bot,
  User,
  Mic,
  MessageCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function AIChatPage() {
  const user = useAuthStore((s) => s.user);
  const { messages, isTyping, clearMessages } = useChatStore();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'voice'
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Voice agent
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyAI1VIuZo1ZA9cRd0IpEjecG83RASOfM_Q';
  const { connect, disconnect, isConnected, isAiSpeaking, transcript, sendText } = useGeminiLive(apiKey);

  // Text chat
  const { sendMessage } = useGeminiChat();

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    
    if (activeTab === 'voice' && isConnected) {
      // Send text through voice WebSocket — AI will speak the response
      sendText(text);
    } else {
      // Send through text chat API
      await sendMessage(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleCall = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-surface dark:bg-dark-surface">
      {/* Header */}
      <div className="shrink-0 border-b border-outline-variant/20 dark:border-dark-surface-container-high/50 bg-white dark:bg-dark-surface-container">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                isConnected
                  ? 'bg-gradient-to-br from-primary-500 to-teal-500 shadow-lg shadow-primary-500/20'
                  : 'bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40'
              }`}>
                <Sparkles className={`w-6 h-6 ${isConnected ? 'text-white' : 'text-primary-500'}`} />
              </div>
              {isConnected && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-dark-surface-container animate-pulse-green" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold text-on-surface dark:text-dark-on-surface">UNICARE AI</h1>
              <p className="text-xs text-on-surface-variant">
                {isConnected
                  ? (isAiSpeaking ? '🔊 Speaking...' : '🎙️ Listening...')
                  : 'Your personal health assistant'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switcher */}
            <div className="flex bg-surface-container-low dark:bg-dark-surface rounded-xl p-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white dark:bg-dark-surface-container shadow-sm text-primary-500'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab('voice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'voice'
                    ? 'bg-white dark:bg-dark-surface-container shadow-sm text-primary-500'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Mic className="w-4 h-4" />
                Voice
              </button>
            </div>

            {/* Clear chat */}
            <button
              onClick={clearMessages}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container-high hover:text-danger-500 transition-all"
              title="Clear all messages"
              id="clear-chat-btn"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat panel — always visible */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" id="chat-messages">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-100 to-teal-100 dark:from-primary-900/30 dark:to-teal-900/30 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-primary-500" />
                </div>
                <h2 className="text-xl font-bold text-on-surface dark:text-dark-on-surface mb-2">
                  Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
                </h2>
                <p className="text-on-surface-variant max-w-md mb-8">
                  I'm your AI health assistant. Ask me anything about health, wellness, diet, fitness, or medications.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                  {[
                    { emoji: '💊', text: 'What are common side effects of ibuprofen?' },
                    { emoji: '🥗', text: 'Suggest a balanced meal plan for weight loss' },
                    { emoji: '😴', text: 'How can I improve my sleep quality?' },
                    { emoji: '🏃', text: 'Create a beginner-friendly workout routine' },
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputText(suggestion.text);
                        inputRef.current?.focus();
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-dark-surface-container border border-outline-variant/20 dark:border-dark-surface-container-high/50
                        text-sm text-left text-on-surface-variant hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all group"
                    >
                      <span className="text-lg">{suggestion.emoji}</span>
                      <span className="group-hover:text-on-surface dark:group-hover:text-dark-on-surface transition-colors">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                    : 'bg-gradient-to-br from-primary-500 to-teal-500 text-white'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message bubble */}
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-tr-md whitespace-pre-wrap'
                      : 'bg-white dark:bg-dark-surface-container border border-outline-variant/20 dark:border-dark-surface-container-high/50 text-on-surface dark:text-dark-on-surface rounded-tl-md markdown-content'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                  <p className={`text-[10px] text-on-surface-variant/60 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {formatTime(msg.timestamp)}
                    {msg.content.startsWith('[Voice]') && (
                      <span className="ml-1">🎙️</span>
                    )}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-dark-surface-container border border-outline-variant/20 dark:border-dark-surface-container-high/50 rounded-2xl rounded-tl-md px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="shrink-0 border-t border-outline-variant/20 dark:border-dark-surface-container-high/50 bg-white dark:bg-dark-surface-container px-6 py-4">
            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeTab === 'voice' && isConnected
                      ? 'Type to send as voice message...'
                      : 'Type your health question...'
                  }
                  rows={1}
                  className="w-full resize-none rounded-xl bg-surface-container-low dark:bg-dark-surface
                    px-4 py-3 pr-12 text-sm text-on-surface dark:text-dark-on-surface placeholder:text-outline
                    border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                  style={{ maxHeight: '120px', minHeight: '48px' }}
                  id="chat-input"
                />
              </div>
              
              {/* Voice call button (when on voice tab) */}
              {activeTab === 'voice' && (
                <button
                  type="button"
                  onClick={toggleCall}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md shrink-0 ${
                    isConnected
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  title={isConnected ? 'End call' : 'Start voice call'}
                  id="voice-call-btn"
                >
                  {isConnected ? <PhoneOff className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                </button>
              )}

              {/* Send button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-12 h-12 rounded-xl bg-primary-500 text-white flex items-center justify-center
                  hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md shrink-0"
                title="Send message"
                id="send-message-btn"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-[10px] text-on-surface-variant/50 mt-2 text-center">
              {activeTab === 'voice' && isConnected
                ? '🎙️ Voice call active — type to send text that UNICARE will speak'
                : 'Powered by Gemini AI • Not a substitute for professional medical advice'
              }
            </p>
          </div>
        </div>

        {/* Voice visualizer panel (shown when voice tab is active) */}
        {activeTab === 'voice' && (
          <div className="w-80 border-l border-outline-variant/20 dark:border-dark-surface-container-high/50 bg-white dark:bg-dark-surface-container flex flex-col items-center justify-center p-8 shrink-0">
            {/* Animated orb */}
            <div className="relative mb-8">
              {/* Pulse rings */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${isConnected ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`w-40 h-40 rounded-full absolute ${isAiSpeaking ? 'bg-primary-500/15 animate-ping' : 'bg-primary-500/5'}`} style={{ animationDuration: '2s' }} />
                <div className={`w-56 h-56 rounded-full absolute ${isAiSpeaking ? 'bg-primary-500/10 animate-ping' : 'bg-transparent'}`} style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
              </div>

              <div className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 ${
                isConnected
                  ? (isAiSpeaking
                    ? 'bg-gradient-to-br from-primary-500 to-teal-500 shadow-2xl shadow-primary-500/30 scale-110'
                    : 'bg-gradient-to-br from-primary-100 to-teal-100 dark:from-primary-900/40 dark:to-teal-900/40 border-4 border-primary-500/50')
                  : 'bg-surface-container dark:bg-dark-surface border-2 border-outline-variant/30'
              }`}>
                {isAiSpeaking ? (
                  <Volume2 className="w-10 h-10 text-white animate-pulse" />
                ) : isConnected ? (
                  <Mic className="w-10 h-10 text-primary-500" />
                ) : (
                  <VolumeX className="w-10 h-10 text-on-surface-variant/40" />
                )}
              </div>
            </div>

            {/* Status */}
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold mb-4 transition-colors ${
              isConnected
                ? (isAiSpeaking
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700'
                  : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700')
                : 'bg-surface-container dark:bg-dark-surface text-on-surface-variant border border-outline-variant/30'
            }`}>
              {isConnected ? (isAiSpeaking ? '● SPEAKING' : '● LISTENING') : '○ OFFLINE'}
            </div>

            <p className="text-sm text-on-surface-variant text-center mb-6 min-h-[40px]">
              {transcript}
            </p>

            {/* Call button */}
            <button
              onClick={toggleCall}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 ${
                isConnected
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'
                  : 'bg-gradient-to-br from-primary-500 to-teal-500 text-white hover:shadow-xl shadow-primary-500/20'
              }`}
              id="voice-main-btn"
            >
              {isConnected ? <PhoneOff className="w-7 h-7" /> : <Phone className="w-7 h-7" />}
            </button>
            <p className="text-xs text-on-surface-variant/50 mt-3">
              {isConnected ? 'Tap to end call' : 'Tap to start call'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
