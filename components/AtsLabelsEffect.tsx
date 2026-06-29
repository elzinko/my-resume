'use client';

import { useEffect } from 'react';

/**
 * Affiche/masque les libellés ATS anglais (« Summary », « Work Experience »…).
 *
 * Par DÉFAUT ils sont masqués (`.cv-ats-label { display: none }` dans globals.css)
 * — web ET PDF. Avec `?ats=1` (ou `?ats`), on pose `.cv-show-ats` sur `<html>` →
 * les libellés réapparaissent (web ET PDF, pour cibler un ATS anglo-saxon).
 *
 * Suppression PROPRE (display:none, pas « invisible mais présent ») : un texte
 * caché-mais-extractible est un red flag pour les parseurs ATS.
 */
export default function AtsLabelsEffect() {
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const show =
      sp.has('ats') && ['', '1', 'true'].includes(sp.get('ats') ?? '');
    document.documentElement.classList.toggle('cv-show-ats', show);
    return () => document.documentElement.classList.remove('cv-show-ats');
  }, []);

  return null;
}
