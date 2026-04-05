'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import TechMatchDisplay from '@/components/TechMatchDisplay';
import {
  buildMatchEntries,
  type JobForMatching,
} from '@/lib/tech-match-core';
import { resolveOfferFromUrlParams } from '@/lib/query-offer-params';
import { decodeOfferSpecParam } from '@/lib/dynamic-offer-spec';
import type { Locale } from 'i18n-config';

type Mode = 'query-first' | 'spec-only';

function MatchOfferInner({
  jobs,
  lang,
  mode,
}: {
  jobs: JobForMatching[];
  lang: Locale;
  mode: Mode;
}) {
  const sp = useSearchParams();

  const offer = useMemo(() => {
    if (mode === 'spec-only') {
      return decodeOfferSpecParam(sp.get('spec'));
    }
    return resolveOfferFromUrlParams(sp);
  }, [sp, mode]);

  const matchData = useMemo(() => {
    if (!offer) return null;
    return { entries: buildMatchEntries(offer.requirements, jobs) };
  }, [offer, jobs]);

  const l = lang === 'en' ? 'en' : 'fr';

  const hasSpec = Boolean(sp.get('spec')?.trim());
  const hasCompany = Boolean(sp.get('company')?.trim());
  const hasReqParams =
    sp.getAll('requirement').length > 0 || sp.getAll('req').length > 0;
  const hasAnyInput =
    mode === 'spec-only'
      ? hasSpec
      : hasSpec || hasCompany || hasReqParams;

  if (!hasAnyInput) {
    return (
      <section
        className="mt-10 rounded-lg border border-amber-200 bg-amber-50/90 p-4 text-sm leading-relaxed text-amber-950"
        data-testid="match-offer-empty"
      >
        {mode === 'spec-only' ? (
          <>
            <p className="font-semibold">
              {l === 'fr'
                ? 'Paramètre d’offre manquant'
                : 'Missing offer parameter'}
            </p>
            <p className="mt-2">
              {l === 'fr'
                ? 'Ajoutez un JSON encodé en base64url :'
                : 'Add base64url-encoded JSON:'}
            </p>
            <code className="mt-2 block break-all rounded bg-white/80 px-2 py-1 text-xs">
              /{lang}/offer/custom?spec=&lt;base64url&gt;
            </code>
          </>
        ) : (
          <>
            <p className="font-semibold">
              {l === 'fr' ? 'Paramètres manquants' : 'Missing parameters'}
            </p>
            <p className="mt-2">
              {l === 'fr'
                ? 'Utilisez des paramètres GET lisibles, par exemple :'
                : 'Use readable GET parameters, for example:'}
            </p>
            <code className="mt-2 block break-all rounded bg-white/80 px-2 py-1 text-xs">
              {l === 'fr'
                ? `/${lang}/offer/match?company=Safran&title=Chef+Java&requirement=Java:java,spring&requirement=SQL:postgresql`
                : `/${lang}/offer/match?company=Acme&title=Engineer&requirement=Java:java,spring&requirement=SQL:postgresql`}
            </code>
            <ul className="mt-3 list-inside list-disc text-xs opacity-95">
              <li>
                <strong>company</strong> —{' '}
                {l === 'fr' ? 'obligatoire' : 'required'}
              </li>
              <li>
                <strong>title</strong> —{' '}
                {l === 'fr'
                  ? 'optionnel (sinon = company) ; title_fr / title_en pour préciser'
                  : 'optional (defaults to company); title_fr / title_en to split locales'}
              </li>
              <li>
                <strong>requirement</strong> —{' '}
                {l === 'fr'
                  ? 'répétable : Libellé:mot1,mot2 (alias : req)'
                  : 'repeat per line: Label:kw1,kw2 (alias: req)'}
              </li>
              <li>
                {l === 'fr'
                  ? 'Option avancée : spec=… (base64 JSON) prend le pas sur les autres paramètres.'
                  : 'Advanced: spec=… (base64 JSON) overrides other params when valid.'}
              </li>
            </ul>
          </>
        )}
      </section>
    );
  }

  if (!offer || !matchData) {
    return (
      <section
        className="mt-10 rounded-lg border border-red-200 bg-red-50/90 p-4 text-sm text-red-950"
        data-testid="match-offer-invalid"
      >
        <p className="font-semibold">
          {l === 'fr' ? 'Offre invalide' : 'Invalid offer'}
        </p>
        <p className="mt-2 text-xs">
          {mode === 'spec-only'
            ? l === 'fr'
              ? 'Vérifiez le paramètre spec (JSON base64url).'
              : 'Check the spec parameter (base64url JSON).'
            : l === 'fr'
              ? 'Vérifiez company, au moins une requirement (Libellé:mots-clés), et optionnellement spec.'
              : 'Check company, at least one requirement (Label:keywords), and optional spec.'}
        </p>
      </section>
    );
  }

  return <TechMatchDisplay data={matchData} lang={l} />;
}

export default function MatchOfferClient({
  jobs,
  lang,
  mode,
}: {
  jobs: JobForMatching[];
  lang: Locale;
  mode: Mode;
}) {
  return (
    <Suspense
      fallback={
        <p className="mt-10 text-sm text-slate-600">
          {lang === 'en' ? 'Loading…' : 'Chargement…'}
        </p>
      }
    >
      <MatchOfferInner jobs={jobs} lang={lang} mode={mode} />
    </Suspense>
  );
}
