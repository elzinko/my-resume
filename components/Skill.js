'use client'

import React from 'react'

export default function Skill({skill}) {
  return (
    <div class="w-1/3 pr-4">
        <h2 class="text-2xl pb-1 border-b font-semibold text-justify">
            {skill.skillTitle}
        </h2>
        {skill.skillDescription}
    </div>   
  )
}
