import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGeminiLive } from '../../hooks/useGeminiLive';
import { useWakeWord } from '../../hooks/useWakeWord';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import {
  Mic, MicOff, X, Phone, PhoneOff, Volume2, Sparkles,
} from 'lucide-react';

/**
 * Global Voice Assistant — always rendered in MainLayout.
 * 
 * Behavior:
 *  1. Continuously listens for "Hey UNICARE" wake word (when enabled in settings).
 *  2. On detection, opens a full-screen voice overlay and auto-connects Gemini Live.
 *  3. User can speak freely; AI responds via audio.
 *  4. User can close the overlay to return to normal app usage.
 */
export default function GlobalVoiceAssistant() {
  const wakeWordEnabled = useSettingsStore((s) => s.wakeWordEnabled);
  const user = useAuthStore((s) => s.user);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [wakeWordPaused, setWakeWordPaused] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyAI1VIuZo1ZA9cRd0IpEjecG83RASOfM_Q';
  const { connect, disconnect, isConnected, isAiSpeaking, transcript } = useGeminiLive(apiKey);

  const connectAttemptedRef = useRef(false);

  // Wake word callback — open overlay and start voice
  const handleWakeWord = useCallback(() => {
    setOverlayOpen(true);
    setWakeWordPaused(true);
  }, []);

  // Initialize wake word detection
  const { isListening, pause: pauseWakeWord, resume: resumeWakeWord } = useWakeWord({
    enabled: wakeWordEnabled && !wakeWordPaused && !overlayOpen,
    onWakeWord: handleWakeWord,
  });

  // When overlay opens, auto-connect Gemini Live
  useEffect(() => {
    if (overlayOpen && !isConnected && !connectAttemptedRef.current) {
      connectAttemptedRef.current = true;
      // Small delay to let the wake word recognition fully release the mic
      const timer = setTimeout(() => {
        connect();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [overlayOpen, isConnected, connect]);

  // Handle closing the overlay
  const handleClose = useCallback(() => {
    if (isConnected) disconnect();
    setOverlayOpen(false);
    connectAttemptedRef.current = false;
    // Resume wake word after a short delay
    setTimeout(() => {
      setWakeWordPaused(false);
    }, 1000);
  }, [isConnected, disconnect]);

  // Handle toggling the call from within the overlay
  const handleToggleCall = useCallback(() => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  }, [isConnected, connect, disconnect]);

  // Keyboard shortcut and Custom Event
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        if (overlayOpen) handleClose();
        else handleWakeWord();
      } else if (overlayOpen && e.key === 'Escape') {
        handleClose();
      }
    };
    
    const eventHandler = () => {
      if (!overlayOpen) handleWakeWord();
    };
    
    const endSessionHandler = () => {
      if (overlayOpen) handleClose();
    };

    window.addEventListener('keydown', keyHandler);
    window.addEventListener('open-voice-assistant', eventHandler);
    window.addEventListener('voice-session-end', endSessionHandler);
    
    return () => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('open-voice-assistant', eventHandler);
      window.removeEventListener('voice-session-end', endSessionHandler);
    };
  }, [overlayOpen, handleClose, handleWakeWord]);

  return (
    <>
      {/* Full-screen voice overlay */}
      {overlayOpen && (
        <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-black">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white/70
              flex items-center justify-center hover:bg-white/20 hover:text-white transition-all"
            aria-label="Close voice assistant"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Branding */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-400" />
            </div>
            <span className="text-white/60 text-sm font-semibold">UNICARE AI</span>
          </div>

          {/* Main orb */}
          <div className="relative mb-8">
            {/* Pulse rings */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              isConnected ? 'opacity-100' : 'opacity-0'
            }`}>
              <div
                className={`w-48 h-48 rounded-full absolute ${
                  isAiSpeaking ? 'bg-primary-500/20 animate-ping' : 'bg-primary-500/5'
                }`}
                style={{ animationDuration: '2s' }}
              />
              <div
                className={`w-64 h-64 rounded-full absolute ${
                  isAiSpeaking ? 'bg-primary-500/10 animate-ping' : 'bg-transparent'
                }`}
                style={{ animationDuration: '3s', animationDelay: '0.5s' }}
              />
              <div
                className={`w-80 h-80 rounded-full absolute ${
                  isAiSpeaking ? 'bg-teal-500/5 animate-ping' : 'bg-transparent'
                }`}
                style={{ animationDuration: '4s', animationDelay: '1s' }}
              />
            </div>

            {/* Center orb */}
            <div
              className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-700 ${
                isConnected
                  ? isAiSpeaking
                    ? 'bg-gradient-to-br from-primary-500 to-teal-500 shadow-2xl shadow-primary-500/40 scale-110'
                    : 'bg-gradient-to-br from-primary-600/80 to-teal-600/80 border-4 border-primary-400/40 shadow-lg shadow-primary-500/20'
                  : 'bg-white/5 border-2 border-white/20'
              }`}
              style={{
                animation: isAiSpeaking ? 'voiceOrbPulse 1.5s ease-in-out infinite' : 'none',
              }}
            >
              {isAiSpeaking ? (
                <Volume2 className="w-14 h-14 text-white" />
              ) : isConnected ? (
                <Mic className="w-14 h-14 text-primary-300 animate-pulse" />
              ) : (
                <MicOff className="w-14 h-14 text-white/30" />
              )}
            </div>
          </div>

          {/* Status badge */}
          <div className={`px-5 py-2 rounded-full text-sm font-bold mb-4 transition-all duration-500 ${
            isConnected
              ? isAiSpeaking
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                : 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-white/5 text-white/40 border border-white/10'
          }`}>
            {isConnected
              ? isAiSpeaking ? '● Speaking...' : '● Listening...'
              : '○ Connecting...'}
          </div>

          {/* Greeting / Transcript */}
          <p className="text-white/60 text-center max-w-md px-6 text-sm leading-relaxed mb-8 min-h-[40px]">
            {transcript}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleCall}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg
                hover:scale-105 active:scale-95 ${
                isConnected
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/30'
                  : 'bg-gradient-to-br from-primary-500 to-teal-500 text-white hover:shadow-xl shadow-primary-500/30'
              }`}
              aria-label={isConnected ? 'End call' : 'Start call'}
            >
              {isConnected ? <PhoneOff className="w-7 h-7" /> : <Phone className="w-7 h-7" />}
            </button>
          </div>

          <p className="text-white/30 text-xs mt-4">
            {isConnected ? 'Tap to end • Press Esc to close' : 'Tap to reconnect • Press Esc to close'}
          </p>

          {/* User name at bottom */}
          {user?.name && (
            <div className="absolute bottom-6 text-white/20 text-xs">
              Speaking with {user.name.split(' ')[0]}
            </div>
          )}

          {/* Inline animation styles */}
          <style>{`
            @keyframes voiceOrbPulse {
              0%, 100% { transform: scale(1.1); }
              50% { transform: scale(1.15); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
