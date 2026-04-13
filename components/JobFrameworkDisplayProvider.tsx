'use client';

import React, { createContext, useContext, type ReactNode } from 'react';

const JobFrameworkDisplayContext = createContext<string[]>([]);

export function useJobFrameworkPriorityTokens(): string[] {
  return useContext(JobFrameworkDisplayContext);
}

export default function JobFrameworkDisplayProvider({
  priorityTokens,
  children,
}: {
  priorityTokens: string[];
  children: ReactNode;
}) {
  return (
    <JobFrameworkDisplayContext.Provider value={priorityTokens}>
      {children}
    </JobFrameworkDisplayContext.Provider>
  );
}
