import React, { useState, useMemo } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import {
  Calendar as CalendarIcon, Clock, User, Plus, X, Check, ChevronRight,
  Search, MapPin, Star, Stethoscope, Video, MessageSquare, Phone,
  ArrowLeft, Filter, DollarSign, ChevronDown, Heart
} from 'lucide-react';

// Extended doctor data with location, about, timings
const allDoctors = [
  {
    id: 1, name: 'Dr. Emily Chen', specialty: 'General Practice', rating: 4.9, reviews: 127,
    fee: 75, available: true, experience: '12 years', languages: ['English', 'Mandarin'],
    location: 'Downtown Medical Center, New York', avatar: '👩‍⚕️',
    about: 'Dr. Emily Chen is a board-certified family medicine physician with over 12 years of experience. She specializes in preventive care, chronic disease management, and women\'s health. She is known for her compassionate approach and thorough consultations.',
    timings: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'],
    education: 'MD - Johns Hopkins University',
  },
  {
    id: 2, name: 'Dr. Michael Park', specialty: 'Cardiology', rating: 4.8, reviews: 98,
    fee: 120, available: true, experience: '15 years', languages: ['English', 'Korean'],
    location: 'Heart Care Institute, Manhattan', avatar: '👨‍⚕️',
    about: 'Dr. Michael Park is a leading cardiologist specializing in interventional cardiology and heart failure management. He has performed over 2,000 cardiac procedures and is a frequent speaker at international conferences.',
    timings: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '03:00 PM', '03:30 PM'],
    education: 'MD - Harvard Medical School',
  },
  {
    id: 3, name: 'Dr. Sarah Williams', specialty: 'Dermatology', rating: 4.7, reviews: 85,
    fee: 95, available: true, experience: '8 years', languages: ['English'],
    location: 'SkinCare Clinic, Brooklyn', avatar: '👩‍⚕️',
    about: 'Dr. Sarah Williams is a dermatologist with expertise in medical and cosmetic dermatology. She treats conditions ranging from acne and eczema to skin cancer screening.',
    timings: ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '02:00 PM', '02:30 PM'],
    education: 'MD - Stanford University',
  },
  {
    id: 4, name: 'Dr. James Rodriguez', specialty: 'Orthopedics', rating: 4.6, reviews: 72,
    fee: 110, available: true, experience: '20 years', languages: ['English', 'Spanish'],
    location: 'Bone & Joint Center, Queens', avatar: '👨‍⚕️',
    about: 'Dr. James Rodriguez is an orthopedic surgeon with 20 years of experience in sports medicine and joint replacement surgery. He has treated professional athletes and is an expert in minimally invasive procedures.',
    timings: ['09:00 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    education: 'MD - UCLA Medical School',
  },
  {
    id: 5, name: 'Dr. Priya Sharma', specialty: 'Endocrinology', rating: 4.9, reviews: 64,
    fee: 100, available: true, experience: '10 years', languages: ['English', 'Hindi'],
    location: 'Diabetes Care Center, Manhattan', avatar: '👩‍⚕️',
    about: 'Dr. Priya Sharma specializes in diabetes management, thyroid disorders, and hormonal imbalances. She takes a holistic approach combining medicine with lifestyle modifications.',
    timings: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'],
    education: 'MD - AIIMS New Delhi',
  },
  {
    id: 6, name: 'Dr. Lisa Thompson', specialty: 'Pediatrics', rating: 4.9, reviews: 156,
    fee: 85, available: true, experience: '14 years', languages: ['English'],
    location: 'Children\'s Wellness Center, Bronx', avatar: '👩‍⚕️',
    about: 'Dr. Lisa Thompson is a pediatrician who provides comprehensive care for children from newborns to adolescents. She is passionate about childhood development and preventive healthcare.',
    timings: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM'],
    education: 'MD - Columbia University',
  },
  {
    id: 7, name: 'Dr. David Kim', specialty: 'Neurology', rating: 4.8, reviews: 91,
    fee: 130, available: true, experience: '18 years', languages: ['English', 'Korean'],
    location: 'NeuroHealth Clinic, Manhattan', avatar: '👨‍⚕️',
    about: 'Dr. David Kim is a neurologist specializing in headaches, epilepsy, and neurodegenerative diseases. He uses cutting-edge diagnostic tools and personalized treatment plans.',
    timings: ['10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:00 PM', '03:30 PM'],
    education: 'MD - Yale School of Medicine',
  },
  {
    id: 8, name: 'Dr. Maria Gonzalez', specialty: 'Gynecology', rating: 4.8, reviews: 118,
    fee: 90, available: true, experience: '11 years', languages: ['English', 'Spanish'],
    location: 'Women\'s Health Clinic, Brooklyn', avatar: '👩‍⚕️',
    about: 'Dr. Maria Gonzalez is an OB/GYN who provides comprehensive women\'s healthcare including prenatal care, fertility consultations, and minimally invasive gynecologic surgery.',
    timings: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '02:00 PM', '02:30 PM', '03:00 PM'],
    education: 'MD - NYU Grossman School of Medicine',
  },
];

