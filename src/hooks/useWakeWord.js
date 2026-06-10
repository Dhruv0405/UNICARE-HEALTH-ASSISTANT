import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook that continuously listens for "hey unicare" wake word using Web Speech API.
 * When detected, calls the onWakeWord callback.
 * 
 * Only runs when `enabled` is true. Uses continuous recognition with restart-on-end
 * to maintain an always-listening posture.
 */
export function useWakeWord({ enabled = true, onWakeWord }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const enabledRef = useRef(enabled);
  const callbackRef = useRef(onWakeWord);

  // Keep refs up to date
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);
  useEffect(() => { callbackRef.current = onWakeWord; }, [onWakeWord]);

  const startListening = useCallback(() => {
    if (!enabledRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[UNICARE WakeWord] Web Speech API not supported in this browser.');
      return;
    }

    // Clean up previous instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      // Check all results (including interim) for the wake word
      for (let i = event.resultIndex; i < event.results.length; i++) {
        for (let alt = 0; alt < event.results[i].length; alt++) {
          const transcript = event.results[i][alt].transcript.toLowerCase().trim();
          
          // Match various spoken forms of "hey unicare"
          if (
            transcript.includes('hey unicare') ||
            transcript.includes('hey uni care') ||
            transcript.includes('hey you ni care') ||
            transcript.includes('a unicare') ||
            transcript.includes('hey unikar') ||
            transcript.includes('hey unique care') ||
            transcript.includes('unicare')
          ) {
            console.log('[UNICARE WakeWord] Wake word detected:', transcript);
            
            // Stop the wake word listener — the voice assistant will take over the mic
            if (recognitionRef.current) {
              try { recognitionRef.current.abort(); } catch (e) {}
            }
            
            setIsListening(false);
            callbackRef.current?.();
            return;
          }
        }
      }
    };

    recognition.onerror = (event) => {
      // 'no-speech' and 'aborted' are expected during normal operation
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.warn('[UNICARE WakeWord] Error:', event.error);
      
      // Retry on recoverable errors
      if (event.error === 'network' || event.error === 'audio-capture') {
        setIsListening(false);
        scheduleRestart();
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if still enabled (recognition stops periodically)
      if (enabledRef.current) {
        scheduleRestart();
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.warn('[UNICARE WakeWord] Failed to start:', e.message);
      scheduleRestart();
    }
  }, []);

  const scheduleRestart = useCallback(() => {
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    restartTimeoutRef.current = setTimeout(() => {
      if (enabledRef.current) {
        startListening();
      }
    }, 1000); // 1 second cooldown before restart
  }, [startListening]);

  const stopListening = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Start/stop based on enabled prop
  useEffect(() => {
    if (enabled) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [enabled, startListening, stopListening]);

  return {
    isListening,
    /** Call this to temporarily pause wake word (e.g. while voice assistant is active) */
    pause: stopListening,
    /** Call this to resume wake word detection */
    resume: startListening,
  };
}
