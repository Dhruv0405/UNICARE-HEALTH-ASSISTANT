import React, { useState } from 'react';
import { Stethoscope, Star, Video, MessageSquare, Clock, MapPin, Phone, X } from 'lucide-react';

const mockDoctors = [
  { id: 1, name: 'Dr. Emily Chen', specialty: 'General Practice', rating: 4.9, reviews: 127, fee: '$75', available: true, experience: '12 years', languages: ['English', 'Mandarin'] },
  { id: 2, name: 'Dr. Michael Park', specialty: 'Cardiology', rating: 4.8, reviews: 98, fee: '$120', available: true, experience: '15 years', languages: ['English', 'Korean'] },
  { id: 3, name: 'Dr. Sarah Williams', specialty: 'Dermatology', rating: 4.7, reviews: 85, fee: '$95', available: false, experience: '8 years', languages: ['English'] },
  { id: 4, name: 'Dr. James Rodriguez', specialty: 'Orthopedics', rating: 4.6, reviews: 72, fee: '$110', available: true, experience: '20 years', languages: ['English', 'Spanish'] },
  { id: 5, name: 'Dr. Priya Sharma', specialty: 'Endocrinology', rating: 4.9, reviews: 64, fee: '$100', available: true, experience: '10 years', languages: ['English', 'Hindi'] },
  { id: 6, name: 'Dr. Lisa Thompson', specialty: 'Pediatrics', rating: 4.9, reviews: 156, fee: '$85', available: false, experience: '14 years', languages: ['English'] },
];

export default function ConsultationPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? mockDoctors : mockDoctors.filter(d => d.available);

  if (showVideoCall) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-900 relative">
        <button onClick={() => setShowVideoCall(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Video className="w-10 h-10 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Joining Call...</h2>
          <p className="text-gray-400 mb-1">{selectedDoctor?.name}</p>
          <p className="text-gray-500 text-sm">{selectedDoctor?.specialty}</p>
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{animationDelay: '0s'}} />
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{animationDelay: '0.15s'}} />
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{animationDelay: '0.3s'}} />
          </div>
          <p className="text-gray-500 text-xs mt-8">This is a simulated consultation screen</p>
        </div>
        <div className="absolute bottom-8 flex gap-4">
          <button className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">🎤</button>
          <button className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">📹</button>
          <button onClick={() => setShowVideoCall(false)} className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
            <Phone className="w-6 h-6 rotate-[135deg]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="uc-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="uc-page-title">Doctor Consultation</h1>
          <p className="text-on-surface-variant">Get immediate medical advice from certified professionals.</p>
        </div>
      </div>

      {/* Consult a Doctor CTA */}
      <div className="rounded-xl bg-gradient-to-r from-primary-500 to-blue-400 p-8 text-white mb-8 relative overflow-hidden stagger-item">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <span className="inline-flex items-center gap-1.5 text-xs bg-green-500/30 text-green-100 px-2.5 py-1 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Physicians Online Now
        </span>
        <h2 className="text-2xl font-bold mb-2 relative z-10">Consult a Doctor</h2>
        <p className="text-white/80 max-w-md mb-6 relative z-10">Get immediate medical advice from our certified professionals via secure video call or text chat.</p>
        <div className="flex gap-3 relative z-10">
          <button onClick={() => { setSelectedDoctor(mockDoctors[0]); setShowVideoCall(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-colors">
            <Video className="w-4 h-4" /> Start Video Consult
          </button>
          <button onClick={() => setShowChat(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary-500 font-semibold text-sm hover:bg-white/90 transition-colors">
            <MessageSquare className="w-4 h-4" /> Open Live Chat
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-dark-surface-container border border-outline-variant/30 text-on-surface-variant'}`}>All Doctors</button>
        <button onClick={() => setFilter('available')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'available' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-dark-surface-container border border-outline-variant/30 text-on-surface-variant'}`}>Available Now</button>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div key={doc.id} className="uc-card hover:shadow-card-hover transition-shadow stagger-item">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface dark:text-dark-on-surface">{doc.name}</h3>
                <p className="text-xs text-on-surface-variant">{doc.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-on-surface dark:text-dark-on-surface">{doc.rating}</span>
                  <span className="text-xs text-on-surface-variant">({doc.reviews})</span>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${doc.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {doc.available ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-4">
              <span>{doc.experience}</span>
              <span className="font-semibold text-on-surface dark:text-dark-on-surface">{doc.fee}/session</span>
            </div>
            <div className="flex gap-2">
              <button disabled={!doc.available} onClick={() => { setSelectedDoctor(doc); setShowVideoCall(true); }}
                className="flex-1 uc-btn-primary text-xs py-2 disabled:opacity-40">
                <Video className="w-3.5 h-3.5" /> Video Call
              </button>
              <button disabled={!doc.available} className="flex-1 uc-btn-secondary text-xs py-2 disabled:opacity-40">
                <MessageSquare className="w-3.5 h-3.5" /> Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
