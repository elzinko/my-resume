'use client';

import React from 'react';

export default function study({ study }: any) {
  return (
    <>
      <p className="flex justify-between text-sm">
        <strong className="text-base">{study.name}</strong>
        {/* <strong>
          {study.startDate.getFullYear()}-{study.endDate.getFullYear()}
        </strong> */}
      </p>
      <p className="flex justify-between text-sm">
        {study.location}
        <small>{study.establishment}</small>
      </p>
    </>
  );
}
