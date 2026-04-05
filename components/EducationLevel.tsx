'use client';

import React from 'react';
import { educationLevel, EducationLevelLang } from '@/data/education-level';

interface EducationLevelProps {
  lang: EducationLevelLang;
  compact?: boolean;
}

export default function EducationLevel({ lang, compact = false }: EducationLevelProps) {
  const t = educationLevel[lang];

  if (compact) {
    return (
      <section className="mb-6 print:mb-4">
        <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300 print:text-sm">
          {t.title}
        </h2>
        <div className="mt-2 print:mt-1">
          <span className="inline-block rounded bg-teal-300 px-2 py-0.5 text-xs font-bold text-gray-900 print:text-[10px]">
            Bac+5
          </span>
          <p className="mt-1 text-xs text-teal-300 print:text-[10px]">{t.diploma}</p>
          <p className="text-[10px] text-gray-400 print:text-[8px]">{t.additionalTraining}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="education-level" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
        {t.title}
      </h2>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-block rounded bg-teal-300 px-2.5 py-1 text-sm font-bold text-gray-900">
            Bac+5
          </span>
          <span className="text-sm text-gray-400">{t.effectiveLevelDetail}</span>
        </div>
        <div>
          <p className="text-sm text-teal-300">{t.diploma}</p>
          <p className="text-xs text-gray-400">{t.diplomaDetail}</p>
        </div>
        <p className="text-sm text-teal-300">{t.additionalTraining}</p>
      </div>
    </section>
  );
}
