import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(clsx('animate-pulse rounded-md bg-gray-200/80', className))}
    />
  );
}
