'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HostDynamicPricingPage() {
  const [selectedHotel, setSelectedHotel] = useState('hotel_1');
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.2); // 120% cho cuối tuần/lễ
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-05');
  const [ruleName, setRuleName] = useState('Phụ phí Mùa Lễ 2/9');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Cấu hình Dynamic Pricing theo Mùa & Cuối tuần</h1>
        <p className="text-xs text-gray-500 mt-1">Cài đặt hệ số giá linh hoạt theo từng khoảng ngày để tối ưu doanh thu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form cấu hình */}
        <form onSubmit={handleSaveRule} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-4">
          <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-booking-blue" /> Tạo Quy tắc Giá mới
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Chọn Khách sạn *</label>
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              className="px-3 py-2 text-xs font-bold border border-gray-300 rounded-lg outline-none"
            >
              <option value="hotel_1">Phú Quốc Sunset Luxury Resort</option>
              <option value="hotel_2">Đà Nẵng Ocean View Villa</option>
            </select>
          </div>

          <Input
            label="Tên quy tắc áp dụng *"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Từ ngày *" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            <Input label="Đến ngày *" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Hệ số Phụ phí (Surge Multiplier) *</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={surgeMultiplier}
                onChange={(e) => setSurgeMultiplier(Number(e.target.value))}
                className="w-full accent-booking-blue cursor-pointer"
              />
              <span className="text-sm font-black text-booking-navy w-12 text-right">{surgeMultiplier}x</span>
            </div>
            <span className="text-[11px] text-gray-500">Ví dụ: 1.2x tương đương tăng 20% so với giá base gốc.</span>
          </div>

          <Button type="submit" variant="action" className="w-full font-bold gap-2 py-2.5">
            <Save className="w-4 h-4" /> Lưu Quy tắc Pricing
          </Button>

          {isSaved && (
            <p className="text-xs text-emerald-600 font-bold text-center">Đã lưu cấu hình Dynamic Pricing thành công!</p>
          )}
        </form>

        {/* Calendar Preview Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-4">
          <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-booking-navy" /> Xem trước Lịch điều chỉnh Giá
          </h3>

          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs space-y-2">
            <p className="font-bold text-booking-navy">Quy tắc đang áp dụng:</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 font-semibold text-gray-800">
                Lễ 2/9 ({startDate} $\rightarrow$ {endDate}): <strong className="text-booking-blue">{surgeMultiplier}x</strong>
              </span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 font-semibold text-gray-800">
                Cuối tuần T7 & CN: <strong className="text-booking-blue">1.15x</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
