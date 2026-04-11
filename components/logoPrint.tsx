'use client';

import React from 'react';
import { cvHeaderIconBtn } from '@/lib/cv-header-toolbar';

interface LogoPrintProps {
  onClick: () => void;
  /** Par défaut : libellé générique impression / PDF. */
  title?: string;
  'aria-label'?: string;
}

export default function LogoPrint({
  onClick,
  title = 'Imprimer / Exporter en PDF',
  'aria-label': ariaLabel = 'Imprimer ou exporter en PDF',
}: LogoPrintProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cvHeaderIconBtn.print}
      title={title}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[var(--cv-toolbar-icon)] w-[var(--cv-toolbar-icon)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
        />
      </svg>
    </button>
  );
}
