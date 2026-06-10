import React, { useState } from 'react';
import { Pill, Plus, Clock, Check, X, TrendingUp, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

const mockMedications = [
  { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'daily', times: '8:00 AM', instructions: 'With food', active: true },
  { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'daily', times: '2:00 PM', instructions: 'After lunch', active: true },
  { id: 3, name: 'Atorvastatin', dosage: '20mg', frequency: 'daily', times: '8:00 PM', instructions: 'Before bed', active: true },
  { id: 4, name: 'Vitamin D3', dosage: '2000IU', frequency: 'daily', times: '9:00 AM', instructions: 'With breakfast', active: true },
];

const mockLogs = [
  { id: 1, medName: 'Lisinopril 10mg', time: '8:00 AM', taken: true, date: 'Today' },
  { id: 2, medName: 'Metformin 500mg', time: '2:00 PM', taken: false, skipped: true, date: 'Today' },
  { id: 3, medName: 'Lisinopril 10mg', time: '8:00 AM', taken: true, date: 'Yesterday' },
  { id: 4, medName: 'Metformin 500mg', time: '2:00 PM', taken: true, date: 'Yesterday' },
  { id: 5, medName: 'Atorvastatin 20mg', time: '8:00 PM', taken: true, date: 'Yesterday' },
];

export default function MedicationsPage() {
  const [medications, setMedications] = useState(mockMedications);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [form, setForm] = useState({ name: '', dosage: '', frequency: 'daily', times: '', instructions: '' });

  const adherenceRate = 78;
  const takenToday = 2;
  const totalToday = 4;

  const handleAdd = (e) => {
    e.preventDefault();
    setMedications([...medications, { id: Date.now(), ...form, active: true }]);
    setForm({ name: '', dosage: '', frequency: 'daily', times: '', instructions: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  return (
    <div className="uc-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="uc-page-title">Medications & Reminders</h1>
          <p className="text-on-surface-variant">Manage your medications and track adherence.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="uc-btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Medication
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="uc-card mb-6 animate-slide-up">
          <h3 className="font-semibold text-on-surface dark:text-dark-on-surface mb-4">New Medication</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Medication name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="uc-input" />
            <input type="text" placeholder="Dosage (e.g., 10mg)" value={form.dosage} onChange={(e) => setForm({...form, dosage: e.target.value})} required className="uc-input" />
            <select value={form.frequency} onChange={(e) => setForm({...form, frequency: e.target.value})} className="uc-input">
              <option value="daily">Daily</option>
              <option value="twice_daily">Twice Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
            <input type="time" placeholder="Time" value={form.times} onChange={(e) => setForm({...form, times: e.target.value})} required className="uc-input" />
            <input type="text" placeholder="Instructions (optional)" value={form.instructions} onChange={(e) => setForm({...form, instructions: e.target.value})} className="uc-input" />
            <div className="flex gap-2">
              <button type="submit" className="uc-btn-primary flex-1">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="uc-btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Medication list (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-xl p-1 w-fit">
            {['current', 'log'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                  activeTab === tab ? 'bg-white dark:bg-dark-surface shadow-sm text-on-surface' : 'text-on-surface-variant'
                }`}>
                {tab === 'current' ? 'Current Medications' : 'Log History'}
              </button>
            ))}
          </div>

          {activeTab === 'current' ? (
            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.id} className="uc-card flex items-center gap-4 stagger-item">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                    <Pill className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-on-surface dark:text-dark-on-surface">{med.name} ({med.dosage})</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {med.times}
                      </span>
                      <span className="text-xs text-on-surface-variant capitalize">{med.frequency.replace('_', ' ')}</span>
                      {med.instructions && <span className="text-xs text-on-surface-variant">• {med.instructions}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="uc-btn-primary text-xs py-1.5 px-3">
                      <Check className="w-3.5 h-3.5" /> Take
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(med.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {mockLogs.map((log) => (
                <div key={log.id} className="uc-card flex items-center gap-3 py-3 px-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    log.taken ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {log.taken ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-on-surface dark:text-dark-on-surface">{log.medName}</span>
                    <span className="text-xs text-on-surface-variant ml-2">{log.time}</span>
                  </div>
                  <span className="text-xs text-on-surface-variant">{log.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Adherence (1/3) */}
        <div className="space-y-4">
          <div className="uc-card text-center">
            <h3 className="text-sm font-semibold text-on-surface-variant mb-4">Weekly Adherence</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#0052cc" strokeWidth="10"
                  strokeDasharray={`${adherenceRate * 2.64} ${264 - adherenceRate * 2.64}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-on-surface dark:text-dark-on-surface">{adherenceRate}%</span>
                <span className="text-xs text-on-surface-variant">taken</span>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant">{takenToday} of {totalToday} taken today</p>
          </div>

          <div className="uc-card">
            <h3 className="text-sm font-semibold text-on-surface-variant mb-3">Today's Schedule</h3>
            <div className="space-y-2">
              {medications.map((med) => (
                <div key={med.id} className="flex items-center gap-2 text-sm">
                  <span className="w-16 text-xs text-on-surface-variant">{med.times}</span>
                  <span className="flex-1 text-on-surface dark:text-dark-on-surface">{med.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-outline-variant" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
