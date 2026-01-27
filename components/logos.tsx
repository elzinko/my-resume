'use client';

import { useState, useCallback } from 'react';
import LogoLinkedin from './LogoLinkedin';
import LogoGithub from './logoGithub';
import LogoMalt from './logoMalt';
import LogoPdf from './logoPdf';

export default function Logos() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePdfExport = useCallback(async () => {
    setIsGeneratingPdf(true);

    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;

      // Get the main content element
      const element = document.querySelector('main');
      if (!element) {
        console.error('Main element not found');
        return;
      }

      // Clone the element to apply PDF-specific styles
      const clone = element.cloneNode(true) as HTMLElement;

      // Remove the locale switcher and social icons from the PDF
      const headerNav = clone.querySelector('header > div:first-child');
      if (headerNav) {
        headerNav.remove();
      }

      // Create a temporary container
      const container = document.createElement('div');
      container.appendChild(clone);
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm'; // A4 width
      document.body.appendChild(container);

      // Configure html2pdf options for high quality single page
      const opt = {
        margin: [5, 8, 5, 8] as [number, number, number, number], // top, right, bottom, left in mm
        filename: 'Thomas_Couderc_CV.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait' as const,
        },
        pagebreak: { mode: 'avoid-all' },
      };

      await html2pdf().set(opt).from(clone).save();

      // Cleanup
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, []);

  return (
    <ul className="flex flex-wrap justify-end gap-2 print:hidden">
      <li>
        <LogoLinkedin />
      </li>
      <li>
        <LogoGithub />
      </li>
      <li>
        <LogoMalt />
      </li>
      <li>
        <LogoPdf onClick={handlePdfExport} isLoading={isGeneratingPdf} />
      </li>
    </ul>
  );
}