'use client';

import { useCvMode } from './CvModeContext';

interface CvModeToggleProps {
  labels?: {
    full: string;
    compact: string;
  };
}

export default function CvModeToggle({ 
  labels = { full: 'Version complète', compact: 'CV 1 page' } 
}: CvModeToggleProps) {
  const { mode, toggleMode } = useCvMode();

  return (
    <button
      onClick={toggleMode}
      className="hidden items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-blue-700 md:flex print:hidden"
      title={mode === 'full' ? labels.compact : labels.full}
    >
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {mode === 'full' ? (
          // Compress icon - file/document
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        ) : (
          // Expand icon - grid/full view
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        )}
      </svg>
      <span>{mode === 'full' ? labels.compact : labels.full}</span>
    </button>
  );
}
