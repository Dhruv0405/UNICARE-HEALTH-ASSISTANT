import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const metrics = [
  { key: 'weight', label: 'Weight', unit: 'kg', color: '#006a61' },
  { key: 'heart_rate', label: 'Heart Rate', unit: 'bpm', color: '#0052cc' },
  { key: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', color: '#dc2626' },
  { key: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL', color: '#f59e0b' },
  { key: 'sleep', label: 'Sleep Hours', unit: 'hrs', color: '#8b5cf6' },
  { key: 'adherence', label: 'Med Adherence', unit: '%', color: '#06b6d4' },
];

function generateData(metric, days) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const entry = { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    switch (metric) {
      case 'weight': entry.value = +(67 + Math.random() * 3).toFixed(1); break;
      case 'heart_rate': entry.value = 62 + Math.floor(Math.random() * 20); break;
      case 'blood_pressure': entry.systolic = 115 + Math.floor(Math.random() * 20); entry.diastolic = 70 + Math.floor(Math.random() * 12); entry.value = entry.systolic; break;
      case 'blood_sugar': entry.value = 80 + Math.floor(Math.random() * 50); break;
      case 'sleep': entry.value = +(5.5 + Math.random() * 3).toFixed(1); break;
      case 'adherence': entry.value = 60 + Math.floor(Math.random() * 40); break;
    }
    data.push(entry);
  }
  return data;
}

const CHART_COLORS = ['#0052cc', '#006a61', '#f59e0b', '#dc2626', '#8b5cf6', '#06b6d4'];

export default function DataVisualizerPage() {
  const [selectedMetric, setSelectedMetric] = useState('heart_rate');
  const [chartType, setChartType] = useState('area');
  const [timeRange, setTimeRange] = useState(30);

  const currentMetric = metrics.find(m => m.key === selectedMetric);
  const data = generateData(selectedMetric, timeRange);
  const values = data.map(d => d.value);
  const stats = {
    min: Math.min(...values).toFixed(1),
    max: Math.max(...values).toFixed(1),
    avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
    entries: values.length,
  };

  const pieData = metrics.map((m, i) => ({ name: m.label, value: 10 + Math.floor(Math.random() * 30) }));

  const renderChart = () => {
    const common = { data, margin: { top: 5, right: 20, left: 0, bottom: 5 } };
    switch (chartType) {
      case 'line':
        return (
          <LineChart {...common}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="value" stroke={currentMetric.color} strokeWidth={2.5} dot={{ r: 3 }} />
            {selectedMetric === 'blood_pressure' && <Line type="monotone" dataKey="diastolic" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...common}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="value" fill={currentMetric.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
              {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return (
          <AreaChart {...common}>
            <defs>
              <linearGradient id="vizGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="value" stroke={currentMetric.color} fill="url(#vizGrad)" strokeWidth={2.5} dot={{ r: 3, fill: currentMetric.color }} />
          </AreaChart>
        );
    }
  };

  return (
    <div className="uc-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="uc-page-title">Data Visualizer</h1>
          <p className="text-on-surface-variant">Analyze your health trends over time.</p>
        </div>
        <button className="uc-btn-secondary text-sm"><Download className="w-4 h-4" /> Export PNG</button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Metric selector */}
        <div className="flex flex-wrap gap-2">
          {metrics.map(m => (
            <button key={m.key} onClick={() => setSelectedMetric(m.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedMetric === m.key ? 'text-white shadow-md' : 'bg-white dark:bg-dark-surface-container border border-outline-variant/30 text-on-surface-variant'}`}
              style={selectedMetric === m.key ? { backgroundColor: m.color } : {}}>
              {m.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          {/* Chart type */}
          <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-lg p-1">
            {['area', 'line', 'bar', 'pie'].map(t => (
              <button key={t} onClick={() => setChartType(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${chartType === t ? 'bg-white dark:bg-dark-surface shadow-sm text-on-surface' : 'text-on-surface-variant'}`}>
                {t}
              </button>
            ))}
          </div>
          {/* Time range */}
          <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-lg p-1">
            {[7, 30, 90].map(d => (
              <button key={d} onClick={() => setTimeRange(d)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === d ? 'bg-white dark:bg-dark-surface shadow-sm text-on-surface' : 'text-on-surface-variant'}`}>
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 uc-card">
          <h3 className="font-bold text-on-surface dark:text-dark-on-surface mb-4">{currentMetric.label} — {timeRange} Day Trend</h3>
          <ResponsiveContainer width="100%" height={350}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {[
            { label: 'Average', value: stats.avg, icon: '📊' },
            { label: 'Highest', value: stats.max, icon: '📈' },
            { label: 'Lowest', value: stats.min, icon: '📉' },
            { label: 'Total Entries', value: stats.entries, icon: '📋' },
          ].map((stat, i) => (
            <div key={i} className="uc-card text-center stagger-item">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-xs text-on-surface-variant mt-2">{stat.label}</p>
              <p className="text-xl font-bold text-on-surface dark:text-dark-on-surface mt-1">
                {stat.value} {stat.label !== 'Total Entries' ? currentMetric.unit : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
