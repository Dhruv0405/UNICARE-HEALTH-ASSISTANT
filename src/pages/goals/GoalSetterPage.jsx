import React, { useState, useEffect } from 'react';
import { Target, Plus, Trophy, Trash2, Edit2, Check, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

const goalTypes = [
  { key: 'weight', label: 'Target Weight', unit: 'kg', icon: '⚖️' },
  { key: 'steps', label: 'Daily Steps', unit: 'steps', icon: '🚶' },
  { key: 'workout', label: 'Workouts/Week', unit: 'sessions', icon: '💪' },
  { key: 'water', label: 'Water Intake', unit: 'glasses', icon: '💧' },
  { key: 'sleep', label: 'Sleep Hours', unit: 'hours', icon: '😴' },
];

const initialGoals = [
  { id: 1, type: 'weight', title: 'Reach Target Weight', target: 65, current: 68.2, unit: 'kg', deadline: '2026-08-01', achieved: false },
  { id: 2, type: 'steps', title: 'Daily 10K Steps', target: 10000, current: 8500, unit: 'steps', deadline: '2026-06-30', achieved: false },
  { id: 3, type: 'workout', title: '4 Workouts/Week', target: 4, current: 3, unit: 'sessions', deadline: '2026-06-01', achieved: false },
  { id: 4, type: 'water', title: '8 Glasses Daily', target: 8, current: 5, unit: 'glasses', deadline: null, achieved: false },
  { id: 5, type: 'sleep', title: '8 Hours Sleep', target: 8, current: 7.2, unit: 'hours', deadline: null, achieved: false },
];

export default function GoalSetterPage() {
  const [goals, setGoals] = useState(initialGoals);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'weight', title: '', target: '', current: '', unit: 'kg', deadline: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const goalType = goalTypes.find(g => g.key === form.type);
    setGoals(prev => [...prev, {
      id: Date.now(),
      ...form,
      target: Number(form.target),
      current: Number(form.current) || 0,
      unit: goalType?.unit || form.unit,
      achieved: false,
    }]);
    setForm({ type: 'weight', title: '', target: '', current: '', unit: 'kg', deadline: '' });
    setShowForm(false);
  };

  const updateProgress = (id, delta) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const newCurrent = Math.max(0, g.current + delta);
      const achieved = g.type === 'weight' ? newCurrent <= g.target : newCurrent >= g.target;
      if (achieved && !g.achieved) {
        // Fire confetti!
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#0052cc', '#006a61', '#f59e0b', '#8b5cf6'] });
      }
      return { ...g, current: newCurrent, achieved };
    }));
  };

  const getProgress = (goal) => {
    if (goal.type === 'weight') return Math.max(0, Math.min(100, ((goal.target - (goal.current - goal.target)) / goal.target) * 100));
    return Math.min(100, (goal.current / goal.target) * 100);
  };

  return (
    <div className="uc-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="uc-page-title">Goal Setter</h1>
          <p className="text-on-surface-variant">Set health goals and track your progress.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="uc-btn-primary text-sm">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="uc-card mb-6 animate-slide-up">
          <h3 className="font-semibold text-on-surface dark:text-dark-on-surface mb-4">Create New Goal</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select value={form.type} onChange={(e) => { const gt = goalTypes.find(g => g.key === e.target.value); setForm({...form, type: e.target.value, unit: gt?.unit || 'kg', title: gt?.label || ''}); }} className="uc-input">
              {goalTypes.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}
            </select>
            <input type="text" placeholder="Goal title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required className="uc-input" />
            <input type="number" step="0.1" placeholder="Target value" value={form.target} onChange={(e) => setForm({...form, target: e.target.value})} required className="uc-input" />
            <input type="date" placeholder="Deadline (optional)" value={form.deadline} onChange={(e) => setForm({...form, deadline: e.target.value})} className="uc-input" />
            <button type="submit" className="uc-btn-primary">Save Goal</button>
          </form>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="uc-card text-center stagger-item">
          <p className="text-2xl font-bold text-on-surface dark:text-dark-on-surface">{goals.length}</p>
          <p className="text-xs text-on-surface-variant">Total Goals</p>
        </div>
        <div className="uc-card text-center stagger-item">
          <p className="text-2xl font-bold text-teal-600">{goals.filter(g => g.achieved).length}</p>
          <p className="text-xs text-on-surface-variant">Achieved</p>
        </div>
        <div className="uc-card text-center stagger-item">
          <p className="text-2xl font-bold text-primary-500">{goals.filter(g => !g.achieved).length}</p>
          <p className="text-xs text-on-surface-variant">In Progress</p>
        </div>
        <div className="uc-card text-center stagger-item">
          <p className="text-2xl font-bold text-amber-500">
            {goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + getProgress(g), 0) / goals.length) : 0}%
          </p>
          <p className="text-xs text-on-surface-variant">Avg Progress</p>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = getProgress(goal);
          const goalType = goalTypes.find(g => g.key === goal.type);
          return (
            <div key={goal.id} className={`uc-card stagger-item ${goal.achieved ? 'ring-2 ring-green-400 bg-green-50/50 dark:bg-green-900/10' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="text-3xl">{goalType?.icon || '🎯'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-on-surface dark:text-dark-on-surface">{goal.title}</h3>
                    {goal.achieved && <Trophy className="w-4 h-4 text-amber-500" />}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {goal.current} / {goal.target} {goal.unit}
                    {goal.deadline && <span className="ml-2">• Due: {new Date(goal.deadline).toLocaleDateString()}</span>}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex-1 h-2.5 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${goal.achieved ? 'bg-green-500' : 'bg-primary-500'}`} style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-on-surface-variant w-12 text-right">{Math.round(progress)}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => updateProgress(goal.id, goal.type === 'weight' ? -0.5 : 1)}
                    className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center hover:bg-primary-100 transition-colors">
                    <TrendingUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => setGoals(prev => prev.filter(g => g.id !== goal.id))}
                    className="w-9 h-9 rounded-lg text-danger-500 hover:bg-danger-50 flex items-center justify-center transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
