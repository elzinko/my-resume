import type { Locale } from '../i18n-config';

const fillClass = 'block h-full w-full shrink-0' as const;

/**
 * Drapeaux vectoriels plats ; remplissent le carré parent (preserveAspectRatio slice).
 */
export default function LocaleTargetFlag({ locale }: { locale: Locale }) {
  if (locale === 'fr') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 3 2"
        preserveAspectRatio="xMidYMid slice"
        className={`${fillClass} [shape-rendering:crispEdges]`}
        aria-hidden
      >
        <rect width="1" height="2" fill="#002395" />
        <rect x="1" width="1" height="2" fill="#fff" />
        <rect x="2" width="1" height="2" fill="#E1000F" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      className={fillClass}
      aria-hidden
    >
      <path fill="#012169" d="M0 0h60v30H0z" />
      <path stroke="#fff" strokeWidth="6" d="M0 0l60 30M60 0L0 30" />
      <path stroke="#C8102E" strokeWidth="4" d="M0 0l60 30M60 0L0 30" />
      <path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60" />
      <path stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60" />
    </svg>
  );
}
