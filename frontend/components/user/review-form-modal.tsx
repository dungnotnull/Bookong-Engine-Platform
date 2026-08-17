'use client';

import React, { useState } from 'react';
import { Star, Upload } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  bookingCode: string;
  bookingId: string;
  onSuccess: () => void;
}

export function ReviewFormModal({ isOpen, onClose, hotelId, bookingCode, bookingId, onSuccess }: ReviewFormModalProps) {
  const [cleanlinessRating, setCleanlinessRating] = useState(9);
  const [locationRating, setLocationRating] = useState(9);
  const [serviceRating, setServiceRating] = useState(9);
  const [valueRating, setValueRating] = useState(9);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Gọi API POST /api/v1/hotels/:hotelId/reviews (Ràng buộc BE: booking status phải là CHECKED_OUT)
      await apiClient.post(`/hotels/${hotelId}/reviews`, {
        bookingId,
        cleanlinessRating,
        locationRating,
        serviceRating,
        valueRating,
        comment,
      });
      alert('Gửi đánh giá thành công! Cảm ơn bạn đã đóng góp ý kiến.');
      onSuccess();
    } catch (err: any) {
      alert(err?.message || 'Gửi đánh giá thất bại. Vui lòng kiểm tra lại điều kiện đặt phòng hoặc thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Đánh giá xác thực - ${bookingCode}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <p className="text-gray-500">
          Chỉ khách hàng đã hoàn thành lưu trú (CHECKED_OUT) mới được gửi review minh bạch.
        </p>

        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
          <div>
            <label className="font-bold text-gray-800 block mb-1">Vệ sinh & Sạch sẽ ({cleanlinessRating}/10)</label>
            <input
              type="range"
              min={1}
              max={10}
              value={cleanlinessRating}
              onChange={(e) => setCleanlinessRating(Number(e.target.value))}
              className="w-full accent-booking-blue"
            />
          </div>
          <div>
            <label className="font-bold text-gray-800 block mb-1">Vị trí ({locationRating}/10)</label>
            <input
              type="range"
              min={1}
              max={10}
              value={locationRating}
              onChange={(e) => setLocationRating(Number(e.target.value))}
              className="w-full accent-booking-blue"
            />
          </div>
          <div>
            <label className="font-bold text-gray-800 block mb-1">Phục vụ nhân viên ({serviceRating}/10)</label>
            <input
              type="range"
              min={1}
              max={10}
              value={serviceRating}
              onChange={(e) => setServiceRating(Number(e.target.value))}
              className="w-full accent-booking-blue"
            />
          </div>
          <div>
            <label className="font-bold text-gray-800 block mb-1">Giá trị tiền tệ ({valueRating}/10)</label>
            <input
              type="range"
              min={1}
              max={10}
              value={valueRating}
              onChange={(e) => setValueRating(Number(e.target.value))}
              className="w-full accent-booking-blue"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-gray-800">Nhận xét chi tiết chuyến đi *</label>
          <textarea
            rows={4}
            placeholder="Chia sẻ trải nghiệm thực tế về phòng, không gian, đồ ăn giúp các khách hàng tiếp theo..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-booking-blue"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="yellow" isLoading={isLoading} className="font-bold text-slate-900">
            Gửi Đánh giá Xác thực
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
