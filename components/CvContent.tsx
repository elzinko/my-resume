'use client';

import { useCvMode } from './CvModeContext';
import CompactCvLayout, { CompactCvData } from './CompactCvLayout';
import { ReactNode, useEffect, useState } from 'react';

interface CvContentProps {
  children: ReactNode;
  compactData: CompactCvData;
  lang: 'fr' | 'en';
}

export default function CvContent({ children, compactData, lang }: CvContentProps) {
  const { isCompact } = useCvMode();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile, always show full version (toggle is hidden on mobile)
  // Compact mode only works on desktop
  if (isCompact && !isMobile) {
    return <CompactCvLayout data={compactData} lang={lang} />;
  }

  return <>{children}</>;
}
