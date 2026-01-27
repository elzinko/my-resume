'use client';

import React from 'react';
import formatDates from '@/lib/date';

export default function job({ job: job }: any) {
  const dates = formatDates(job.startDate, job.endDate);
  return (
    <div id={job.id}>
      <div className="flex justify-between">
        <small className="font-bold text-sky-300">{job.client}</small>
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
        <p className="flex flex-wrap gap-1.5 py-2 md:gap-2">
          {job?.frameworks?.map((framework: any) => (
            <span
              key={framework.id}
              className="whitespace-nowrap rounded bg-fuchsia-200 px-1.5 py-0.5 text-[10px] text-white md:px-2 md:py-1 md:text-xs"
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
