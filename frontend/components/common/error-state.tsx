'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export function ErrorState({
  title = 'Tải dữ liệu thất bại',
  message = 'Đã có lỗi xảy ra khi kết nối máy chủ. Vui lòng kiểm tra lại đường truyền và thử lại.',
  onRetry,
  isRetrying = false,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`p-6 rounded-2xl bg-red-50/80 border border-red-200 text-center space-y-4 max-w-lg mx-auto my-6 shadow-sm ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-red-950">{title}</h3>
        <p className="text-xs text-red-700 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="font-bold gap-2 mx-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Đang tải lại...' : 'Thử lại'}
          </Button>
        </div>
      )}
    </div>
  );
}
