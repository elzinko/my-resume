'use client';

import React from 'react';
import formatDate from 'intl-dateformat';
import formatDates from '@/lib/date';

export default function project({ project }: any) {
  const dates = formatDates(project.startDate, project.endDate);
  return (
    <>
      <div className="my-1 flex justify-between">
        <strong>
          <a href={project.link ? project.link : '#'}>
            {project.name ? project.name : null}
            {project.client ? <span> - </span> : null}
            {project.client ? project.client : ''}
            {project.location ? <span> - </span> : null}
            {project.location ? project.location : ''}
          </a>
        </strong>
        <strong>
          <span className="text-sx flex flex-wrap justify-end">{dates}</span>
        </strong>
      </div>
      <ul className="mb-4 flex">
        {project?.tags?.map((tag: any) => (
          <li key={tag.id}>
            <span className="mr-1 rounded bg-blue-400 px-2 py-1 text-sm text-white">
              {tag.name}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs">{project?.description}</p>
      <ul className="mx-4 my-2 list-disc text-xs">
        {project?.bullets?.map((bullet: any) => (
          <li key={bullet.id}>{bullet.text}</li>
        ))}
      </ul>
      <p className="mt-4 flex flex-wrap gap-x-2 gap-y-2 whitespace-nowrap py-2">
        {project?.frameworks?.map((framework: any) => (
          <span
            key={framework.id}
            className="rounded bg-gray-400 px-2 py-1 text-xs text-white"
          >
            {framework.name.toLowerCase()}
          </span>
        ))}
      </p>
    </>
  );
}
