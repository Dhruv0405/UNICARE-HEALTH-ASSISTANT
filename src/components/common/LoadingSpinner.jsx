import React from 'react';

export default function LoadingSpinner({ fullPage = false, size = 'md', text = '' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${fullPage ? 'min-h-[60vh]' : ''}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-primary-500/30 border-t-primary-500 animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-sm text-on-surface-variant animate-pulse">{text}</p>}
    </div>
  );

  return spinner;
}
