'use client';

import React from 'react';
import formatDates from '@/lib/date';

export default function job({ job: job }: any) {
  const dates = formatDates(job.startDate, job.endDate);
  return (
    <>
      <p className="flex justify-between text-sm">
        <strong className="text-base">{job.client}</strong>
        <strong className="text-xs">{dates}</strong>
      </p>
      <p className="flex justify-between pb-2 text-base">
        {job.role?.name}
        <small>{job.location}</small>
      </p>
      <p className="text-justify text-xs">{job.description}</p>
      <ul className="mx-4 my-2 list-disc text-xs">
        {job?.bullets?.map((bullet: any) => (
          <li key={bullet.id}>{bullet.text}</li>
        ))}
      </ul>

      <p className="mt-4 flex flex-wrap gap-x-2 gap-y-2 whitespace-nowrap py-2">
        {job?.frameworks?.map((framework: any) => (
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
