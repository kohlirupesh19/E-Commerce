import React from 'react';
import brandLogo from '../../pics/logo/image.png';

type BrandMarkProps = {
  className?: string;
  alt?: string;
  decorative?: boolean;
  loading?: 'eager' | 'lazy';
};

export default function BrandMark({
  className = 'h-10 w-10 rounded-xl',
  alt = 'The Obsidian Curator logo',
  decorative = true,
  loading = 'lazy'
}: BrandMarkProps) {
  const resolvedAlt = decorative ? '' : alt;

  return (
    <img
      src={brandLogo}
      alt={resolvedAlt}
      aria-hidden={decorative ? true : undefined}
      className={`object-cover ${className}`}
      loading={loading}
      decoding="async"
    />
  );
}