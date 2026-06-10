import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import {
  Heart,
  Activity,
  Droplets,
  Moon,
  Calendar,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Pill,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mini sparkline component
function Sparkline({ data, color = '#0052cc', height = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={height} className="mt-2">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Mock data matching the mockups
  const vitals = [
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'Normal', statusColor: 'text-green-600 bg-green-50', icon: Heart, sparkData: [68, 70, 72, 71, 73, 72, 70, 72], color: '#0052cc' },
    { label: 'Blood Pressure', value: '128', extra: '/82', unit: 'mmHg', status: 'Review', statusColor: 'text-red-600 bg-red-50', icon: Activity, sparkData: [120, 125, 130, 128, 132, 128, 126, 128], color: '#dc2626' },
    { label: 'Oxygen', value: '98', unit: '%', status: 'Normal', statusColor: 'text-green-600 bg-green-50', icon: Droplets, sparkData: [97, 98, 98, 97, 98, 99, 98, 98], color: '#006a61' },
  ];

  const aiInsights = [
    { title: 'High Stress Detected', desc: 'Try a 5-min breathing exercise to lower your cortisol levels.', icon: '⚠️' },
    { title: 'Heart Rate Trend', desc: 'Elevated over 3 days. Consider scheduling a quick check-in.', icon: '📈' },
  ];

  const medications = [
    { time: '8 AM', name: 'Lisinopril (10mg)', instructions: 'With food', taken: false },
    { time: '2 PM', name: 'Metformin (500mg)', instructions: 'After lunch', taken: false },
  ];

  return (
    <div className="uc-page">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-headline-sm font-bold text-on-surface dark:text-dark-on-surface">
          {greeting}, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Here is your daily health summary.
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          {/* AI Insights Card */}
          <div className="uc-card bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-100 dark:border-primary-800/30 relative overflow-hidden stagger-item">
            {/* Sparkle decoration */}
            <div className="absolute top-4 right-4 opacity-10">
              <Sparkles className="w-20 h-20 text-primary-500" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface">AI Insights</h2>
              </div>
              <button onClick={() => navigate('/ai')} className="text-sm font-medium text-primary-500 hover:underline flex items-center gap-1">
                View All Insights <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {aiInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-xl">
                  <div className="text-xl">{insight.icon}</div>
                  <div>
                    <h3 className="font-semibold text-sm text-on-surface dark:text-dark-on-surface">{insight.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{insight.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Vitals */}
          <div className="uc-card stagger-item">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface">Health Vitals</h2>
              </div>
              <button onClick={() => navigate('/health')} className="text-sm font-medium text-primary-500 hover:underline">
                View History
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {vitals.map((vital, i) => {
                const Icon = vital.icon;
                return (
                  <div key={i} className="p-4 rounded-xl border border-outline-variant/20 dark:border-dark-surface-container-high/50 hover:shadow-card transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-on-surface-variant">{vital.label}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${vital.statusColor}`}>
                        {vital.status}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-on-surface dark:text-dark-on-surface">{vital.value}</span>
                      {vital.extra && <span className="text-xl font-bold text-on-surface-variant">{vital.extra}</span>}
                      <span className="text-sm text-on-surface-variant ml-1">{vital.unit}</span>
                    </div>
                    <Sparkline data={vital.sparkData} color={vital.color} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Medication Today */}
          <div className="uc-card stagger-item">
            <div className="flex items-center gap-2 mb-5">
              <Pill className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface">Medication Today</h2>
            </div>
            <div className="space-y-3">
              {medications.map((med, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 dark:border-dark-surface-container-high/50">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-300">{med.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-on-surface dark:text-dark-on-surface">{med.name}</h3>
                    <p className="text-xs text-on-surface-variant">{med.instructions}</p>
                  </div>
                  <button className="uc-btn-primary text-xs py-1.5 px-4">
                    Take
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-6">
          {/* Next Appointment */}
          <div className="rounded-xl bg-primary-500 text-white p-6 shadow-elevated stagger-item">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5" />
              <h2 className="text-lg font-bold">Next Appointment</h2>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Dr. Emily Chen</h3>
                <span className="flex items-center gap-1 text-xs bg-green-500/30 text-green-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online
                </span>
              </div>
              <p className="text-sm text-white/80">Cardiology Follow-up</p>
              <div className="flex items-center gap-1.5 mt-3 text-sm text-white/70">
                <Clock className="w-4 h-4" />
                Today, 3:30 PM
              </div>
            </div>
            <button
              onClick={() => navigate('/consultation')}
              className="w-full py-2.5 rounded-xl bg-white text-primary-500 font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              Join Call
            </button>
          </div>

          {/* Quick Log */}
          <div className="uc-card stagger-item">
            <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface mb-3">Quick Log</h2>
            <p className="text-sm text-on-surface-variant mb-3">How are you feeling?</p>
            <textarea
              placeholder="e.g., slight headache"
              className="uc-input resize-none h-20 text-sm"
              aria-label="Log your symptoms"
            />
            <button className="uc-btn-secondary w-full mt-3 text-sm">
              Log Symptom
            </button>
          </div>

          {/* Quick Actions */}
          <div className="uc-card stagger-item">
            <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Book Appointment', icon: Calendar, path: '/appointments', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
                { label: 'SOS', icon: AlertTriangle, path: '#sos', color: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
                { label: 'AI Chat', icon: Sparkles, path: '/ai', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
                { label: 'Store', icon: ShoppingBag, path: '/store', color: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color} hover:scale-[1.02] active:scale-[0.98] transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
