'use client';

import { useCallback, useState } from 'react';

/**
 * Bouton « copier le prompt » : copie `text` dans le presse-papier et affiche un
 * retour transitoire (« Copié ! ») pendant ~2 s. Autonome, sans dépendance.
 */
export default function CopyPromptButton({
  text,
  idleLabel,
  doneLabel,
}: {
  text: string;
  idleLabel: string;
  doneLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Presse-papier indisponible (contexte non sécurisé / permission) : on
      // sélectionne le texte en repli pour un copier manuel.
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      onClick={copy}
      data-testid="copy-prompt"
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-lg bg-cv-section px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cv-section focus-visible:ring-offset-2"
    >
      {copied ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span>{copied ? doneLabel : idleLabel}</span>
    </button>
  );
}
