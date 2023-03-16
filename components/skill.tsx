'use client';

import React from 'react';

export default function skill({ framework: skill }: any) {
  return <a href={skill?.link}>{skill?.name}</a>;
}
