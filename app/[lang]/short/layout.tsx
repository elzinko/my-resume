import React from 'react';

/**
 * Wrapper dédié au CV court : ciblage CSS print (`cv-short-page`, `@page short`)
 * pour tenir sur une page A4 sans impacter le CV complet.
 */
export default function ShortCvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="cv-short-page">{children}</div>;
}
