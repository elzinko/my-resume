'use client';

import React from 'react';
import formatDates from '@/lib/date';

export default function job({ job: job }: any) {
  const dates = formatDates(job.startDate, job.endDate);
  return (
    <div id={job.id}>
      <div className="flex justify-between">
        <strong className="text-sky-300">{job.client}</strong>
        <small className="min-w-max text-sky-300">{dates}</small>
      </div>
      <p className="flex justify-between pb-2">
        <small className="text-teal-300">{job.role?.name}</small>
        <small className="text-fuchsia-300">{job.location}</small>
      </p>
      <p className="text-justify text-xs">{job.description}</p>
      {job?.bullets?.length > 0 ? (
        <ul className="mx-4 my-2 list-disc text-xs">
          {job?.bullets?.map((bullet: any) => (
            <li key={bullet.id}>{bullet.text}</li>
          ))}
        </ul>
      ) : (
        ''
      )}

      {job?.frameworks?.length > 0 ? (
        <p className="flex flex-wrap gap-x-2 gap-y-2 whitespace-nowrap py-2">
          {job?.frameworks?.map((framework: any) => (
            <span
              key={framework.id}
              className="rounded bg-fuchsia-200 px-2 py-1 text-xs text-white"
            >
              {framework.name.toLowerCase()}
            </span>
          ))}
        </p>
      ) : (
        ''
      )}
    </div>
  );
}
