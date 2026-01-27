'use client';

import { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import LogoLinkedin from './LogoLinkedin';
import LogoGithub from './logoGithub';
import LogoMalt from './logoMalt';
import LogoPdf from './logoPdf';
import PdfCvLayout, { PdfCvData } from './pdf/PdfCvLayout';
import {
  extractCvDataFromPage,
  getCurrentLang,
} from './pdf/pdfExportService';

export default function Logos() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePdfExport = useCallback(async () => {
    setIsGeneratingPdf(true);

    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;

      // Extract data from current page
      const cvData = extractCvDataFromPage();
      const lang = getCurrentLang();

      // Create a temporary container for PDF rendering
      const container = document.createElement('div');
      container.id = 'pdf-render-container';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      // Render the PDF layout
      const root = createRoot(container);
      root.render(<PdfCvLayout data={cvData} lang={lang} />);

      // Wait for render to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get the rendered element
      const pdfElement = document.getElementById('pdf-cv-layout');
      if (!pdfElement) {
        console.error('PDF layout element not found');
        return;
      }

      // Configure html2pdf options for high quality single page
      const opt = {
        margin: [0, 0, 0, 0] as [number, number, number, number],
        filename: 'Thomas_Couderc_CV.pdf',
        image: { type: 'jpeg' as const, quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          windowWidth: 794, // A4 width in pixels at 96 DPI
        },
        jsPDF: {
          unit: 'px',
          format: [794, 1123] as [number, number], // A4 in pixels at 96 DPI
          orientation: 'portrait' as const,
          hotfixes: ['px_scaling'],
        },
        pagebreak: { mode: 'avoid-all' },
      };

      await html2pdf().set(opt).from(pdfElement).save();

      // Cleanup
      root.unmount();
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