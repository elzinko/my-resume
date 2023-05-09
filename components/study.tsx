'use client';

import React from 'react';

export default function study({ study }: any) {
  return (
    <>
      <p className="flex justify-between">
        <strong className="text-base text-teal-300">{study.name}</strong>
      </p>
      <p className=" flex text-sm text-gray-300">
        <small>
          {study.location} / {study.establishment}
        </small>
      </p>
    </>
  );
}
