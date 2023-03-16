'use client';

import React from 'react';

export default function link({ link, name }: any) {
  return <a href={link}>{name}</a>;
}
