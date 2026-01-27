'use client';

import CompactCvLayout, { CompactCvData } from './CompactCvLayout';

interface PrintCompactVersionProps {
  data: CompactCvData;
  lang: 'fr' | 'en';
}

export default function PrintCompactVersion({ data, lang }: PrintCompactVersionProps) {
  return (
    <div className="print-compact-version hidden">
      <CompactCvLayout data={data} lang={lang} />
    </div>
  );
}
