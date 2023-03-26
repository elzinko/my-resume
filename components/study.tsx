'use client';

import React from 'react';

export default function study({ study }: any) {
  return (
    <>
      <p className="flex justify-between">
        <strong className="text-base text-teal-200">{study.name}</strong>
        <small className="text-gray-500">{study.location}</small>
      </p>
      <p className=" flex justify-between text-sm text-gray-500">
        {study.establishment}
      </p>
    </>
  );
}
