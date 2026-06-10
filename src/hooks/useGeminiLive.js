import { useState, useRef, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';

// Helper to convert Int16Array to Float32Array
function int16ToFloat32(input) {
  const output = new Float32Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = input[i];
    output[i] = s < 0 ? s / 0x8000 : s / 0x7FFF;
  }
  return output;
}

// Helper to base64 decode to Int16Array
function base64ToBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Int16Array(bytes.buffer);
}

export function useGeminiLive(apiKey) {
  const [isConnected, setIsConnected] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("Click 'Start Call' to begin...");
  
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  
  // Audio playback state
  const playContextRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  const activeSourcesRef = useRef([]);

  const connect = useCallback(async () => {
    if (isConnected) return;
    
    try {
      setTranscript("Connecting to UNICARE AI...");
      if (!apiKey) throw new Error("API Key missing");
      
      // Get recent chat context to inform the voice agent
      const chatContext = useChatStore.getState().getRecentContext(10);
      
      // Request microphone (16kHz requirement for Gemini)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        }
      });
      streamRef.current = stream;
      
      // Connect using Native WebSockets
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Setup Input AudioContext (16kHz) with AudioWorklet
      const inputContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = inputContext;

      // Load the AudioWorklet processor module
      await inputContext.audioWorklet.addModule('/audio-processor.js');
      
      const source = inputContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(inputContext, 'pcm-processor');
      workletNodeRef.current = workletNode;
      
      // Setup Output AudioContext (24kHz requirement from Gemini)
      const playContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      playContextRef.current = playContext;
      nextPlayTimeRef.current = playContext.currentTime;

      let setupComplete = false;

      ws.onopen = () => {
        setIsConnected(true);
        setTranscript("Connected! Start speaking...");

        // Build system instruction with chat context
        let systemText = `You are UNICARE AI, a compassionate and knowledgeable healthcare voice assistant. You are part of the UNICARE Health & Wellness platform.

Your personality:
- Warm, caring, and professional
- Speak clearly and concisely for voice conversations
- Address the user by name if you know it
- Always recommend seeing a doctor for serious concerns

You can help with:
- General health questions and wellness advice
- Understanding symptoms and medications
- Diet and fitness guidance
- Mental health and stress management
- Explaining medical terminology in simple terms

IMPORTANT STOP COMMAND:
If the user says "UNICARE stop", "stop UNICARE", "stop", "shut up", "be quiet", "end session", or any variation asking you to stop — you MUST:
1. Immediately stop speaking
2. Say a very brief goodbye like "Goodbye! Call me anytime."
3. ALWAYS include the exact text marker [SESSION_END] in your text response

Important: Never provide definitive diagnoses. For emergencies, tell the user to call emergency services immediately.`;

        if (chatContext) {
          systemText += `\n\nHere is recent chat history the user has had with UNICARE AI for context:\n${chatContext}\n\nUse this context to provide continuity in the conversation.`;
        }

        // Send Setup Message
        ws.send(JSON.stringify({
          setup: {
            model: "models/gemini-3.1-flash-live-preview",
            systemInstruction: {
               parts: [{ text: systemText }]
            },
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: "Aoede" }
                }
              }
            }
          }
        }));

        // Receive raw PCM buffers from AudioWorklet and send over WebSocket
        workletNode.port.onmessage = (event) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          if (!setupComplete) return; // Google requires waiting for setupComplete

          try {
            // Base64 encode on main thread (btoa not available in worklet)
            const bytes = new Uint8Array(event.data.pcmBuffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64Data = btoa(binary);

            ws.send(JSON.stringify({
              realtimeInput: {
                audio: {
                  mimeType: "audio/pcm;rate=16000",
                  data: base64Data
                }
              }
            }));
          } catch (err) {
            console.error("Failed to send audio chunk", err);
          }
        };
        
        source.connect(workletNode);
        workletNode.connect(inputContext.destination);
      };

      ws.onmessage = async (event) => {
        try {
          let textData = event.data;
          if (textData instanceof Blob) {
             textData = await textData.text();
          }
          const message = JSON.parse(textData);
          
          // Setup Complete
          if (message.setupComplete) {
             console.log("Live API Setup Complete");
             setupComplete = true;
             
             // Force an immediate greeting to prove the audio channel is working
             ws.send(JSON.stringify({
                clientContent: {
                   turns: [
                      { role: "user", parts: [{ text: "Hello! Please introduce yourself briefly as UNICARE AI." }] }
                   ],
                   turnComplete: true
                }
             }));
             
             return;
          }

          // Server Content
          if (message.serverContent) {
            const parts = message.serverContent.modelTurn?.parts || [];
            
            if (parts.length > 0) {
              if (!isPlayingRef.current) {
                 isPlayingRef.current = true;
                 setIsAiSpeaking(true);
                 setTranscript("UNICARE AI is speaking...");
              }
            }
            if (message.serverContent.turnComplete) {
              isPlayingRef.current = false;
              setIsAiSpeaking(false);
              setTranscript("Listening...");
            }

            for (const part of parts) {
              // Handle text parts — log to chat store and check for stop command
              if (part.text) {
                useChatStore.getState().addMessage('assistant', `[Voice] ${part.text}`);
                
                // Detect stop command from AI response
                if (part.text.includes('[SESSION_END]')) {
                  console.log('[UNICARE Voice] Stop command detected — ending session');
                  // Let the goodbye audio play briefly, then close
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('voice-session-end'));
                  }, 1500);
                }
              }

              if (part.inlineData?.data) {
                const pcm16Data = base64ToBuffer(part.inlineData.data);
                const float32Data = int16ToFloat32(pcm16Data);
                
                if (playContext.state === 'suspended') playContext.resume();
                
                const audioBuffer = playContext.createBuffer(1, float32Data.length, 24000);
                audioBuffer.getChannelData(0).set(float32Data);
                
                const sourceNode = playContext.createBufferSource();
                sourceNode.buffer = audioBuffer;
                sourceNode.connect(playContext.destination);
                
                // Track active sources so we can stop them on interruption
                activeSourcesRef.current.push(sourceNode);
                sourceNode.onended = () => {
                  activeSourcesRef.current = activeSourcesRef.current.filter(n => n !== sourceNode);
                };
                
                if (nextPlayTimeRef.current < playContext.currentTime) {
                  nextPlayTimeRef.current = playContext.currentTime;
                }
                
                sourceNode.start(nextPlayTimeRef.current);
                nextPlayTimeRef.current += audioBuffer.duration;
              }
            }
            
            // Handle Interruption / Clear Buffer if the user interrupted
            if (message.serverContent.interrupted) {
               // Stop all currently playing audio instantly
               activeSourcesRef.current.forEach(node => {
                 try { node.stop(); } catch (e) {}
               });
               activeSourcesRef.current = [];
               
               nextPlayTimeRef.current = playContext.currentTime;
               setIsAiSpeaking(false);
               isPlayingRef.current = false;
               setTranscript("Listening...");
            }
          }
        } catch (err) {
           console.error("Error parsing websocket message", err);
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket Error:", e);
      };

      ws.onclose = (event) => {
        console.warn("WebSocket closed:", event.code, event.reason);
        let msg = "Call ended.";
        if (event.code === 1011) {
          msg = "Connection lost: Internal server error (1011).";
        } else if (event.code === 1006) {
          msg = "Connection lost unexpectedly (1006).";
        } else if (event.code !== 1000) {
          msg = `Connection closed (Code: ${event.code}).`;
        }
        disconnect(msg);
      };

    } catch (error) {
      console.error("Failed to connect to Live API:", error);
      disconnect("Failed to connect: " + error.message);
    }
  }, [apiKey, isConnected]);

  const disconnect = useCallback((customStatus) => {
    setIsConnected(false);
    setIsAiSpeaking(false);
    isPlayingRef.current = false;
    setTranscript(customStatus || "Call ended. Click 'Start Call' to begin.");
    
    activeSourcesRef.current.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    activeSourcesRef.current = [];
    
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (playContextRef.current) {
      playContextRef.current.close().catch(() => {});
      playContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
  }, []);

  /**
   * Send a text message through the voice WebSocket (so the AI speaks the response)
   */
  const sendText = useCallback((text) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    useChatStore.getState().addMessage('user', text);

    wsRef.current.send(JSON.stringify({
      clientContent: {
        turns: [
          { role: "user", parts: [{ text }] }
        ],
        turnComplete: true
      }
    }));
  }, []);

  return { connect, disconnect, isConnected, isAiSpeaking, transcript, sendText };
}
