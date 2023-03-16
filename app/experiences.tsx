import Experience from '@/components/experience';
import React from 'react';

export default function experiences() {
  return (
    <>
      <section id="work experiences" className="mt-10">
        <h2 className="mt-12 border-b pb-1 text-2xl font-semibold">
          Work Experiences
        </h2>
        <ul className="mt-2">
          <li className="py-2">
            <Experience />
          </li>
        </ul>
      </section>
    </>
  );
}
