'use client';

import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Bộ lọc nâng cao (Airbnb & Booking.com)">
      <div className="space-y-6 text-xs text-main">
        {/* Khoảng giá */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-main">Khoảng giá theo đêm (VND)</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-border rounded-xl p-3">
              <span className="text-[10px] font-bold text-muted uppercase">Tối thiểu</span>
              <input type="number" defaultValue={500000} className="w-full text-sm font-bold outline-none bg-transparent" />
            </div>
            <div className="border border-border rounded-xl p-3">
              <span className="text-[10px] font-bold text-muted uppercase">Tối đa</span>
              <input type="number" defaultValue={5000000} className="w-full text-sm font-bold outline-none bg-transparent" />
            </div>
          </div>
        </div>

        {/* Tiện ích nổi bật */}
        <div className="space-y-3 border-t border-border-light pt-4">
          <h4 className="font-bold text-sm text-main">Tiện nghi nổi bật</h4>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input type="checkbox" defaultChecked className="accent-rausch w-4 h-4" />
              WiFi tốc độ cao
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input type="checkbox" defaultChecked className="accent-rausch w-4 h-4" />
              Hồ bơi riêng / Vô cực
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input type="checkbox" className="accent-rausch w-4 h-4" />
              Bãi đỗ xe miễn phí
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input type="checkbox" className="accent-rausch w-4 h-4" />
              Bồn tắm riêng
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-border-light pt-4">
          <button type="button" onClick={onClose} className="font-bold text-main underline">
            Xóa tất cả
          </button>
          <Button variant="action" className="bg-rausch hover:bg-rausch-hover text-white font-bold px-6 py-2.5" onClick={() => { onApply(); onClose(); }}>
            Hiển thị chỗ nghỉ
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
