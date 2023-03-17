'use client';

import React from 'react';
import formatDate from 'intl-dateformat';

export default function project({ project }: any) {
  const startDate = project.startDate
    ? formatDate(new Date(project.startDate), 'MM / YYYY')
    : null;
  const endDate = project.endDate
    ? formatDate(new Date(project.endDate), 'MM / YYYY')
    : null;

  const dates =
    startDate && endDate
      ? startDate + ' - ' + endDate
      : project.endDate
      ? endDate
      : null;

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
          <span className="flex flex-wrap justify-end text-sm">{dates}</span>
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
      <p className="mt-2 flex flex-wrap gap-x-2 gap-y-2 whitespace-nowrap py-2">
        {project?.frameworks?.map((framework: any) => (
          <span
            key={framework.id}
            className="rounded bg-gray-400 px-2 py-1 text-xs text-white"
          >
            {framework.name}
          </span>
        ))}
      </p>
    </>
  );
}
