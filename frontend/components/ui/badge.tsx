import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  variant?: 'green' | 'orange' | 'blue' | 'yellow' | 'gray' | 'navy';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'green', children, className }: BadgeProps) {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    orange: 'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
    blue: 'bg-blue-50 text-booking-blue border-blue-200 font-semibold',
    yellow: 'bg-yellow-50 text-amber-800 border-yellow-300 font-bold',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    navy: 'bg-booking-navy text-white font-bold',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border',
          styles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
}
