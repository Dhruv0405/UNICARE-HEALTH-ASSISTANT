import { create } from 'zustand';

export const useSettingsStore = create((set, get) => ({
  theme: localStorage.getItem('unicare_theme') || 'light',
  wakeWordEnabled: localStorage.getItem('unicare_wakeword') !== 'false',
  ttsEnabled: localStorage.getItem('unicare_tts') !== 'false',
  sidebarCollapsed: false,
  
  // Unit preferences
  heightUnit: localStorage.getItem('unicare_height_unit') || 'cm',  // 'cm' | 'ft'
  weightUnit: localStorage.getItem('unicare_weight_unit') || 'kg',  // 'kg' | 'lbs'

  // Notification preferences
  notifications: {
    medication: true,
    appointment: true,
    dailyCheckin: true,
    water: true,
    weeklyReport: true,
  },

  setTheme: (theme) => {
    localStorage.setItem('unicare_theme', theme);
    set({ theme });
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('unicare_theme', newTheme);
    set({ theme: newTheme });
  },

  setWakeWordEnabled: (enabled) => {
    localStorage.setItem('unicare_wakeword', String(enabled));
    set({ wakeWordEnabled: enabled });
  },

  setTtsEnabled: (enabled) => {
    localStorage.setItem('unicare_tts', String(enabled));
    set({ ttsEnabled: enabled });
  },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  updateNotifications: (key, value) => {
    set((s) => ({
      notifications: { ...s.notifications, [key]: value },
    }));
  },

  setHeightUnit: (unit) => {
    localStorage.setItem('unicare_height_unit', unit);
    set({ heightUnit: unit });
  },

  setWeightUnit: (unit) => {
    localStorage.setItem('unicare_weight_unit', unit);
    set({ weightUnit: unit });
  },
}));
