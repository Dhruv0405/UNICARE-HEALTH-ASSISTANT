import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useNotificationStore } from '../../store/notificationStore';
import { MessageSquare, Star, Send, Check, ChevronRight, Loader2 } from 'lucide-react';

const categories = ['Bug Report', 'Feature Request', 'General Feedback'];

// EmailJS Configuration — Update these in your .env file
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_unicare';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_feedback';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
const FEEDBACK_EMAIL = 'kakkardhruv85@gmail.com';

const mockFeedback = [
  { id: 1, rating: 5, category: 'General Feedback', message: 'Love the AI assistant feature! Very helpful for quick health questions.', date: 'May 15, 2026' },
  { id: 2, rating: 4, category: 'Feature Request', message: 'Would be great to have integration with wearable devices like Apple Watch.', date: 'May 10, 2026' },
];

export default function FeedbackPage() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('submit');
  const [feedbackList, setFeedbackList] = useState(mockFeedback);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add to local feedback list
    const newFeedback = {
      id: Date.now(),
      rating,
      category,
      message,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setFeedbackList((prev) => [newFeedback, ...prev]);

    setSending(true);

    // Try to send via EmailJS
    try {
      const templateParams = {
        title: `UNICARE Feedback - ${category}`, // Maps to {{title}} in Subject
        name: name || 'UNICARE User',            // Maps to {{name}}
        email: email || 'no-reply@unicare.app',  // Maps to {{email}} in Reply To
        from_name: name || 'UNICARE User',       // Maps to {{from_name}}
        from_email: email || 'no-reply@unicare.app', // Maps to {{from_email}}
        to_email: FEEDBACK_EMAIL,
        time: new Date().toLocaleTimeString(),   // Maps to {{time}}
        date: new Date().toLocaleDateString(),   // Maps to {{date}}
        category: category,                      // Maps to {{category}}
        rating: `${rating}/5 — ${['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}`, // Maps to {{rating}}
        message: message,                        // Maps to {{message}}
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      addNotification('success', 'Feedback Sent!', 'Your feedback has been emailed successfully. Thank you!');
    } catch (error) {
      console.warn('[UNICARE Feedback] EmailJS failed:', error);
      // Fallback: still save locally and notify
      addNotification('info', 'Feedback Saved Locally',
        'Could not send email (EmailJS not configured), but your feedback has been recorded. Configure EmailJS in FeedbackPage.jsx to enable email delivery.');
    }

    setSending(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setCategory('');
      setMessage('');
      setName('');
      setEmail('');
    }, 3000);
  };

  return (
    <div className="uc-page">
      <div className="mb-8">
        <h1 className="uc-page-title">Feedback</h1>
        <p className="text-on-surface-variant">Help us improve UNICARE with your feedback.</p>
      </div>

      <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-xl p-1 w-fit mb-6">
        {['submit', 'history'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-white dark:bg-dark-surface shadow-sm text-on-surface' : 'text-on-surface-variant'}`}>
            {tab === 'submit' ? 'Submit Feedback' : 'Past Feedback'}
          </button>
        ))}
      </div>

      {activeTab === 'submit' ? (
        <div className="max-w-2xl">
          {submitted ? (
            <div className="uc-card text-center py-12 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-on-surface dark:text-dark-on-surface mb-2">Thank You!</h2>
              <p className="text-on-surface-variant">Your feedback helps us make UNICARE better for everyone.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="uc-card space-y-6">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-3">How would you rate UNICARE?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button key={i} type="button" onClick={() => setRating(i)} onMouseEnter={() => setHoverRating(i)} onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 active:scale-95">
                      <Star className={`w-10 h-10 transition-colors ${i <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                {rating > 0 && <p className="text-sm text-on-surface-variant mt-2">{['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">Category</label>
                <div className="flex gap-2">
                  {categories.map(cat => (
                    <button key={cat} type="button" onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === cat ? 'bg-primary-500 text-white shadow-md' : 'bg-surface-container dark:bg-dark-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email for EmailJS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="feedback-name" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">Your Name (optional)</label>
                  <input id="feedback-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" className="uc-input" />
                </div>
                <div>
                  <label htmlFor="feedback-email" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">Your Email (optional)</label>
                  <input id="feedback-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" className="uc-input" />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="feedback-msg" className="block text-sm font-medium text-on-surface dark:text-dark-on-surface mb-2">Your Message</label>
                <textarea id="feedback-msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you think..."
                  className="uc-input h-32 resize-none" required />
              </div>

              <button type="submit" disabled={!rating || !category || !message.trim() || sending} className="uc-btn-primary w-full disabled:opacity-50">
                {sending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4" /> Submit Feedback</>
                )}
              </button>

              <p className="text-[10px] text-on-surface-variant text-center">
                Your feedback will be sent to the UNICARE team at {FEEDBACK_EMAIL}
              </p>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {feedbackList.map(fb => (
            <div key={fb.id} className="uc-card stagger-item">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-on-surface-variant">{fb.date}</span>
              </div>
              <span className="text-xs font-semibold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-full">{fb.category}</span>
              <p className="text-sm text-on-surface dark:text-dark-on-surface mt-2">{fb.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
