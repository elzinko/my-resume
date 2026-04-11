import React from 'react';

/**
 * Pastille niveau sous le texte du profil (même rythme que les vignettes sous les domaines).
 */
export default function ProfileEducationBadge({
  label,
  className = '',
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`cv-pill-domain cv-profile-education-badge inline-flex max-w-[min(100%,20rem)] shrink-0 items-center justify-center whitespace-normal break-words px-2 py-0.5 text-center text-xs font-medium leading-snug print-preview:hidden md:max-w-none md:whitespace-nowrap md:break-normal md:px-2.5 md:py-1 md:text-sm print:hidden ${className}`}
    >
      {label}
    </span>
  );
}
