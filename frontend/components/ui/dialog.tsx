import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-float p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          {title ? <h3 className="text-lg font-bold text-gray-900">{title}</h3> : <div />}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-smooth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
}
