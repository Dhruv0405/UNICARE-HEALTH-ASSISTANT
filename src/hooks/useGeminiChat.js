import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';

function buildUserContext() {
  // Gather all user data from various localStorage sources
  let context = '';

  // 1. User profile
  try {
    const session = JSON.parse(localStorage.getItem('unicare_session') || 'null');
    if (session) {
      context += `\n## User Profile:\n`;
      context += `- Name: ${session.name || 'Unknown'}\n`;
      context += `- Email: ${session.email || 'Unknown'}\n`;
      context += `- Date of Birth: ${session.dob || 'Not set'}\n`;
      context += `- Gender: ${session.gender || 'Not set'}\n`;
      context += `- Blood Group: ${session.blood_group || 'Not set'}\n`;
      context += `- Height: ${session.height || 'Not set'} cm\n`;
      context += `- Weight: ${session.weight || 'Not set'} kg\n`;
      context += `- Emergency Contact: ${session.emergency_contact || 'Not set'}\n`;

      // Calculate BMI if height and weight are available
      if (session.height && session.weight) {
        const heightM = session.height / 100;
        const bmi = (session.weight / (heightM * heightM)).toFixed(1);
        context += `- BMI: ${bmi}\n`;
      }

      // Calculate age if DOB is available
      if (session.dob) {
        const birth = new Date(session.dob);
        const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        context += `- Age: ${age} years\n`;
      }
    }
  } catch (e) { /* ignore */ }

  // 2. Sub-profiles (family members)
  try {
    const subProfiles = JSON.parse(localStorage.getItem('unicare_sub_profiles') || '[]');
    if (subProfiles.length > 0) {
      context += `\n## Family Members / Sub-Profiles:\n`;
      subProfiles.forEach((p) => {
        context += `- ${p.name}: ${p.gender || ''}, DOB ${p.dob || 'Unknown'}, Blood: ${p.blood_group || 'Unknown'}, Height: ${p.height || '?'}cm, Weight: ${p.weight || '?'}kg\n`;
      });
    }
  } catch (e) { /* ignore */ }

  // 3. Medical reports
  try {
    const reports = JSON.parse(localStorage.getItem('unicare_reports') || '[]');
    if (reports.length > 0) {
      context += `\n## Recent Medical Reports:\n`;
      reports.slice(0, 10).forEach((r) => {
        context += `- "${r.name}" (${r.type}, ${r.date})`;
        if (r.analysis) {
          // Include a truncated version of the analysis
          const truncated = r.analysis.length > 300 ? r.analysis.slice(0, 300) + '...' : r.analysis;
          context += `\n  Analysis: ${truncated}`;
        }
        context += '\n';
      });
    }
  } catch (e) { /* ignore */ }

  // 4. Appointments
  try {
    const appointments = JSON.parse(localStorage.getItem('unicare_appointments') || '[]');
    if (appointments.length > 0) {
      context += `\n## Upcoming Appointments:\n`;
      appointments.slice(0, 5).forEach((a) => {
        context += `- ${a.doctor} (${a.specialty}) on ${a.date} at ${a.time} — ${a.status}\n`;
      });
    }
  } catch (e) { /* ignore */ }

  // 5. Diet log
  try {
    const dietLog = JSON.parse(localStorage.getItem('unicare_diet_log') || '[]');
    if (dietLog.length > 0) {
      context += `\n## Recent Diet Log:\n`;
      dietLog.slice(-5).forEach((d) => {
        context += `- ${d.food}: ${d.calories} kcal (${d.date})\n`;
      });
    }
  } catch (e) { /* ignore */ }

  return context;
}

const SYSTEM_PROMPT = `You are UNICARE AI, a compassionate, knowledgeable healthcare assistant built into the UNICARE Health & Wellness platform.

Your role:
- Provide helpful, evidence-based health information and wellness advice
- Help users understand symptoms, medications, and lifestyle changes
- Be empathetic, professional, and clear in your responses
- Always recommend consulting a real doctor for serious concerns
- You can discuss diet plans, exercise routines, mental health, and preventive care
- Keep responses concise but thorough
- You have access to the user's complete health profile, medical records, reports, appointments, and diet data (shown below). Use this data to personalize your responses.
- When the user asks about their own data (blood group, reports, weight, BMI, etc.), refer to the context below.

Important disclaimers:
- You are NOT a replacement for professional medical advice
- For emergencies, always advise calling emergency services
- Never diagnose conditions definitively — suggest possibilities and recommend professional evaluation`;

export function useGeminiChat() {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const { addMessage, setTyping, messages } = useChatStore();

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return;

    // Add user message to store
    addMessage('user', userText);
    setTyping(true);

    try {
      // Build dynamic user context from all app data
      const userContext = buildUserContext();

      // Build conversation history for context in OpenAI format
      const recentMessages = messages.slice(-20).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const fullSystemPrompt = SYSTEM_PROMPT + '\n\n--- USER DATA CONTEXT ---' + userContext + '\n--- END USER DATA CONTEXT ---';

      const apiMessages = [
        { role: 'system', content: fullSystemPrompt },
        ...recentMessages,
        { role: 'user', content: userText }
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:5173', // Optional, for OpenRouter rankings
          'X-Title': 'UNICARE', // Optional, for OpenRouter rankings
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-oss-120b', // Note: Make sure this is the exact model ID required
          messages: apiMessages,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || "I apologize, I couldn't generate a response. Please try again.";
      addMessage('assistant', aiText);
    } catch (error) {
      console.error('[UNICARE Chat] Error:', error);
      addMessage('assistant', `I'm sorry, I encountered an error: ${error.message}. Please try again.`);
    } finally {
      setTyping(false);
    }
  }, [apiKey, messages, addMessage, setTyping]);

  return { sendMessage };
}
