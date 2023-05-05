'use client'

import LogoLinkedin from "./LogoLinkedin"
import LogoGithub from "./logoGithub"
import LogoMalt from "./logoMalt"


export default function Logos() {
  return (
    <ul className="flex flex-wrap justify-end gap-2">
    <li>
      <LogoLinkedin />
    </li>
    <li>
      <LogoGithub />
    </li>
    <li>
      <LogoMalt />
    </li>
  </ul>
  )
}