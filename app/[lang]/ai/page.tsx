import type { Metadata } from 'next';
import { Locale } from '../../../i18n-config';
import CopyPromptButton from '@/components/CopyPromptButton';

/** URL publique canonique du CV (identique au guide `/api/llm-guide`). */
const SITE = 'https://www.elzinko.fr';

/** Prompt prêt-à-coller dans ChatGPT / Claude / etc. (une version par langue). */
function buildPrompt(lang: Locale): string {
  if (lang === 'fr') {
    return `Tu es un assistant qui personnalise un CV en ligne à partir d'une offre d'emploi.

Le CV de Thomas Couderc est public et dynamique :
- Guide complet (endpoints + paramètres d'URL) : ${SITE}/api/llm-guide
- Données structurées JSON : ${SITE}/api/profile?lang=fr

Voici l'offre à laquelle je réponds :
"""
[COLLEZ ICI L'OFFRE D'EMPLOI]
"""

À partir de cette offre :
1. Lis le guide et les données ci-dessus.
2. Construis l'URL du CV adaptée, de la forme :
   ${SITE}/fr?company=<entreprise>&title=<intitulé>&requirement=<Libellé:mots-clés>
   – répète le paramètre requirement pour chaque compétence clé, les plus importantes en premier ;
   – ajoute contract=cdi pour un poste permanent (freelance par défaut).
3. Donne-moi : l'URL du CV complet, l'URL du CV court (…/fr/short?…), et un court paragraphe d'adéquation au poste.`;
  }
  return `You are an assistant that tailors an online CV to a job posting.

Thomas Couderc's CV is public and dynamic:
- Full guide (endpoints + URL parameters): ${SITE}/api/llm-guide
- Structured JSON data: ${SITE}/api/profile?lang=en

Here is the job posting I'm applying to:
"""
[PASTE THE JOB POSTING HERE]
"""

From this posting:
1. Read the guide and data above.
2. Build the tailored CV URL, shaped like:
   ${SITE}/en?company=<company>&title=<title>&requirement=<Label:keywords>
   – repeat the requirement parameter for each key skill, most important first;
   – add contract=cdi for a permanent role (freelance by default).
3. Give me: the full CV URL, the short CV URL (…/en/short?…), and a short fit paragraph.`;
}

const COPY = {
  fr: {
    title: 'Générez ce CV pour votre poste',
    lead: 'Ce CV est dynamique : un assistant IA peut en produire une version taillée pour VOTRE offre, en quelques secondes. Aucune inscription, tout est public.',
    stepsTitle: 'Comment faire',
    steps: [
      'Copiez le prompt ci-dessous.',
      'Collez-le dans ChatGPT, Claude ou l’assistant de votre choix, avec le texte de votre offre d’emploi.',
      'L’assistant vous renvoie un lien vers ce CV, adapté au poste (compétences mises en avant, expériences pertinentes en tête).',
    ],
    promptTitle: 'Le prompt',
    copyIdle: 'Copier le prompt',
    copyDone: 'Copié !',
    guideNote: 'Pour les curieux et les agents : ',
    guideLink: 'guide technique complet',
    guideAria: 'Guide technique complet (Markdown)',
    back: '← Revenir au CV',
  },
  en: {
    title: 'Generate this CV for your role',
    lead: 'This CV is dynamic: an AI assistant can produce a version tailored to YOUR job posting in seconds. No sign-up, everything is public.',
    stepsTitle: 'How it works',
    steps: [
      'Copy the prompt below.',
      'Paste it into ChatGPT, Claude or the assistant of your choice, along with your job posting.',
      'The assistant returns a link to this CV, tailored to the role (relevant skills and experiences brought to the front).',
    ],
    promptTitle: 'The prompt',
    copyIdle: 'Copy the prompt',
    copyDone: 'Copied!',
    guideNote: 'For the curious and for agents: ',
    guideLink: 'full technical guide',
    guideAria: 'Full technical guide (Markdown)',
    back: '← Back to the CV',
  },
} as const;

export function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locale };
}): Metadata {
  const t = COPY[lang] ?? COPY.fr;
  return {
    title: t.title,
    description: t.lead,
  };
}

export default function AiTailorPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const t = COPY[lang] ?? COPY.fr;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const prompt = buildPrompt(lang);

  return (
    <div className="mx-auto max-w-3xl max-md:pt-12">
      <a
        href={`${basePath}/${lang}`}
        className="text-sm text-cv-section underline-offset-2 hover:underline"
      >
        {t.back}
      </a>

      <header className="mt-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-cv-section/40 bg-cv-section/5 px-3 py-1 text-xs font-medium text-cv-section">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="h-3.5 w-3.5"
          >
            <path d="M12 2l1.85 5.15L19 9l-5.15 1.85L12 16l-1.85-5.15L5 9l5.15-1.85L12 2z" />
          </svg>
          {lang === 'fr' ? 'CV adaptable par IA' : 'AI-tailorable CV'}
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          {t.title}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">
          {t.lead}
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t.stepsTitle}
        </h2>
        <ol className="mt-3 space-y-3">
          {t.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cv-section text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5 text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <div className="mb-2 flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t.promptTitle}
          </h2>
          <CopyPromptButton
            text={prompt}
            idleLabel={t.copyIdle}
            doneLabel={t.copyDone}
          />
        </div>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-[0.8rem] leading-relaxed text-slate-800">
          {prompt}
        </pre>
      </section>

      <p className="mt-6 text-sm text-slate-500">
        {t.guideNote}
        <a
          href={`${basePath}/api/llm-guide`}
          aria-label={t.guideAria}
          className="text-cv-section underline underline-offset-2 hover:text-teal-600"
        >
          {t.guideLink}
        </a>
        .
      </p>
    </div>
  );
}