const specialties = [...new Set(allDoctors.map(d => d.specialty))].sort();
const locations = ['All Locations', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Downtown'];

function loadAppointments() {
  try { return JSON.parse(localStorage.getItem('unicare_appointments') || '[]'); }
  catch { return []; }
}
function saveAppointments(apts) {
  localStorage.setItem('unicare_appointments', JSON.stringify(apts));
}

export default function AppointmentsPage() {
  const addNotification = useNotificationStore((s) => s.addNotification);

  // View states: 'search' | 'results' | 'detail' | 'booking'
  const [view, setView] = useState('search');
  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'upcoming' | 'past'

  // Search filters
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  // Results & booking
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [booked, setBooked] = useState(false);

  // Appointments
  const [appointments, setAppointments] = useState(loadAppointments);

  // Video call state
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Filter doctors based on search criteria
  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(d => {
      if (selectedSpecialty && d.specialty !== selectedSpecialty) return false;
      if (selectedLocation !== 'All Locations' && !d.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      return true;
    });
  }, [selectedSpecialty, selectedLocation]);

  const handleSearch = () => {
    setView('results');
  };

  const handleSelectDoctor = (doc) => {
    setSelectedDoctor(doc);
    setView('detail');
  };

  const handleBook = () => {
    const newAppointment = {
      id: Date.now().toString(),
      doctor: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      location: selectedDoctor.location,
      date: new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rawDate: selectedDate,
      time: selectedTime,
      fee: `$${selectedDoctor.fee}`,
      reason,
      status: 'upcoming',
      avatar: selectedDoctor.avatar,
    };

    const updated = [newAppointment, ...appointments];
    setAppointments(updated);
    saveAppointments(updated);

    setBooked(true);
    addNotification('success', 'Appointment Booked!', `Your appointment with ${selectedDoctor.name} on ${newAppointment.date} at ${selectedTime} has been confirmed.`);

    setTimeout(() => {
      setBooked(false);
      setView('search');
      setActiveTab('upcoming');
      setSelectedDoctor(null);
      setSelectedTime('');
      setReason('');
    }, 3000);
  };

  const cancelAppointment = (id) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    saveAppointments(updated);
    addNotification('info', 'Appointment Cancelled', 'Your appointment has been cancelled.');
  };

  const upcomingApts = appointments.filter(a => a.status === 'upcoming');
  const pastApts = appointments.filter(a => a.status === 'completed');

  // Video Call Screen
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
          <h1 className="uc-page-title">Appointments & Consultation</h1>
          <p className="text-on-surface-variant">Find a doctor, book appointments, and consult with healthcare professionals.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-xl p-1 w-fit mb-6">
        {[
          { key: 'find', label: 'Find a Doctor' },
          { key: 'upcoming', label: `Upcoming (${upcomingApts.length})` },
          { key: 'past', label: 'Past' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); if (tab.key === 'find') setView('search'); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key ? 'bg-white dark:bg-dark-surface shadow-sm text-on-surface' : 'text-on-surface-variant'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== FIND A DOCTOR TAB ===== */}
      {activeTab === 'find' && (
        <>
          {/* Consult CTA Banner */}
          <div className="rounded-xl bg-gradient-to-r from-primary-500 to-blue-400 p-6 text-white mb-6 relative overflow-hidden stagger-item">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <span className="inline-flex items-center gap-1.5 text-xs bg-green-500/30 text-green-100 px-2.5 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Physicians Online Now
            </span>
            <h2 className="text-xl font-bold mb-1 relative z-10">Find the Right Doctor</h2>
            <p className="text-white/80 max-w-md text-sm relative z-10">Search by specialty, date, and location to find available doctors with their pricing and timings.</p>
          </div>

          {/* SEARCH VIEW */}
          {view === 'search' && (
            <div className="uc-card animate-fade-in stagger-item">
              <div className="flex items-center gap-2 mb-6">
                <Search className="w-5 h-5 text-primary-500" />
                <h3 className="text-lg font-bold text-on-surface dark:text-dark-on-surface">What are you looking for?</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Specialty */}
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">Doctor Specialty</label>
                  <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} className="uc-input">
                    <option value="">All Specialties</option>
                    {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">Preferred Date</label>
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} className="uc-input" />
                </div>
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">Location</label>
                  <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="uc-input">
                    {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSearch} className="uc-btn-primary">
                <Search className="w-4 h-4" /> Search Doctors
              </button>
            </div>
          )}

          {/* RESULTS VIEW */}
          {view === 'results' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setView('search')} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="font-bold text-on-surface dark:text-dark-on-surface">
                    {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? 's' : ''} Found
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {selectedSpecialty || 'All specialties'} • {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {selectedLocation}
                  </p>
                </div>
              </div>

              {filteredDoctors.length === 0 ? (
                <div className="uc-card text-center py-12">
                  <Stethoscope className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
                  <p className="font-medium text-on-surface-variant">No doctors found matching your criteria.</p>
                  <button onClick={() => setView('search')} className="uc-btn-secondary text-sm mt-4">
                    <ArrowLeft className="w-4 h-4" /> Modify Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDoctors.map((doc) => (
                    <div key={doc.id} className="uc-card hover:shadow-card-hover transition-all cursor-pointer stagger-item"
                      onClick={() => handleSelectDoctor(doc)}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xl shrink-0">
                          {doc.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-on-surface dark:text-dark-on-surface">{doc.name}</h3>
                          <p className="text-xs text-on-surface-variant">{doc.specialty} • {doc.experience}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-semibold">{doc.rating}</span>
                            <span className="text-xs text-on-surface-variant">({doc.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{doc.location.split(',')[0]}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${doc.fee}/visit</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {doc.timings.slice(0, 4).map((t) => (
                          <span key={t} className="text-[10px] px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium">{t}</span>
                        ))}
                        {doc.timings.length > 4 && (
                          <span className="text-[10px] px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant font-medium">+{doc.timings.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DOCTOR DETAIL VIEW */}
          {view === 'detail' && selectedDoctor && (
            <div className="animate-fade-in">
              <button onClick={() => setView('results')} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to results
              </button>

              {booked ? (
                <div className="uc-card text-center py-12 animate-scale-in">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">Appointment Confirmed!</h3>
                  <p className="text-on-surface-variant mt-1">ID: UC-{Math.floor(1000 + Math.random() * 9000)}</p>
                  <p className="text-sm text-on-surface-variant mt-2">You'll receive a reminder 1 hour before.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Doctor Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="uc-card">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl shrink-0">
                          {selectedDoctor.avatar}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-on-surface dark:text-dark-on-surface">{selectedDoctor.name}</h2>
                          <p className="text-sm text-on-surface-variant">{selectedDoctor.specialty}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="text-sm font-bold">{selectedDoctor.rating}</span>
                            </div>
                            <span className="text-xs text-on-surface-variant">({selectedDoctor.reviews} reviews)</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Available</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {[
                          { label: 'Experience', value: selectedDoctor.experience, icon: '🏥' },
                          { label: 'Fee', value: `$${selectedDoctor.fee}`, icon: '💰' },
                          { label: 'Education', value: selectedDoctor.education?.split(' - ')[0], icon: '🎓' },
                          { label: 'Languages', value: selectedDoctor.languages.join(', '), icon: '🌐' },
                        ].map((item, i) => (
                          <div key={i} className="p-3 rounded-xl bg-surface-container-low dark:bg-dark-surface-container">
                            <p className="text-lg mb-1">{item.icon}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase font-semibold">{item.label}</p>
                            <p className="text-sm font-medium text-on-surface dark:text-dark-on-surface mt-0.5">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2">About</h4>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{selectedDoctor.about}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedDoctor.location}</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-3">
                      <button onClick={() => setShowVideoCall(true)} className="uc-btn-primary text-sm flex-1">
                        <Video className="w-4 h-4" /> Video Consult
                      </button>
                      <button className="uc-btn-secondary text-sm flex-1">
                        <MessageSquare className="w-4 h-4" /> Chat Now
                      </button>
                    </div>
                  </div>

                  {/* Booking Sidebar */}
                  <div className="space-y-4">
                    <div className="uc-card">
                      <h4 className="font-bold text-sm mb-3">Select Time Slot</h4>
                      <p className="text-xs text-on-surface-variant mb-3">
                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {selectedDoctor.timings.map((t) => (
                          <button key={t} onClick={() => setSelectedTime(t)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                              selectedTime === t
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-surface-container-low dark:bg-dark-surface-container text-on-surface-variant hover:bg-primary-50 dark:hover:bg-primary-900/20'
                            }`}>
                            {t}
                          </button>
                        ))}
                      </div>

                      <div className="mb-4">
                        <label className="block text-xs font-medium mb-1.5">Reason (optional)</label>
                        <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                          placeholder="Describe your reason..." className="uc-input h-20 resize-none text-sm" />
                      </div>

                      <div className="bg-surface-container-low dark:bg-dark-surface-container rounded-xl p-4 mb-4">
                        <h5 className="text-xs font-semibold text-on-surface-variant uppercase mb-2">Summary</h5>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between"><span className="text-on-surface-variant">Doctor</span><span className="font-medium">{selectedDoctor.name}</span></div>
                          <div className="flex justify-between"><span className="text-on-surface-variant">Date</span><span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span></div>
                          <div className="flex justify-between"><span className="text-on-surface-variant">Time</span><span className="font-medium">{selectedTime || '—'}</span></div>
                          <div className="flex justify-between border-t border-outline-variant/10 pt-1.5 mt-1.5">
                            <span className="text-on-surface-variant font-medium">Fee</span>
                            <span className="font-bold text-primary-500">${selectedDoctor.fee}</span>
                          </div>
                        </div>
                      </div>

                      <button onClick={handleBook} disabled={!selectedTime}
                        className="uc-btn-primary w-full disabled:opacity-50">
                        <Check className="w-4 h-4" /> Confirm Booking
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ===== UPCOMING APPOINTMENTS TAB ===== */}
      {activeTab === 'upcoming' && (
        <div className="space-y-3">
          {upcomingApts.length === 0 ? (
            <div className="text-center py-12 uc-card">
              <CalendarIcon className="w-8 h-8 text-on-surface-variant/50 mx-auto mb-3" />
              <p className="text-on-surface-variant font-medium">No upcoming appointments.</p>
              <button onClick={() => { setActiveTab('find'); setView('search'); }} className="uc-btn-primary text-sm mt-4">
                <Plus className="w-4 h-4" /> Book an Appointment
              </button>
            </div>
          ) : (
            upcomingApts.map((apt) => (
              <div key={apt.id} className="uc-card flex items-center gap-4 stagger-item">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 text-xl">
                  {apt.avatar || '👨‍⚕️'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-on-surface dark:text-dark-on-surface">{apt.doctor}</h3>
                  <p className="text-xs text-on-surface-variant">{apt.specialty} • {apt.date} at {apt.time}</p>
                  {apt.location && <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{apt.location.split(',')[0]}</p>}
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">{apt.fee}</span>
                <button onClick={() => cancelAppointment(apt.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50 shrink-0" title="Cancel">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ===== PAST APPOINTMENTS TAB ===== */}
      {activeTab === 'past' && (
        <div className="space-y-3">
          {pastApts.length === 0 ? (
            <div className="text-center py-12 uc-card">
              <CalendarIcon className="w-8 h-8 text-on-surface-variant/50 mx-auto mb-3" />
              <p className="text-on-surface-variant font-medium">No past appointments.</p>
            </div>
          ) : (
            pastApts.map((apt) => (
              <div key={apt.id} className="uc-card flex items-center gap-4 stagger-item opacity-80">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-xl">
                  {apt.avatar || '👨‍⚕️'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-on-surface dark:text-dark-on-surface">{apt.doctor}</h3>
                  <p className="text-xs text-on-surface-variant">{apt.specialty} • {apt.date} at {apt.time}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">Completed</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
