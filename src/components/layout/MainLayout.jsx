import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import FloatingChatButton from '../common/FloatingChatButton';
import ProfileSetupModal from '../common/ProfileSetupModal';
import GlobalVoiceAssistant from '../common/GlobalVoiceAssistant';
import NotificationToast from '../common/NotificationToast';

export default function MainLayout() {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-surface dark:bg-dark-surface">
      {/* Skip to content link (accessibility) */}
      <a href="#main-content" className="sr-skip-link">
        Skip to content
      </a>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <TopBar />

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto bg-surface dark:bg-dark-surface"
          role="main"
        >
          <Outlet />
        </main>
      </div>

      {/* Floating AI Chat Button */}
      <FloatingChatButton />

      {/* Profile Setup Modal — shown for new/incomplete profiles */}
      <ProfileSetupModal />

      {/* Global "Hey UNICARE" Voice Assistant */}
      <GlobalVoiceAssistant />

      {/* Global Toast Notifications */}
      <NotificationToast />
    </div>
  );
}
