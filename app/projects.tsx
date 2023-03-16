import Project from '@/components/project';
import React from 'react';

export default function projects() {
  return (
    <>
      <section id="projects">
        <h2 className="border-b pb-1 text-2xl font-semibold">Projects</h2>
        <ul className="mt-1">
          <li className="py-2">
            <Project />
          </li>
        </ul>
      </section>
    </>
  );
}
