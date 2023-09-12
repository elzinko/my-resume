'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n } from '../i18n-config';
import path from 'path';

export default function LocaleSwitcher(lang: any) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  let pathName = usePathname();

  console.log('LS : basePath : ' + basePath);
  console.log('LS : pathName before cleaning : ' + pathName);

  // remove basePath from pathName if it exists
  if (basePath != '') {
    pathName = pathName.replace(basePath, '');
  }
  console.log('LS : pathName after cleaning : ' + pathName);

  const redirectedPathName = (locale: string) => {
    if (!pathName) {
      console.log('LS : no path => return / ');
      return '/';
    }
    const segments = pathName.split('/');
    segments[1] = locale;
    const newPathName = segments.join('/');
    console.log('LS : has path => new path = ' + newPathName);
    return newPathName;
  };

  return (
    <ul className="flex flex-wrap justify-end gap-2">
      {i18n.locales.map((locale) => {
        let textBoldClass = 'py-2 inline-block align-baseline';
        if (locale === lang.lang.locale) {
          textBoldClass += ' text-blue-500 font-bold';
        } else {
          textBoldClass += ' text-gray-300';
        }
        return (
          <li className={textBoldClass} key={locale}>
            <Link className="py-2" href={redirectedPathName(locale)}>
              {locale}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
