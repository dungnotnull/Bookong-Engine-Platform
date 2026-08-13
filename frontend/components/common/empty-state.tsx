'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title = 'Không tìm thấy dữ liệu',
  description = 'Hiện tại chưa có dữ liệu nào phù hợp với yêu cầu của bạn.',
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`p-10 rounded-2xl bg-surface border border-border-light text-center space-y-4 max-w-md mx-auto my-8 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
        {icon || <Building2 className="w-8 h-8" />}
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-main">{title}</h3>
        <p className="text-xs text-muted leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="action" size="sm" onClick={onAction} className="font-bold">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
