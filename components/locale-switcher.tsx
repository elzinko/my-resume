'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { i18n } from '../i18n-config'

export default function LocaleSwitcher(lang: any) {

  const pathName = usePathname()
  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    return segments.join('/')
  }
  
  let textBoldClass = 'visible';

  return (
      <ul className="flex flex-wrap justify-start gap-2 align-middle">
        {
        i18n.locales.map((locale) => {
          let textBoldClass = '';
          if (locale === lang.lang.locale) {
            textBoldClass = 'font-bold';
          }
            return (
                <li className={textBoldClass} key={locale}>
                  <Link href={redirectedPathName(locale)}>{locale}</Link>
                </li>
              )
          } 
        )}
      </ul>
  )
}