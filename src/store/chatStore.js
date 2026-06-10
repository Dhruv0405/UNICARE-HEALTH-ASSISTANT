import { create } from 'zustand';

/**
 * Chat store — shared between voice agent and text chat.
 * Messages are stored in memory and optionally persisted to localStorage.
 */
export const useChatStore = create((set, get) => ({
  messages: [],
  isTyping: false,

  addMessage: (role, content) => {
    const msg = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      role, // 'user' | 'assistant' | 'system'
      content,
      timestamp: new Date().toISOString(),
    };
    set((s) => {
      const updated = [...s.messages, msg];
      // Persist last 100 messages
      try {
        localStorage.setItem(
          'unicare_chat',
          JSON.stringify(updated.slice(-100))
        );
      } catch (e) {/* quota */}
      return { messages: updated };
    });
    return msg;
  },

  setTyping: (val) => set({ isTyping: val }),

  clearMessages: () => {
    localStorage.removeItem('unicare_chat');
    set({ messages: [] });
  },

  /**
   * Build a context summary of recent chat for voice agent system prompt
   */
  getRecentContext: (count = 10) => {
    const msgs = get().messages.slice(-count);
    if (msgs.length === 0) return '';
    return msgs
      .map((m) => `${m.role === 'user' ? 'User' : 'UNICARE AI'}: ${m.content}`)
      .join('\n');
  },

  /**
   * Initialize from localStorage
   */
  initialize: () => {
    try {
      const stored = localStorage.getItem('unicare_chat');
      if (stored) {
        set({ messages: JSON.parse(stored) });
      }
    } catch (e) {
      localStorage.removeItem('unicare_chat');
    }
  },
}));

// Initialize on load
useChatStore.getState().initialize();
