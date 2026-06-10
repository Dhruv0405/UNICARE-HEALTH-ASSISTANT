import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    blood_group: '',
    emergency_contact: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const { register, loginWithGoogle, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (form.password !== form.confirmPassword) {
      useAuthStore.setState({ error: 'Passwords do not match' });
      return;
    }

    if (form.password.length < 6) {
      useAuthStore.setState({ error: 'Password must be at least 6 characters' });
      return;
    }

    const success = await register(form);
    if (success) navigate('/', { replace: true });
  };

  const handleGoogle = async () => {
    clearError();
    const success = await loginWithGoogle();
    if (success) navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-500 to-teal-500 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <path d="M12 7v4M10 9h4" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">UNICARE</h1>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Start Your<br />
            Health Journey.
          </h2>
          <p className="text-white/80 text-lg max-w-md">
            Create your personal health profile and unlock AI-powered wellness insights.
          </p>
        </div>

        <p className="relative z-10 text-white/40 text-xs">Your data stays local and private.</p>
      </div>

      {/* Right: Registration form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface dark:bg-dark-surface overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-headline-sm text-on-surface dark:text-dark-on-surface">Create Account</h2>
            <p className="text-on-surface-variant mt-1">
              {step === 1 ? 'Enter your basic information' : 'Complete your health profile'}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex gap-2">
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary-500' : 'bg-surface-container-high'}`} />
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary-500' : 'bg-surface-container-high'}`} />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 text-sm text-danger-600 animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">Full Name</label>
                  <input id="name" type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Sarah Jenkins" required className="uc-input" />
                </div>
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">Email</label>
                  <input id="reg-email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" required className="uc-input" autoComplete="email" />
                </div>
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">Password</label>
                  <div className="relative">
                    <input id="reg-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Min 6 characters" required minLength={6} className="uc-input pr-12" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">Confirm Password</label>
                  <input id="confirm-password" type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="Re-enter password" required className="uc-input" autoComplete="new-password" />
                </div>
                <button type="button" onClick={() => setStep(2)} className="uc-btn-primary w-full" disabled={!form.name || !form.email || !form.password}>
                  Continue
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/30 dark:border-dark-surface-container-high/50" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-surface dark:bg-dark-surface px-3 text-on-surface-variant">or</span>
                  </div>
                </div>

                {/* Google Sign-Up */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg border-2 border-outline-variant/30 dark:border-dark-surface-container-high/50
                    bg-white dark:bg-dark-surface-container hover:bg-surface-container-low dark:hover:bg-dark-surface-container-high
                    text-on-surface dark:text-dark-on-surface font-semibold text-sm transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  id="google-signup-btn"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">Date of Birth</label>
                    <input id="dob" type="date" value={form.dob} onChange={(e) => updateField('dob', e.target.value)} max={new Date().toISOString().split('T')[0]} className="uc-input" />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">Gender</label>
                    <select id="gender" value={form.gender} onChange={(e) => updateField('gender', e.target.value)} className="uc-input">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="blood_group" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">Blood Group</label>
                  <select id="blood_group" value={form.blood_group} onChange={(e) => updateField('blood_group', e.target.value)} className="uc-input">
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="emergency" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-1.5">Emergency Contact</label>
                  <input id="emergency" type="tel" value={form.emergency_contact} onChange={(e) => updateField('emergency_contact', e.target.value)} placeholder="+1-555-0123" className="uc-input" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="uc-btn-secondary flex-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" disabled={isLoading} className="uc-btn-primary flex-1">
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
