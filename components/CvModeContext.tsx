'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type CvMode = 'full' | 'compact';

interface CvModeContextType {
  mode: CvMode;
  toggleMode: () => void;
  isCompact: boolean;
}

const CvModeContext = createContext<CvModeContextType | undefined>(undefined);

export function CvModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<CvMode>('full');

  const toggleMode = () => {
    setMode((prev) => (prev === 'full' ? 'compact' : 'full'));
  };

  return (
    <CvModeContext.Provider value={{ mode, toggleMode, isCompact: mode === 'compact' }}>
      {children}
    </CvModeContext.Provider>
  );
}

export function useCvMode() {
  const context = useContext(CvModeContext);
  if (context === undefined) {
    throw new Error('useCvMode must be used within a CvModeProvider');
  }
  return context;
}
