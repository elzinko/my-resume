'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '../i18n-config';

/**
 * Macaron flottant (écran uniquement) invitant le visiteur à générer une version
 * du CV adaptée à SON offre via un LLM. Pointe vers la page publique `/{lang}/ai`.
 *
 * - **Autonome** : rendu une seule fois dans `app/[lang]/layout.tsx`, en `position: fixed`
 *   → hors du flux DOM du CV, aucun impact possible sur les 4 rendus (invariant WYSIWYG).
 * - **Masqué à l'impression ET en aperçu** (`print:hidden` + `print-preview:hidden`) :
 *   un bouton cliquable n'a aucun sens sur un PDF (règle « pas de print orphelin »).
 * - **Coin bas-droit** : le curseur de zoom (`CvZoomSlider`) occupe déjà le haut-droit sur
 *   `/short` (desktop) → on ne se marche pas dessus.
 * - **Caché sur `/{lang}/ai`** (auto-référence) **et sur `/{lang}/dev/*`** (outils internes).
 */
export default function AiTailorMacaron({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  if (pathname?.endsWith('/ai') || pathname?.includes('/dev/')) return null;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const label =
    lang === 'fr'
      ? 'Adapter ce CV à votre offre'
      : 'Tailor this CV to your job';
  const title =
    lang === 'fr'
      ? 'Générez une version de ce CV taillée pour votre poste, avec une IA'
      : 'Generate a version of this CV tailored to your role, with an AI';

  return (
    <a
      href={`${basePath}/${lang}/ai`}
      title={title}
      data-testid="ai-tailor-macaron"
      className="group fixed bottom-4 right-4 z-[110] inline-flex items-center gap-2 rounded-full border border-cv-section/40 bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-lg backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-cv-section hover:text-cv-section hover:shadow-xl print-preview:hidden supports-[backdrop-filter]:bg-white/75 print:hidden md:px-4 md:text-sm"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-4 w-4 text-cv-section transition-transform duration-200 group-hover:rotate-12"
      >
        <path d="M12 2l1.85 5.15L19 9l-5.15 1.85L12 16l-1.85-5.15L5 9l5.15-1.85L12 2z" />
        <path
          d="M19 13.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z"
          opacity="0.6"
        />
      </svg>
      <span>{label}</span>
    </a>
  );
}
