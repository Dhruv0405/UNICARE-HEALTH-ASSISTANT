import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebaseConfig';

/**
 * Checks whether the user's health profile has all required fields filled.
 */
export function isProfileComplete(user) {
  if (!user) return false;
  const required = ['weight', 'height', 'blood_group', 'gender', 'dob'];
  return required.every((field) => {
    const val = user[field];
    return val !== undefined && val !== null && val !== '';
  });
}

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // start as true until Firebase resolves
  error: null,
  profileSetupDismissed: false,

  // Sub-profiles (family members)
  subProfiles: JSON.parse(localStorage.getItem('unicare_sub_profiles') || '[]'),
  activeProfileId: localStorage.getItem('unicare_active_profile') || 'main',

  /**
   * Initialize auth listener — subscribes to Firebase auth state.
   * Falls back to localStorage mock mode if Firebase is not configured.
   */
  initialize: () => {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

    // If no Firebase key, fall back to local mock mode
    if (!apiKey) {
      console.warn('[UNICARE Auth] No Firebase API key found — running in mock mode.');
      try {
        const stored = localStorage.getItem('unicare_session');
        if (stored) {
          const user = JSON.parse(stored);
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      } catch (e) {
        localStorage.removeItem('unicare_session');
        set({ isLoading: false });
      }
      return;
    }

    // Real Firebase mode
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Try to get extended profile from Firestore
        let profile = {};
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) profile = snap.data();
        } catch (e) {
          console.warn('[UNICARE Auth] Could not fetch Firestore profile:', e.message);
        }

        const user = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || profile.name || '',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || '',
          dob: profile.dob || '',
          gender: profile.gender || '',
          blood_group: profile.blood_group || '',
          height: profile.height || '',
          weight: profile.weight || '',
          emergency_contact: profile.emergency_contact || '',
        };

        localStorage.setItem('unicare_session', JSON.stringify(user));

        // Check if user was on a sub-profile
        const activeId = get().activeProfileId;
        if (activeId !== 'main') {
          const sub = get().subProfiles.find((p) => p.id === activeId);
          if (sub) {
            set({ user: sub, isAuthenticated: true, isLoading: false });
            return;
          }
        }

        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        localStorage.removeItem('unicare_session');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  /**
   * Login with email + password
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey) {
      // Mock mode
      const mockUser = {
        id: 'mock-1',
        name: 'Sarah Jenkins',
        email: email,
        dob: '1992-03-15',
        gender: 'Female',
        blood_group: 'A+',
        height: 165,
        weight: 68.2,
        emergency_contact: '9818217806',
      };
      localStorage.setItem('unicare_session', JSON.stringify(mockUser));
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
      return true;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the rest
      set({ isLoading: false });
      return true;
    } catch (error) {
      const msg = firebaseErrorMessage(error.code);
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  /**
   * Login with Google popup
   */
  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      let resultUser = null;
      // If we are in Electron, use our custom default-browser OAuth flow
      if (window.electronAPI && window.electronAPI.auth) {
        resultUser = await new Promise((resolve) => {
          // Listen for the token coming back from the local server
          window.electronAPI.auth.onGoogleToken(async (idToken) => {
            try {
              const credential = GoogleAuthProvider.credential(idToken);
              const authResult = await signInWithCredential(auth, credential);
              resolve(authResult.user);
            } catch (err) {
              set({ error: err.message });
              resolve(null);
            }
          });

          // Trigger the flow
          window.electronAPI.auth.googleLogin().then((started) => {
            if (!started) {
              set({ error: 'OAuth Client ID not configured. Please check .env' });
              resolve(null);
            }
          });
        });
      } else {
        // Fallback for standard web browsers
        const result = await signInWithPopup(auth, googleProvider);
        resultUser = result.user;
      }

      if (!resultUser) {
        set({ isLoading: false });
        return false;
      }

      // Save basic profile to Firestore if it doesn't exist
      const userRef = doc(db, 'users', resultUser.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: resultUser.displayName || '',
          email: resultUser.email,
          photoURL: resultUser.photoURL || '',
          createdAt: new Date().toISOString(),
        });
      }

      set({ isLoading: false });
      return true;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        set({ isLoading: false });
        return false;
      }
      const msg = firebaseErrorMessage(error.code);
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  /**
   * Register a new account
   */
  register: async (userData) => {
    set({ isLoading: true, error: null });

    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey) {
      // Mock mode
      const mockUser = {
        id: 'mock-1',
        name: userData.name,
        email: userData.email,
        ...userData,
      };
      delete mockUser.password;
      delete mockUser.confirmPassword;
      localStorage.setItem('unicare_session', JSON.stringify(mockUser));
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
      return true;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

      // Set display name
      await updateProfile(cred.user, { displayName: userData.name });

      // Save extended profile in Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        name: userData.name,
        email: userData.email,
        dob: userData.dob || '',
        gender: userData.gender || '',
        blood_group: userData.blood_group || '',
        height: userData.height || null,
        weight: userData.weight || null,
        emergency_contact: userData.emergency_contact || '',
        createdAt: new Date().toISOString(),
      });

      set({ isLoading: false });
      return true;
    } catch (error) {
      const msg = firebaseErrorMessage(error.code);
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  /**
   * Update user profile
   */
  updateUser: async (updates) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, ...updates };

    // If active profile is a sub-profile, update the sub-profile
    const activeId = get().activeProfileId;
    if (activeId !== 'main') {
      const subs = get().subProfiles.map((p) =>
        p.id === activeId ? { ...p, ...updates } : p
      );
      localStorage.setItem('unicare_sub_profiles', JSON.stringify(subs));
      set({ user: updated, subProfiles: subs });
      return;
    }

    localStorage.setItem('unicare_session', JSON.stringify(updated));
    set({ user: updated });

    // Also update Firestore if configured
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (apiKey && user.id) {
      try {
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, updates, { merge: true });
      } catch (e) {
        console.warn('[UNICARE Auth] Failed to update Firestore profile:', e.message);
      }
    }
  },

  /**
   * Add a sub-profile (family member)
   */
  addSubProfile: (profileData) => {
    const id = 'sub-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const newProfile = {
      id,
      ...profileData,
      isSubProfile: true,
      parentId: get().user?.id || 'main',
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().subProfiles, newProfile];
    localStorage.setItem('unicare_sub_profiles', JSON.stringify(updated));
    set({ subProfiles: updated });
    return newProfile;
  },

  /**
   * Remove a sub-profile
   */
  removeSubProfile: (profileId) => {
    const updated = get().subProfiles.filter((p) => p.id !== profileId);
    localStorage.setItem('unicare_sub_profiles', JSON.stringify(updated));

    // If we're currently on this profile, switch back to main
    if (get().activeProfileId === profileId) {
      get().switchProfile('main');
    }

    set({ subProfiles: updated });
  },

  /**
   * Update a sub-profile
   */
  updateSubProfile: (profileId, updates) => {
    const subs = get().subProfiles.map((p) =>
      p.id === profileId ? { ...p, ...updates } : p
    );
    localStorage.setItem('unicare_sub_profiles', JSON.stringify(subs));
    set({ subProfiles: subs });

    // If this is the active profile, also update the user object
    if (get().activeProfileId === profileId) {
      const updated = subs.find((p) => p.id === profileId);
      if (updated) set({ user: updated });
    }
  },

  /**
   * Switch active profile
   */
  switchProfile: (profileId) => {
    if (profileId === 'main') {
      const mainUser = JSON.parse(localStorage.getItem('unicare_session') || 'null');
      if (mainUser) {
        localStorage.setItem('unicare_active_profile', 'main');
        set({ user: mainUser, activeProfileId: 'main' });
      }
    } else {
      const sub = get().subProfiles.find((p) => p.id === profileId);
      if (sub) {
        localStorage.setItem('unicare_active_profile', profileId);
        set({ user: sub, activeProfileId: profileId });
      }
    }
  },

  /**
   * Get the main profile (always the original user)
   */
  getMainProfile: () => {
    return JSON.parse(localStorage.getItem('unicare_session') || 'null');
  },

  /**
   * Logout
   */
  logout: async () => {
    localStorage.removeItem('unicare_session');
    localStorage.removeItem('unicare_active_profile');
    set({ user: null, isAuthenticated: false, activeProfileId: 'main' });
    try {
      await signOut(auth);
    } catch (e) {
      // Already signed out
    }
  },

  clearError: () => set({ error: null }),
}));

/**
 * Map Firebase error codes to user-friendly messages
 */
function firebaseErrorMessage(code) {
  const map = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-credential': 'Invalid email or password.',
  };
  return map[code] || `Authentication error (${code}).`;
}

// Initialize on load
useAuthStore.getState().initialize();
