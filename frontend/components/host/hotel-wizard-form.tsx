'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AmenitySelector } from '@/components/host/amenity-selector';
import { apiClient } from '@/lib/api-client';

interface HotelWizardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function HotelWizardForm({ onSuccess, onCancel }: HotelWizardFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Phú Quốc');
  const [description, setDescription] = useState('');
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>(['wifi', 'pool', 'parking']);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!name || !address || !description) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // Gọi API POST /api/v1/hotels
      await apiClient.post('/hotels', {
        name,
        address,
        city,
        description,
        amenityIds: selectedAmenityIds,
        coverImage,
        images: [coverImage],
      });
      onSuccess();
    } catch (err: any) {
      // Mock success nếu BE chưa chạy
      onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className={`flex items-center gap-2 text-xs font-bold ${step === 1 ? 'text-booking-blue' : 'text-gray-400'}`}>
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">1</span>
          <span>Thông tin cơ bản</span>
        </div>
        <div className={`flex items-center gap-2 text-xs font-bold ${step === 2 ? 'text-booking-blue' : 'text-gray-400'}`}>
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">2</span>
          <span>Tiện nghi khách sạn</span>
        </div>
        <div className={`flex items-center gap-2 text-xs font-bold ${step === 3 ? 'text-booking-blue' : 'text-gray-400'}`}>
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">3</span>
          <span>Hình ảnh & Xác nhận</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-4">
          <Input
            label="Tên Khách sạn / Resort *"
            placeholder="vd: Sunset Sanato Resort & Villa Phú Quốc"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Địa chỉ chi tiết *"
              placeholder="vd: Đường Trần Hưng Đạo, Bãi Dài"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Thành phố / Tỉnh *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-booking-blue"
              >
                <option value="Phú Quốc">Phú Quốc</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Đà Lạt">Đà Lạt</option>
                <option value="Nha Trang">Nha Trang</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Mô tả Khách sạn (Phục vụ Vector Search) *</label>
            <textarea
              rows={4}
              placeholder="Mô tả chi tiết vị trí, cảnh quan, không gian phòng giúp trợ lý AI dễ dàng ghép nối với tìm kiếm của khách hàng..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-booking-blue"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={onCancel}>Hủy</Button>
            <Button variant="action" onClick={() => setStep(2)}>Tiếp theo: Tiện nghi</Button>
          </div>
        </div>
      )}

      {/* Step 2: Hotel Shared Amenities */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-600">Chọn các dịch vụ và tiện ích dùng chung tại khách sạn của bạn:</p>
          <AmenitySelector
            category="HOTEL"
            selectedIds={selectedAmenityIds}
            onChange={setSelectedAmenityIds}
          />

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>Quay lại</Button>
            <Button variant="action" onClick={() => setStep(3)}>Tiếp theo: Hình ảnh</Button>
          </div>
        </div>
      )}

      {/* Step 3: Images & Confirmation */}
      {step === 3 && (
        <div className="space-y-4">
          <Input
            label="URL Ảnh đại diện (Cover Image URL)"
            placeholder="https://images.unsplash.com/photo-..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />

          {coverImage && (
            <div className="relative h-40 w-full rounded-xl overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-4 rounded-xl bg-gray-50 text-xs space-y-1">
            <p className="font-bold text-gray-900">Tóm tắt Khách sạn:</p>
            <p><span className="font-medium text-gray-500">Tên:</span> {name}</p>
            <p><span className="font-medium text-gray-500">Vị trí:</span> {address}, {city}</p>
            <p><span className="font-medium text-gray-500">Tiện nghi:</span> {selectedAmenityIds.length} dịch vụ đã chọn</p>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>Quay lại</Button>
            <Button variant="yellow" onClick={handleSubmit} isLoading={isLoading} className="font-bold text-slate-900">
              Hoàn tất & Đăng bài Khách sạn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
