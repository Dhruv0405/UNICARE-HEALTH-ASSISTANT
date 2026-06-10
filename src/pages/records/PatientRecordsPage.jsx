import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { ClipboardList, Plus, Search, Upload, FileText, Download, Edit2, Trash2, Eye, ChevronRight, X, Loader2, Camera, Check } from 'lucide-react';

// NVIDIA Nemotron Vision API config
const NVIDIA_API_KEY = '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';
const NVIDIA_MODEL = 'nvidia/llama-3.2-nv-embedqa-1b-v2';

async function analyzeImageWithNemotron(base64Data, mimeType = 'image/jpeg') {
  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nvidia/llama-3.2-nv-embedqa-1b-v2',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'You are a medical report analyzer. Analyze this medical document/image. Extract all text, key findings, test results, diagnoses, and important values. Format your response as:\n\n**Document Type:** (e.g., Blood Test, X-Ray, Prescription, etc.)\n\n**Key Findings:**\n- List all important findings\n\n**Test Results:**\n- List test names and their values\n\n**Summary:**\nBrief summary of the document.\n\nIf this is not a medical document, describe what you see in the image.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 1024,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Could not analyze the document.';
  } catch (error) {
    console.error('[Nemotron] Analysis failed:', error);
    // Fallback: try with openrouter as backup
    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'UNICARE',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'You are a medical report analyzer. Analyze this medical document/image. Extract all text, key findings, test results, diagnoses, and important values. Format your response as:\n\n**Document Type:** (e.g., Blood Test, X-Ray, Prescription, etc.)\n\n**Key Findings:**\n- List all important findings\n\n**Test Results:**\n- List test names and their values\n\n**Summary:**\nBrief summary of the document.\n\nIf this is not a medical document, describe what you see in the image.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1024,
        }),
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Could not analyze the document.';
    } catch (fallbackError) {
      throw new Error('Both primary and fallback analysis failed. Please try again.');
    }
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Load reports from localStorage
function loadReports() {
  try {
    return JSON.parse(localStorage.getItem('unicare_reports') || '[]');
  } catch { return []; }
}

function saveReports(reports) {
  localStorage.setItem('unicare_reports', JSON.stringify(reports));
}

const defaultMockHistory = [
  { id: 1, condition: 'Hypertension', date: 'Mar 15, 2026', doctor: 'Dr. Emily Chen', notes: 'Started on Lisinopril 10mg', status: 'active' },
  { id: 2, condition: 'Type 2 Diabetes', date: 'Jan 20, 2026', doctor: 'Dr. Michael Park', notes: 'Metformin prescribed, A1C: 6.8%', status: 'active' },
  { id: 3, condition: 'Seasonal Allergies', date: 'Sep 05, 2025', doctor: 'Dr. Lisa Thompson', notes: 'Cetirizine as needed', status: 'resolved' },
];

