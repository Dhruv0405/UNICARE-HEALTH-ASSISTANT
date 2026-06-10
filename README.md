# UNICARE — The Future of Personal Healthcare Management

> **Your Complete Wellness Companion: Where Advanced AI Meets Comprehensive Health Management**

## 🎯 The Pitch

**UNICARE** is a revolutionary, all-in-one desktop healthcare platform designed for the modern individual who refuses to compromise on their health. In an era where healthcare is fragmented across multiple apps, paper records, and scattered consultations, UNICARE delivers a unified, intelligent, and privacy-first solution that puts total control of your wellness journey back in your hands.

### Why UNICARE?

**The Problem:**
- Users juggle multiple disconnected healthcare apps
- Medical records scattered across different providers
- No intelligent support for health decision-making
- Privacy concerns with cloud-based health data
- Lack of holistic wellness tracking

**Our Solution:**
UNICARE eliminates this chaos. By combining clinical-grade health monitoring, AI-powered insights, secure local storage, and seamless appointment management—all in one beautiful, intuitive desktop application—we empower users to achieve unprecedented control over their health.

---

## ✨ Key Features & Capabilities

UNICARE offers a comprehensive suite of interconnected modules designed for holistic health management:

| Feature | Benefit |
|---------|---------|
| **🏥 Unified Dashboard** | Real-time overview of health status, upcoming activities, and actionable insights at a glance |
| **📊 Advanced Health Monitoring** | Track vital signs, metrics, and wellness data over time with rich, interactive visualizations |
| **🔒 Secure Medical Records** | Encrypted local vault for storing medical history, lab results, and personal documents—under your control |
| **💊 Medication Management** | Intelligent tracking of prescriptions with adherence monitoring and reminders |
| **📅 Appointment Scheduling** | Seamless management and tracking of medical consultations and healthcare provider interactions |
| **🥗 Diet & Fitness Integration** | Comprehensive nutritional and activity logging with personalized recommendations |
| **🤖 AI Health Assistant** | Google Generative AI-powered chatbot providing personalized wellness advice and health guidance |
| **🎯 Goal Tracking** | Define, monitor, and achieve personal health and wellness objectives with progress visualization |
| **🛒 Wellness E-Store** | Built-in marketplace for purchasing supplements, health products, and wellness services |
| **🔔 Intelligent Reminders** | Native desktop notifications for hydration, medication, and wellness activities |

---

## 🏗️ Technology Stack

UNICARE is built on a modern, battle-tested technology foundation designed for performance, security, and scalability:

### Frontend & User Experience
* **React 18** — Dynamic, component-based UI for responsive and performant interfaces
* **Vite** — Lightning-fast development and optimized production builds
* **Tailwind CSS** — Beautiful, responsive design with clinical-grade color schemes
* **Lucide React** — Professional icon library for intuitive visual communication
* **Zustand** — Lightweight, efficient state management
* **React Router v6** — Seamless navigation across healthcare modules
* **Recharts** — Interactive data visualizations for health metrics and trends

### Backend & Infrastructure
* **Electron** — Cross-platform desktop application with native OS integration
* **Firebase** — Secure authentication with enterprise-grade security protocols
* **SQL.js (SQLite)** — Robust, offline-capable local data storage (no cloud dependency)
* **Google Generative AI** — Advanced LLM integration for intelligent health insights
* **Tailwind CSS + Clinical Design System** — Healthcare-compliant UI/UX

---

## 🛠️ Getting Started — Setup on Your Computer

Follow these steps to run UNICARE locally on your machine.

### Prerequisites

Make sure you have the following installed before you begin:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | v9 or higher *(comes with Node.js)* | — |
| **Git** | Any recent version | [git-scm.com](https://git-scm.com/) |

### 1. Clone the Repository

```bash
git clone https://github.com/Dhruv0405/UNICARE-HEALTH-ASSISTANT.git
cd UNICARE-HEALTH-ASSISTANT
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your API keys:

```bash
# On Windows
copy .env.example .env

# On macOS/Linux
cp .env.example .env
```

Then open `.env` in any text editor and add your keys:

```env
# Google Gemini API Key — required for AI chat & voice features
# Get yours free at: https://aistudio.google.com/apikey
VITE_GOOGLE_API_KEY=your-google-api-key-here

# OpenRouter API Key — required for diet & records AI features
# Get yours at: https://openrouter.ai/keys
VITE_OPENROUTER_API_KEY=your-openrouter-api-key-here

# Firebase Configuration — required for user authentication
# Create a project at: https://console.firebase.google.com
# Then go to Project Settings → General → Your Apps → Web App → Config
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

> **⚠️ Important:** Never commit your `.env` file to Git. It is already listed in `.gitignore` to keep your keys safe.

### 4. Run the App

#### Option A — Web Browser (Fastest, for development)
```bash
npm run dev
```
Then open [http://localhost:5173](http://localhost:5173) in your browser.

#### Option B — Electron Desktop App
```bash
npm run electron:dev
```
This launches UNICARE as a native desktop application.

### 5. Build for Production (Optional)

To create a distributable desktop installer:
```bash
npm run electron:build
```
The output will be in the `dist-electron/` folder.

---

## 🔑 Getting Your API Keys

### Google Gemini API Key
1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key and paste it as `VITE_GOOGLE_API_KEY` in your `.env`

### OpenRouter API Key
1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Create a free account
3. Click **Create Key**
4. Copy the key and paste it as `VITE_OPENROUTER_API_KEY` in your `.env`

### Firebase Configuration
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** and follow the setup wizard
3. Go to **Project Settings → General → Your Apps**
4. Click the **Web** icon (`</>`) to add a web app
5. Copy the config values into your `.env` file
6. In the Firebase console, enable **Authentication → Sign-in method → Email/Password**

---

## 🎨 Design Philosophy

UNICARE follows a **Clinical Clarity** design system featuring:
- Clean, professional aesthetics inspired by medical interfaces
- Accessibility-first design ensuring usability for all users
- Intuitive information architecture reducing cognitive load
- Trust-building visual language using medical-grade color palettes

---

## 🚀 Unique Value Propositions

1. **Privacy-First Architecture** — All sensitive health data stays local on your machine
2. **AI-Enhanced Health Insights** — Leverage cutting-edge LLM technology for personalized advice
3. **Offline Capability** — Works completely offline; syncs when connected
4. **Unified Ecosystem** — No more app-hopping; everything in one place
5. **Professional-Grade** — Built with modern web technologies, not a web wrapper

---

## 📈 Use Cases

- **Personal Health Management:** Track daily health metrics and trends independently
- **Chronic Disease Management:** Monitor medications, appointments, and health goals in one place
- **Fitness & Wellness Enthusiasts:** Integrated diet and fitness tracking with AI recommendations
- **Healthcare Coordination:** Organize medical consultations and records efficiently
- **Preventative Care:** Goal-setting and wellness tracking for proactive health management

---

## Summary

UNICARE represents the next generation of personal health management—combining the power of artificial intelligence with the security of local-first design. By unifying health monitoring, medical records, AI-powered guidance, and wellness tracking into one elegant platform, UNICARE empowers individuals to take charge of their health with confidence, privacy, and intelligence.

**The future of healthcare is here. It's called UNICARE.**
