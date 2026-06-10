import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useNotificationStore } from '../../store/notificationStore';
import {
  Settings as SettingsIcon, User, Bell, Palette, Mic, Volume2, Globe,
  Download, Trash2, Info, Moon, Sun, ChevronRight, Shield, LogOut, AlertTriangle,
  Users, Plus, Edit2, X, Check, UserPlus, ArrowRight, Ruler, Weight
} from 'lucide-react';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'family', label: 'Family Profiles', icon: Users },
  { id: 'units', label: 'Units', icon: Ruler },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'voice', label: 'Voice & AI', icon: Mic },
  { id: 'data', label: 'Data Management', icon: Download },
  { id: 'about', label: 'About', icon: Info },
];

export default function SettingsPage() {
  const user = useAuthStore(s => s.user);
  const updateUser = useAuthStore(s => s.updateUser);
  const logout = useAuthStore(s => s.logout);
  const subProfiles = useAuthStore(s => s.subProfiles);
  const activeProfileId = useAuthStore(s => s.activeProfileId);
  const addSubProfile = useAuthStore(s => s.addSubProfile);
  const removeSubProfile = useAuthStore(s => s.removeSubProfile);
  const switchProfile = useAuthStore(s => s.switchProfile);
  const getMainProfile = useAuthStore(s => s.getMainProfile);

  const { theme, toggleTheme, wakeWordEnabled, setWakeWordEnabled, ttsEnabled, setTtsEnabled, notifications, updateNotifications,
    heightUnit, weightUnit, setHeightUnit, setWeightUnit } = useSettingsStore();
  const addNotification = useNotificationStore(s => s.addNotification);

  const [activeSection, setActiveSection] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', dob: user?.dob || '', gender: user?.gender || '',
    height: user?.height || '', weight: user?.weight || '', blood_group: user?.blood_group || '',
    emergency_contact: user?.emergency_contact || '',
  });
  const [apiKey, setApiKey] = useState(localStorage.getItem('ANTHROPIC_API_KEY') || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sub-profile creation
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '', dob: '', gender: '', blood_group: '', height: '', weight: '', relationship: '',
    emergency_contact: '',
  });

  // Editing sub-profile
  const [editingProfileId, setEditingProfileId] = useState(null);

  const saveProfile = () => {
    updateUser(profileForm);
    addNotification('success', 'Profile Saved', 'Your profile has been updated successfully.');
  };
  const saveApiKey = () => {
    localStorage.setItem('ANTHROPIC_API_KEY', apiKey);
    addNotification('success', 'API Key Saved', 'Your API key has been stored locally.');
  };

  const handleAddSubProfile = () => {
    if (!newProfile.name.trim()) return;
    addSubProfile(newProfile);
    setNewProfile({ name: '', dob: '', gender: '', blood_group: '', height: '', weight: '', relationship: '', emergency_contact: '' });
    setShowAddProfile(false);
    addNotification('success', 'Profile Created', `Sub-profile for "${newProfile.name}" has been created.`);
  };

  const handleDeleteSubProfile = (id, name) => {
    removeSubProfile(id);
    addNotification('info', 'Profile Removed', `"${name}" has been removed from your family profiles.`);
  };

  const handleSwitchProfile = (id) => {
    switchProfile(id);
    const profileName = id === 'main' ? 'Main Profile' : subProfiles.find(p => p.id === id)?.name || 'Profile';
    addNotification('info', 'Profile Switched', `Now viewing data for: ${profileName}`);
    // Update the profile form
    const currentUser = id === 'main' ? getMainProfile() : subProfiles.find(p => p.id === id);
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '', dob: currentUser.dob || '', gender: currentUser.gender || '',
        height: currentUser.height || '', weight: currentUser.weight || '', blood_group: currentUser.blood_group || '',
        emergency_contact: currentUser.emergency_contact || '',
      });
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-on-surface dark:text-dark-on-surface">{label}</span>
      <button onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
        role="switch" aria-checked={enabled} aria-label={label}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="uc-page">
      <div className="mb-8">
        <h1 className="uc-page-title">Settings</h1>
        <p className="text-on-surface-variant">Manage your account and preferences.</p>
        {activeProfileId !== 'main' && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            Viewing sub-profile: {user?.name}
            <button onClick={() => handleSwitchProfile('main')} className="ml-1 underline hover:no-underline">Switch to main</button>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Left nav */}
        <nav className="w-56 shrink-0 space-y-1 hidden lg:block">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeSection === s.id ? 'bg-primary-500 text-white' : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container'}`}>
                <Icon className="w-4 h-4" /> {s.label}
              </button>
            );
          })}
          <div className="pt-4 border-t border-outline-variant/20 mt-4">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-danger-500 hover:bg-danger-50 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </nav>

        {/* Right content */}
        <div className="flex-1 max-w-2xl">
          {activeSection === 'profile' && (
            <div className="uc-card space-y-5 animate-fade-in">
              <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface">Profile Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1.5">Full Name</label><input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="uc-input" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Date of Birth</label><input type="date" value={profileForm.dob} onChange={(e) => setProfileForm({...profileForm, dob: e.target.value})} max={todayStr} className="uc-input" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Gender</label>
                  <select value={profileForm.gender} onChange={(e) => setProfileForm({...profileForm, gender: e.target.value})} className="uc-input">
                    <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1.5">Blood Group</label>
                  <select value={profileForm.blood_group} onChange={(e) => setProfileForm({...profileForm, blood_group: e.target.value})} className="uc-input">
                    <option value="">Select</option>{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1.5">Height ({heightUnit === 'ft' ? 'ft/in' : 'cm'})</label><input type="number" value={profileForm.height} onChange={(e) => setProfileForm({...profileForm, height: e.target.value})} className="uc-input" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Weight ({weightUnit})</label><input type="number" step="0.1" value={profileForm.weight} onChange={(e) => setProfileForm({...profileForm, weight: e.target.value})} className="uc-input" /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1.5">Emergency Contact</label><input type="tel" value={profileForm.emergency_contact} onChange={(e) => setProfileForm({...profileForm, emergency_contact: e.target.value})} className="uc-input" /></div>
              </div>
              <button onClick={saveProfile} className="uc-btn-primary">Save Changes</button>
            </div>
          )}

          {/* ===== FAMILY PROFILES ===== */}
          {activeSection === 'family' && (
            <div className="space-y-4 animate-fade-in">
              <div className="uc-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface">Family Profiles</h2>
                    <p className="text-xs text-on-surface-variant mt-1">Create separate profiles for family members like children or elderly parents.</p>
                  </div>
                  <button onClick={() => setShowAddProfile(true)} className="uc-btn-primary text-sm">
                    <UserPlus className="w-4 h-4" /> Add Profile
                  </button>
                </div>

                {/* Main Profile */}
                <div className={`flex items-center gap-3 p-4 rounded-xl border-2 mb-3 transition-all cursor-pointer ${
                  activeProfileId === 'main' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-outline-variant/20 hover:border-outline-variant/40'
                }`} onClick={() => handleSwitchProfile('main')}>
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{getMainProfile()?.name || 'Main Profile'}</p>
                    <p className="text-xs text-on-surface-variant">Primary Account</p>
                  </div>
                  {activeProfileId === 'main' && (
                    <span className="text-xs font-semibold text-primary-500 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">Active</span>
                  )}
                </div>

                {/* Sub-profiles */}
                {subProfiles.map((profile) => (
                  <div key={profile.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 mb-3 transition-all cursor-pointer ${
                    activeProfileId === profile.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-outline-variant/20 hover:border-outline-variant/40'
                  }`} onClick={() => handleSwitchProfile(profile.id)}>
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <span className="text-lg">{profile.gender === 'Male' ? '👦' : profile.gender === 'Female' ? '👧' : '👤'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{profile.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {profile.relationship && `${profile.relationship} • `}
                        {profile.gender || ''}{profile.blood_group ? ` • ${profile.blood_group}` : ''}
                      </p>
                    </div>
                    {activeProfileId === profile.id && (
                      <span className="text-xs font-semibold text-primary-500 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">Active</span>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteSubProfile(profile.id, profile.name); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {subProfiles.length === 0 && (
                  <p className="text-sm text-on-surface-variant text-center py-4">No family profiles yet. Click "Add Profile" to create one.</p>
                )}
              </div>

              {/* Add Profile Modal */}
              {showAddProfile && (
                <div className="uc-card animate-slide-up border-2 border-primary-200 dark:border-primary-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-on-surface dark:text-dark-on-surface">Create Sub-Profile</h3>
                    <button onClick={() => setShowAddProfile(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div><label className="block text-sm font-medium mb-1.5">Full Name *</label>
                      <input type="text" value={newProfile.name} onChange={(e) => setNewProfile({...newProfile, name: e.target.value})} placeholder="e.g., Baby Riya" className="uc-input" /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Relationship</label>
                      <select value={newProfile.relationship} onChange={(e) => setNewProfile({...newProfile, relationship: e.target.value})} className="uc-input">
                        <option value="">Select</option>
                        <option>Child</option><option>Spouse</option><option>Parent</option><option>Sibling</option><option>Other</option>
                      </select></div>
                    <div><label className="block text-sm font-medium mb-1.5">Date of Birth</label>
                      <input type="date" value={newProfile.dob} onChange={(e) => setNewProfile({...newProfile, dob: e.target.value})} max={todayStr} className="uc-input" /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Gender</label>
                      <select value={newProfile.gender} onChange={(e) => setNewProfile({...newProfile, gender: e.target.value})} className="uc-input">
                        <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                      </select></div>
                    <div><label className="block text-sm font-medium mb-1.5">Blood Group</label>
                      <select value={newProfile.blood_group} onChange={(e) => setNewProfile({...newProfile, blood_group: e.target.value})} className="uc-input">
                        <option value="">Select</option>{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}
                      </select></div>
                    <div><label className="block text-sm font-medium mb-1.5">Height (cm)</label>
                      <input type="number" value={newProfile.height} onChange={(e) => setNewProfile({...newProfile, height: e.target.value})} placeholder="e.g., 75" className="uc-input" /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Weight (kg)</label>
                      <input type="number" step="0.1" value={newProfile.weight} onChange={(e) => setNewProfile({...newProfile, weight: e.target.value})} placeholder="e.g., 9.5" className="uc-input" /></div>
                    <div><label className="block text-sm font-medium mb-1.5">Emergency Contact</label>
                      <input type="tel" value={newProfile.emergency_contact} onChange={(e) => setNewProfile({...newProfile, emergency_contact: e.target.value})} placeholder="+91-XXXXX" className="uc-input" /></div>
                  </div>
                  <button onClick={handleAddSubProfile} disabled={!newProfile.name.trim()} className="uc-btn-primary w-full disabled:opacity-50">
                    <UserPlus className="w-4 h-4" /> Create Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===== UNITS ===== */}
          {activeSection === 'units' && (
            <div className="uc-card animate-fade-in">
              <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface mb-4">Measurement Units</h2>
              <p className="text-sm text-on-surface-variant mb-6">Choose your preferred units for height and weight.</p>

              <div className="space-y-6">
                {/* Height Unit */}
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-3">Height Unit</label>
                  <div className="flex gap-3">
                    {[
                      { key: 'cm', label: 'Centimeters (cm)', desc: '165 cm', icon: '📏' },
                      { key: 'ft', label: 'Feet & Inches', desc: '5\'5"', icon: '📐' },
                    ].map(u => (
                      <button key={u.key} onClick={() => { setHeightUnit(u.key); addNotification('info', 'Height Unit Changed', `Now displaying height in ${u.label}`); }}
                        className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${heightUnit === u.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-outline-variant/30 hover:border-outline-variant'}`}>
                        <span className="text-2xl mb-2 block">{u.icon}</span>
                        <p className="font-semibold text-sm">{u.label}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">e.g., {u.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight Unit */}
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-3">Weight Unit</label>
                  <div className="flex gap-3">
                    {[
                      { key: 'kg', label: 'Kilograms (kg)', desc: '68.2 kg', icon: '⚖️' },
                      { key: 'lbs', label: 'Pounds (lbs)', desc: '150.4 lbs', icon: '🏋️' },
                    ].map(u => (
                      <button key={u.key} onClick={() => { setWeightUnit(u.key); addNotification('info', 'Weight Unit Changed', `Now displaying weight in ${u.label}`); }}
                        className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${weightUnit === u.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-outline-variant/30 hover:border-outline-variant'}`}>
                        <span className="text-2xl mb-2 block">{u.icon}</span>
                        <p className="font-semibold text-sm">{u.label}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">e.g., {u.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="uc-card animate-fade-in">
              <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface mb-4">Notification Preferences</h2>
              <div className="divide-y divide-outline-variant/10">
                <ToggleSwitch label="Medication Reminders" enabled={notifications.medication} onChange={(v) => updateNotifications('medication', v)} />
                <ToggleSwitch label="Appointment Reminders" enabled={notifications.appointment} onChange={(v) => updateNotifications('appointment', v)} />
                <ToggleSwitch label="Daily Health Check-in (9 AM)" enabled={notifications.dailyCheckin} onChange={(v) => updateNotifications('dailyCheckin', v)} />
                <ToggleSwitch label="Water Intake Reminders" enabled={notifications.water} onChange={(v) => updateNotifications('water', v)} />
                <ToggleSwitch label="Weekly AI Health Report" enabled={notifications.weeklyReport} onChange={(v) => updateNotifications('weeklyReport', v)} />
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="uc-card animate-fade-in">
              <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface mb-4">Appearance</h2>
              <div className="flex gap-4">
                {[
                  { key: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
                  { key: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
                ].map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.key} onClick={() => useSettingsStore.getState().setTheme(t.key)}
                      className={`flex-1 p-6 rounded-xl border-2 text-center transition-all ${theme === t.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-outline-variant/30 hover:border-outline-variant'}`}>
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${theme === t.key ? 'text-primary-500' : 'text-on-surface-variant'}`} />
                      <p className="font-semibold text-sm">{t.label}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'voice' && (
            <div className="uc-card space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface mb-2">Voice & AI Settings</h2>
              <ToggleSwitch label='"Hey UNICARE" Wake Word' enabled={wakeWordEnabled} onChange={setWakeWordEnabled} />
              <ToggleSwitch label="Voice Response (Text-to-Speech)" enabled={ttsEnabled} onChange={setTtsEnabled} />
              <div className="pt-4 border-t border-outline-variant/10">
                <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">Anthropic API Key</label>
                <div className="flex gap-2">
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-ant-..." className="uc-input flex-1" />
                  <button onClick={saveApiKey} className="uc-btn-primary text-sm">Save</button>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Required for AI features. Your key is stored locally.</p>
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="space-y-4 animate-fade-in">
              <div className="uc-card">
                <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface mb-4">Export Data</h2>
                <p className="text-sm text-on-surface-variant mb-4">Download all your health data for your records.</p>
                <div className="flex gap-3">
                  <button className="uc-btn-secondary text-sm"><Download className="w-4 h-4" /> Export as JSON</button>
                  <button className="uc-btn-secondary text-sm"><Download className="w-4 h-4" /> Export as CSV</button>
                </div>
              </div>
              <div className="uc-card border-danger-200 dark:border-danger-800">
                <h2 className="text-lg font-bold text-danger-600 mb-2">Danger Zone</h2>
                <p className="text-sm text-on-surface-variant mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                {showDeleteConfirm ? (
                  <div className="flex gap-3 items-center">
                    <p className="text-sm text-danger-600 font-medium">Are you sure?</p>
                    <button onClick={() => { logout(); }} className="uc-btn-danger text-sm">Yes, Delete Everything</button>
                    <button onClick={() => setShowDeleteConfirm(false)} className="uc-btn-ghost text-sm">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setShowDeleteConfirm(true)} className="uc-btn-danger text-sm">
                    <Trash2 className="w-4 h-4" /> Delete Account & All Data
                  </button>
                )}
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="uc-card animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <path d="M12 7v4M10 9h4" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-on-surface dark:text-dark-on-surface">UNICARE</h2>
                  <p className="text-sm text-on-surface-variant">Health & Wellness Platform</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-outline-variant/10"><span className="text-on-surface-variant">Version</span><span className="font-medium">1.0.0</span></div>
                <div className="flex justify-between py-2 border-b border-outline-variant/10"><span className="text-on-surface-variant">Framework</span><span className="font-medium">Electron + React</span></div>
                <div className="flex justify-between py-2 border-b border-outline-variant/10"><span className="text-on-surface-variant">AI Engine</span><span className="font-medium">Gemini + Nemotron</span></div>
                <div className="flex justify-between py-2"><span className="text-on-surface-variant">Database</span><span className="font-medium">SQLite (local)</span></div>
              </div>
              <p className="text-xs text-on-surface-variant mt-6">© 2026 UNICARE. All data is stored locally on your device. Your health information never leaves your computer unless you explicitly use AI features.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