export default function PatientRecordsPage() {
  const user = useAuthStore((s) => s.user);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');

  // Reports state
  const [reports, setReports] = useState(() => {
    const saved = loadReports();
    return saved.length > 0 ? saved : [
      { id: '1', name: 'Comprehensive Blood Panel', type: 'Lab Results', date: 'Oct 12, 2023', icon: '🔬', color: 'bg-red-50 text-red-600', analysis: null },
      { id: '2', name: 'Physician Notes: Annual Check...', type: 'Dr. Emily Chen', date: 'Sep 05, 2023', icon: '📋', color: 'bg-green-50 text-green-600', analysis: null },
      { id: '3', name: 'Chest X-Ray Report', type: 'Imaging', date: 'Aug 22, 2023', icon: '🫁', color: 'bg-orange-50 text-orange-600', analysis: null },
    ];
  });

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState('Lab Results');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  // View report modal
  const [viewingReport, setViewingReport] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    setUploadName(file.name.replace(/\.[^/.]+$/, ''));

    // Generate preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setUploadPreview(null); // PDF — no preview image
    }
  };

  const handleAnalyze = async () => {
    if (!uploadFile) return;
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      let base64;
      let mimeType = uploadFile.type;

      if (uploadFile.type.startsWith('image/')) {
        base64 = await fileToBase64(uploadFile);
      } else if (uploadFile.type === 'application/pdf') {
        // For PDF, we'll send a text prompt asking to describe it
        // In production, you'd use a PDF-to-image converter
        base64 = await fileToBase64(uploadFile);
        mimeType = 'application/pdf';
      } else {
        throw new Error('Unsupported file type. Please upload an image or PDF.');
      }

      const result = await analyzeImageWithNemotron(base64, mimeType);
      setAnalysisResult(result);
    } catch (error) {
      setAnalysisResult(`Analysis failed: ${error.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveReport = () => {
    const typeIcons = {
      'Lab Results': { icon: '🔬', color: 'bg-red-50 text-red-600' },
      'Imaging': { icon: '🫁', color: 'bg-orange-50 text-orange-600' },
      'Prescription': { icon: '💊', color: 'bg-blue-50 text-blue-600' },
      'Doctor Notes': { icon: '📋', color: 'bg-green-50 text-green-600' },
      'Other': { icon: '📄', color: 'bg-purple-50 text-purple-600' },
    };

    const { icon, color } = typeIcons[uploadType] || typeIcons['Other'];
    const newReport = {
      id: Date.now().toString(),
      name: uploadName || 'Untitled Report',
      type: uploadType,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon,
      color,
      analysis: analysisResult,
      preview: uploadPreview,
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    saveReports(updated);

    // Reset modal
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadPreview(null);
    setUploadName('');
    setAnalysisResult(null);

    addNotification('success', 'Report Uploaded', `"${newReport.name}" has been saved to your records.`);
  };

  const handleDeleteReport = (id) => {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    saveReports(updated);
    addNotification('info', 'Report Deleted', 'The report has been removed from your records.');
  };

  return (
    <div className="uc-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="uc-page-title">Patient Records</h1>
          <p className="text-on-surface-variant">Manage your health records and medical history.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-xl p-1 w-fit mb-6">
        {['profile', 'history', 'reports'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
              activeTab === tab ? 'bg-white dark:bg-dark-surface shadow-sm text-on-surface' : 'text-on-surface-variant'
            }`}>
            {tab === 'history' ? 'Medical History' : tab === 'reports' ? 'Test Reports' : 'Profile'}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="uc-card stagger-item">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-500">{user?.name?.split(' ').map(n => n[0]).join('') || 'SJ'}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface dark:text-dark-on-surface">{user?.name || 'Sarah Jenkins'}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700 mt-1">ID: UC-8492</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Blood Type', value: user?.blood_group || 'A+' },
                { label: 'Age / Sex', value: `34 / ${user?.gender?.[0] || 'F'}` },
                { label: 'Height', value: `${user?.height || 165} cm` },
                { label: 'Weight', value: `${user?.weight || 68.2} kg` },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl border border-outline-variant/20 dark:border-dark-surface-container-high/50">
                  <p className="text-xs text-on-surface-variant">{item.label}</p>
                  <p className="text-lg font-bold text-on-surface dark:text-dark-on-surface mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl border border-outline-variant/20 dark:border-dark-surface-container-high/50">
              <p className="text-xs text-on-surface-variant">Primary Physician</p>
              <p className="font-semibold text-on-surface dark:text-dark-on-surface mt-0.5">Dr. Emily Chen, MD</p>
            </div>
            <div className="mt-4 p-3 rounded-xl border border-outline-variant/20 dark:border-dark-surface-container-high/50">
              <p className="text-xs text-on-surface-variant">Emergency Contact</p>
              <p className="font-semibold text-on-surface dark:text-dark-on-surface mt-0.5">{user?.emergency_contact || '+1-555-0123'}</p>
            </div>
          </div>
          <div className="uc-card stagger-item">
            <h3 className="font-bold text-on-surface dark:text-dark-on-surface mb-4">Allergies & Conditions</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Penicillin', 'Shellfish', 'Latex'].map((a) => (
                <span key={a} className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">{a}</span>
              ))}
            </div>
            <h3 className="font-bold text-on-surface dark:text-dark-on-surface mb-4">Active Conditions</h3>
            <div className="space-y-2">
              {defaultMockHistory.filter(h => h.status === 'active').map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low dark:bg-dark-surface-container">
                  <span className="text-sm font-medium text-on-surface dark:text-dark-on-surface">{h.condition}</span>
                  <span className="uc-badge-warning text-[10px]">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Medical History Tab */}
      {activeTab === 'history' && (
        <div>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by condition..."
                className="uc-input pl-10" />
            </div>
            <button className="uc-btn-primary text-sm"><Plus className="w-4 h-4" /> Add Entry</button>
          </div>
          <div className="space-y-3">
            {defaultMockHistory.map((h) => (
              <div key={h.id} className="uc-card flex items-center gap-4 stagger-item">
                <div className="flex-1">
                  <h3 className="font-semibold text-on-surface dark:text-dark-on-surface">{h.condition}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{h.doctor} • {h.date}</p>
                  {h.notes && <p className="text-xs text-on-surface-variant mt-0.5">{h.notes}</p>}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${h.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {h.status}
                </span>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container"><Edit2 className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Reports Tab */}
      {activeTab === 'reports' && (
        <div>
          <div className="flex gap-3 mb-4">
            <button onClick={() => setShowUploadModal(true)} className="uc-btn-primary text-sm"><Upload className="w-4 h-4" /> Upload Report</button>
            <button className="uc-btn-secondary text-sm"><Download className="w-4 h-4" /> Export as PDF</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((r) => (
              <div key={r.id} className="uc-card flex items-start gap-3 hover:shadow-card-hover cursor-pointer transition-shadow stagger-item">
                <div className={`w-10 h-10 rounded-xl ${r.color} flex items-center justify-center shrink-0 text-lg`}>{r.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-on-surface dark:text-dark-on-surface truncate">{r.name}</h3>
                  <p className="text-xs text-on-surface-variant">{r.type} • {r.date}</p>
                  {r.analysis && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full mt-1">
                      <Check className="w-2.5 h-2.5" /> AI Analyzed
                    </span>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setViewingReport(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteReport(r.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Report Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 max-w-lg w-full mx-4 shadow-modal max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}
            style={{ animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-bold text-on-surface dark:text-dark-on-surface">Upload Report</h2>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* File Picker */}
            {!uploadFile ? (
              <div
                className="border-2 border-dashed border-outline-variant/40 rounded-xl p-10 text-center hover:border-primary-300 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-12 h-12 text-on-surface-variant mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Click to upload a report</p>
                <p className="text-xs text-on-surface-variant">Supports JPG, PNG, PDF</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preview */}
                {uploadPreview && (
                  <div className="rounded-xl overflow-hidden border border-outline-variant/20">
                    <img src={uploadPreview} alt="Report preview" className="w-full h-48 object-cover" />
                  </div>
                )}
                {!uploadPreview && uploadFile && (
                  <div className="rounded-xl border border-outline-variant/20 p-6 text-center bg-surface-container-low dark:bg-dark-surface-container">
                    <FileText className="w-10 h-10 text-on-surface-variant mx-auto mb-2" />
                    <p className="text-sm font-medium">{uploadFile.name}</p>
                    <p className="text-xs text-on-surface-variant">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                )}

                {/* Report Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Report Name</label>
                  <input
                    type="text"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    placeholder="e.g., Blood Test Results"
                    className="uc-input"
                  />
                </div>

                {/* Report Type */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Report Type</label>
                  <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="uc-input">
                    {['Lab Results', 'Imaging', 'Prescription', 'Doctor Notes', 'Other'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="uc-btn-secondary w-full text-sm disabled:opacity-50"
                >
                  {analyzing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI...</>
                  ) : (
                    <><Eye className="w-4 h-4" /> Analyze with AI</>
                  )}
                </button>

                {/* Analysis Result */}
                {analysisResult && (
                  <div className="rounded-xl bg-surface-container-low dark:bg-dark-surface-container p-4 max-h-60 overflow-y-auto animate-slide-up">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <h4 className="text-sm font-semibold text-on-surface dark:text-dark-on-surface">AI Analysis Result</h4>
                    </div>
                    <div className="text-xs text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                      {analysisResult}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => { setUploadFile(null); setUploadPreview(null); setAnalysisResult(null); }}
                    className="uc-btn-secondary flex-1 text-sm"
                  >
                    Change File
                  </button>
                  <button onClick={handleSaveReport} className="uc-btn-primary flex-1 text-sm">
                    <Check className="w-4 h-4" /> Save Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewingReport(null)}>
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 max-w-lg w-full mx-4 shadow-modal max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}
            style={{ animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${viewingReport.color} flex items-center justify-center text-lg`}>{viewingReport.icon}</div>
                <div>
                  <h2 className="font-bold text-on-surface dark:text-dark-on-surface">{viewingReport.name}</h2>
                  <p className="text-xs text-on-surface-variant">{viewingReport.type} • {viewingReport.date}</p>
                </div>
              </div>
              <button onClick={() => setViewingReport(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewingReport.preview && (
              <div className="rounded-xl overflow-hidden border border-outline-variant/20 mb-4">
                <img src={viewingReport.preview} alt="Report" className="w-full object-contain max-h-64" />
              </div>
            )}

            {viewingReport.analysis ? (
              <div className="rounded-xl bg-surface-container-low dark:bg-dark-surface-container p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <h4 className="text-sm font-semibold">AI Analysis</h4>
                </div>
                <div className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                  {viewingReport.analysis}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-on-surface-variant">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No AI analysis available for this report.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
