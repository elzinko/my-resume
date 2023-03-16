import React from 'react';
import Experience from './experience';

export default function experiences() {
  return (
    <>
      <section id="work experiences">
        <h2 className="mt-12 border-b pb-1 text-2xl font-semibold">
          Work Experiences
        </h2>
        <ul className="mt-2">
          <li className="pt-2">
            <Experience />
          </li>
        </ul>
      </section>
    </>
  );
}
