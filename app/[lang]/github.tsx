import { getCvData } from '@/lib/cv-data';
import { i18n } from '../../i18n-config';
import React from 'react';

export default async function Github() {
  const data: any = await getCvData(i18n.defaultLocale);
  return (
    <>
      <strong className="text-xl font-medium">Github</strong>
      <a href={data.github?.url}>
        <ul className="mb-10 mt-4 flex w-full">
          <li className="mt-4 w-3/12 rounded-bl-lg rounded-tl-lg bg-pink-600 px-2 text-center text-white">
            BACK
          </li>
          <li className="mt-4 w-3/12 bg-blue-400 px-2 text-center text-white">
            FRONT
          </li>
          <li className="mt-4 w-3/12 rounded-br-lg rounded-tr-lg bg-yellow-500 px-2 text-center text-white">
            DEVOPS
          </li>
        </ul>
      </a>
    </>
  );
}
