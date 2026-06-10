import React, { useState } from 'react';
import { useAuthStore, isProfileComplete } from '../../store/authStore';
import {
  User, Heart, Shield, ChevronRight, ChevronLeft, Check,
  Ruler, Weight, Droplets, Calendar, Users, Phone, Sparkles,
} from 'lucide-react';

const STEPS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'emergency', label: 'Emergency', icon: Shield },
];

export default function ProfileSetupModal() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const profileSetupDismissed = useAuthStore((s) => s.profileSetupDismissed);

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    dob: user?.dob || '',
    gender: user?.gender || '',
    height: user?.height || '',
    weight: user?.weight || '',
    blood_group: user?.blood_group || '',
    emergency_contact: user?.emergency_contact || '',
  });

  // Don't render if profile is already complete or dismissed
  if (!user || isProfileComplete(user) || profileSetupDismissed) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedStep0 = form.name && form.dob && form.gender;
  const canProceedStep1 = form.height && form.weight && form.blood_group;
  const canFinish = canProceedStep0 && canProceedStep1;

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateUser(form);
    setSaving(false);
    // The modal will auto-close since isProfileComplete will now be true
  };

  const handleSkip = () => {
    useAuthStore.setState({ profileSetupDismissed: true });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 bg-white dark:bg-dark-surface-container rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500 px-8 pt-8 pb-12 text-white overflow-hidden">
          <div className="absolute top-[-30%] right-[-10%] w-[200px] h-[200px] rounded-full bg-white/5" />
          <div className="absolute bottom-[-40%] left-[-5%] w-[150px] h-[150px] rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-white/80" />
              <span className="text-sm font-medium text-white/80">Welcome to UNICARE</span>
            </div>
            <h2 className="text-2xl font-bold">Complete Your Health Profile</h2>
            <p className="text-white/70 text-sm mt-1">
              We need a few details to personalize your health experience.
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 -mt-5 relative z-10 px-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isComplete = i < step;
            return (
              <React.Fragment key={s.id}>
                {i > 0 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full max-w-[60px] transition-colors duration-300 ${
                      isComplete ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  />
                )}
                <button
                  onClick={() => {
                    if (isComplete || isActive) setStep(i);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shrink-0 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg scale-110'
                      : isComplete
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  }`}
                >
                  {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Label */}
        <div className="text-center mt-3 mb-1">
          <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
            Step {step + 1}: {STEPS[step].label}
          </span>
        </div>

        {/* Form Content */}
        <div className="px-8 pb-6 pt-4">
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-primary-500" /> Full Name <span className="text-danger-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="John Doe"
                  className="uc-input"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary-500" /> Date of Birth <span className="text-danger-500">*</span></span>
                  </label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => updateField('dob', e.target.value)}
                    className="uc-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary-500" /> Gender <span className="text-danger-500">*</span></span>
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="uc-input"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">
                    <span className="flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5 text-primary-500" /> Height (cm) <span className="text-danger-500">*</span></span>
                  </label>
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) => updateField('height', e.target.value)}
                    placeholder="170"
                    className="uc-input"
                    min="50"
                    max="300"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">
                    <span className="flex items-center gap-1.5"><Weight className="w-3.5 h-3.5 text-primary-500" /> Weight (kg) <span className="text-danger-500">*</span></span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.weight}
                    onChange={(e) => updateField('weight', e.target.value)}
                    placeholder="70"
                    className="uc-input"
                    min="10"
                    max="500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">
                  <span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-primary-500" /> Blood Group <span className="text-danger-500">*</span></span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => updateField('blood_group', bg)}
                      className={`py-2.5 rounded-lg text-sm font-semibold border-2 transition-all duration-200 ${
                        form.blood_group === bg
                          ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-400 scale-[1.02]'
                          : 'border-outline-variant/30 text-on-surface-variant hover:border-primary-300 hover:bg-primary-50/50 dark:border-dark-surface-container-high dark:hover:border-primary-700'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary-500" /> Emergency Contact</span>
                </label>
                <input
                  type="tel"
                  value={form.emergency_contact}
                  onChange={(e) => updateField('emergency_contact', e.target.value)}
                  placeholder="+1-555-0123"
                  className="uc-input"
                  autoFocus
                />
                <p className="text-xs text-on-surface-variant mt-1.5">
                  This number will be used in case of SOS alerts.
                </p>
              </div>

              {/* Summary preview */}
              <div className="mt-4 p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-outline-variant/20 dark:border-dark-surface-container-high/50">
                <h4 className="text-sm font-semibold text-on-surface dark:text-dark-on-surface mb-3 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" /> Profile Summary
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[
                    { label: 'Name', value: form.name },
                    { label: 'DOB', value: form.dob },
                    { label: 'Gender', value: form.gender },
                    { label: 'Height', value: form.height ? `${form.height} cm` : '—' },
                    { label: 'Weight', value: form.weight ? `${form.weight} kg` : '—' },
                    { label: 'Blood Group', value: form.blood_group || '—' },
                    { label: 'Emergency', value: form.emergency_contact || '—' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-1">
                      <span className="text-on-surface-variant">{item.label}</span>
                      <span className="font-medium text-on-surface dark:text-dark-on-surface">{item.value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/20 dark:border-dark-surface-container-high/50">
            <div>
              {step === 0 ? (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Skip for now
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBack}
                  className="uc-btn-ghost text-sm py-2 px-4"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
            </div>

            <div>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (step === 0 && !canProceedStep0) ||
                    (step === 1 && !canProceedStep1)
                  }
                  className="uc-btn-primary text-sm py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canFinish || saving}
                  className="uc-btn-primary text-sm py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Save & Get Started
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes injected inline */}
      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
