'use client';

import LogoLinkedin from './LogoLinkedin';
import LogoGithub from './logoGithub';
import LogoMalt from './logoMalt';
import LogoPrint from './logoPrint';
import CvModeToggle from './CvModeToggle';

export default function Logos() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 print:hidden">
      <CvModeToggle 
        labels={{ 
          full: 'Version complète', 
          compact: 'Version courte' 
        }} 
      />
      <ul className="flex flex-wrap gap-2">
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
          <LogoPrint onClick={handlePrint} />
        </li>
      </ul>
    </div>
  );
}