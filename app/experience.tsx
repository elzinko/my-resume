import React from 'react';

export default function experience() {
  return (
    <>
      <p className="flex justify-between pb-2 text-sm">
        <strong className="text-base">DGFIP</strong>
        <strong>10/2008 - 04/2010</strong>
      </p>
      <p className="flex justify-between text-base">
        Ingénieur Etudes et développement<small>Noisy-le-Grand</small>
      </p>
      <p className="text-justify text-xs">description</p>
      <ul className="mx-4 list-disc text-xs">
        <li>text 1</li>
        <li>text 2</li>
      </ul>
      <ul className="my-4 flex">
        <li className="mr-1 rounded bg-blue-600 px-2 py-1 text-xs text-white">
          J2EE 5
        </li>
      </ul>
    </>
  );
}
