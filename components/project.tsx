'use client';

import React from 'react';
import formatDates from '@/lib/date';

export default function project({ project }: any) {
  const dates = formatDates(project.startDate, project.endDate);
  return (
    <section id="projects">
      <div className="flex justify-between">
        <strong className="text-blue-300">
          <a href={project.link ? project.link : '#'}>
            {project.name ? project.name : null}
            {project.client ? <span> - </span> : null}
            {project.client ? project.client : ''}
            {project.location ? <span> - </span> : null}
            {project.location ? project.location : ''}
          </a>
        </strong>
        <small className="text-gray-500">{dates}</small>
      </div>

      <p className="text-xs">{project?.description}</p>
      {project?.bullets?.length > 0 ? (
        <ul className="mx-4 my-2 list-disc text-xs">
          {project?.bullets?.map((bullet: any) => (
            <li key={bullet.id}>{bullet.text}</li>
          ))}
        </ul>
      ) : (
        ''
      )}

      {project?.frameworks?.length > 0 ? (
        <p className="flex flex-wrap gap-x-2 gap-y-2 whitespace-nowrap py-2">
          {project?.frameworks?.map((framework: any) => (
            <span
              key={framework.id}
              className="rounded bg-blue-200 px-2 py-1 text-xs text-white"
            >
              {framework.name.toLowerCase()}
            </span>
          ))}
        </p>
      ) : (
        ''
      )}
    </section>
  );
}
