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

      <ul className="my-4 flex">
        {job?.frameworks?.map((framework: any) => (
          <li key={framework.id}>
            <span className="mt-2 mr-1 flex flex-wrap gap-x-2 gap-y-2 whitespace-nowrap rounded bg-blue-400 px-2 py-1 text-xs text-white">
              {framework.name}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
