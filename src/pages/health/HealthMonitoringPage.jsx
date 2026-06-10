import React, { useState } from 'react';
import {
  Activity, Plus, TrendingUp, Download, Calendar as CalendarIcon,
  Heart, Droplets, Thermometer, Weight, Wind, ChevronDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const metricTypes = [
  { key: 'heart_rate', label: 'Heart Rate', unit: 'bpm', icon: Heart, color: '#0052cc', normalRange: [60, 100] },
  { key: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', icon: Activity, color: '#dc2626', normalRange: [90, 140], hasDual: true },
  { key: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL', icon: Droplets, color: '#f59e0b', normalRange: [70, 140] },
  { key: 'weight', label: 'Weight', unit: 'kg', icon: Weight, color: '#006a61', normalRange: [50, 100] },
  { key: 'temperature', label: 'Temperature', unit: '°F', icon: Thermometer, color: '#8b5cf6', normalRange: [97, 99.5] },
  { key: 'spo2', label: 'SpO2', unit: '%', icon: Wind, color: '#06b6d4', normalRange: [95, 100] },
];

// Generate mock chart data
function generateMockData(type, days = 7) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const entry = { date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    switch (type) {
      case 'heart_rate': entry.value = 65 + Math.floor(Math.random() * 20); break;
      case 'blood_pressure': entry.value = 115 + Math.floor(Math.random() * 20); entry.value2 = 70 + Math.floor(Math.random() * 15); break;
      case 'blood_sugar': entry.value = 80 + Math.floor(Math.random() * 40); break;
      case 'weight': entry.value = 67 + Math.random() * 3; break;
      case 'temperature': entry.value = 97.5 + Math.random() * 2; break;
      case 'spo2': entry.value = 95 + Math.floor(Math.random() * 5); break;
    }
    data.push(entry);
  }
  return data;
}

export default function HealthMonitoringPage() {
  const [selectedMetric, setSelectedMetric] = useState('heart_rate');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryForm, setEntryForm] = useState({ type: 'heart_rate', value: '', value2: '', notes: '' });
  const [timeRange, setTimeRange] = useState(7);

  const currentType = metricTypes.find((m) => m.key === selectedMetric);
  const chartData = generateMockData(selectedMetric, timeRange);
  const latestValue = chartData[chartData.length - 1]?.value;
  const isNormal = latestValue >= currentType.normalRange[0] && latestValue <= currentType.normalRange[1];

  const handleAddEntry = (e) => {
    e.preventDefault();
    console.log('Adding entry:', entryForm);
    setShowEntryForm(false);
    setEntryForm({ type: selectedMetric, value: '', value2: '', notes: '' });
  };

  return (
    <div className="uc-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="uc-page-title">Health Monitoring</h1>
          <p className="text-on-surface-variant">Track and visualize your vital signs.</p>
        </div>
        <div className="flex gap-3">
          <button className="uc-btn-secondary text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setShowEntryForm(!showEntryForm)} className="uc-btn-primary text-sm">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </div>

      {/* Entry Form */}
      {showEntryForm && (
        <div className="uc-card mb-6 animate-slide-up">
          <h3 className="font-semibold text-on-surface dark:text-dark-on-surface mb-4">New Health Entry</h3>
          <form onSubmit={handleAddEntry} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <select value={entryForm.type} onChange={(e) => setEntryForm({ ...entryForm, type: e.target.value })} className="uc-input">
              {metricTypes.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
            <input type="number" step="0.1" placeholder="Value" value={entryForm.value} onChange={(e) => setEntryForm({ ...entryForm, value: e.target.value })} required className="uc-input" />
            {metricTypes.find(m => m.key === entryForm.type)?.hasDual && (
              <input type="number" step="0.1" placeholder="Diastolic" value={entryForm.value2} onChange={(e) => setEntryForm({ ...entryForm, value2: e.target.value })} className="uc-input" />
            )}
            <input type="text" placeholder="Notes (optional)" value={entryForm.notes} onChange={(e) => setEntryForm({ ...entryForm, notes: e.target.value })} className="uc-input" />
            <button type="submit" className="uc-btn-primary">Save Entry</button>
          </form>
        </div>
      )}

      {/* Metric selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metricTypes.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedMetric === m.key
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white dark:bg-dark-surface-container border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <Icon className="w-4 h-4" />
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart area (2/3) */}
        <div className="lg:col-span-2 uc-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-on-surface dark:text-dark-on-surface">{currentType.label} Trend</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-bold" style={{ color: currentType.color }}>
                  {typeof latestValue === 'number' ? latestValue.toFixed(currentType.key === 'weight' || currentType.key === 'temperature' ? 1 : 0) : '--'}
                </span>
                <span className="text-sm text-on-surface-variant">{currentType.unit}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isNormal ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {isNormal ? 'Normal' : 'Review'}
                </span>
              </div>
            </div>
            <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-lg p-1">
              {[7, 30, 90].map((d) => (
                <button key={d} onClick={() => setTimeRange(d)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === d ? 'bg-white dark:bg-dark-surface shadow-sm text-on-surface' : 'text-on-surface-variant'}`}>
                  {d}d
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentType.color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={currentType.color} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="value" stroke={currentType.color} fill="url(#colorGrad)" strokeWidth={2.5} dot={{ r: 4, fill: currentType.color }} />
              {currentType.hasDual && <Line type="monotone" dataKey="value2" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" dot={false} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary (1/3) */}
        <div className="space-y-4">
          <div className="uc-card">
            <h3 className="font-semibold text-sm text-on-surface-variant mb-4">Summary ({timeRange} days)</h3>
            {[
              { label: 'Average', value: (chartData.reduce((a, b) => a + b.value, 0) / chartData.length).toFixed(1) },
              { label: 'Highest', value: Math.max(...chartData.map(d => d.value)).toFixed(1) },
              { label: 'Lowest', value: Math.min(...chartData.map(d => d.value)).toFixed(1) },
              { label: 'Entries', value: chartData.length },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-outline-variant/10 last:border-0">
                <span className="text-sm text-on-surface-variant">{stat.label}</span>
                <span className="font-semibold text-on-surface dark:text-dark-on-surface">{stat.value} {stat.label !== 'Entries' ? currentType.unit : ''}</span>
              </div>
            ))}
          </div>
          <div className="uc-card">
            <h3 className="font-semibold text-sm text-on-surface-variant mb-2">Normal Range</h3>
            <p className="text-lg font-bold text-on-surface dark:text-dark-on-surface">
              {currentType.normalRange[0]} — {currentType.normalRange[1]} {currentType.unit}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">Values outside this range will trigger alerts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
