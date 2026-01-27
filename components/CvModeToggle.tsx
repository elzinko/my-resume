'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CvModeToggleProps {
  labels?: {
    full: string;
    compact: string;
  };
}

export default function CvModeToggle({ 
  labels = { full: 'Version complète', compact: 'Version courte' } 
}: CvModeToggleProps) {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const isShortMode = pathname?.includes('/short');
  
  const targetUrl = isShortMode ? `/${lang}` : `/${lang}/short`;
  const label = isShortMode ? labels.full : labels.compact;

  return (
    <Link
      href={targetUrl}
      className="flex items-center gap-1 rounded bg-blue-600 p-2 text-sm font-medium text-white transition-all hover:bg-blue-700 md:gap-2 md:px-3 md:py-1.5 print:hidden"
      title={label}
    >
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {!isShortMode ? (
          // Document icon for compact mode
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        ) : (
          // Grid icon for full view
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        )}
      </svg>
      {/* Label hidden on mobile, visible on desktop */}
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}
