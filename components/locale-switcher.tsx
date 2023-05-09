'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n } from '../i18n-config';

export default function LocaleSwitcher(lang: any) {
  const pathName = usePathname();
  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
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
