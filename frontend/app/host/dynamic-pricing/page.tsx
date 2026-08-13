'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, TrendingUp, Save, Building2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Hotel } from '@/types/hotel';
import { apiClient } from '@/lib/api-client';

interface PricingRule {
  id: string;
  name: string;
  hotelId: string;
  multiplier: number;
  startDate?: string;
  endDate?: string;
  dayOfWeek?: number;
}

export default function HostDynamicPricingPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.2);
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-05');
  const [ruleName, setRuleName] = useState('Phụ phí Mùa Lễ 2/9');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchHostHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await apiClient.get('/hotels/my-hotels');
      const data = res?.data || res || [];
      if (Array.isArray(data) && data.length > 0) {
        setHotels(data);
        setSelectedHotel(data[0].id);
      } else {
        setHotels([]);
        setSelectedHotel('');
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể lấy danh sách khách sạn của bạn để cài đặt Dynamic Pricing.');
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPricingRules = useCallback(async (hotelId: string) => {
    if (!hotelId) return;
    try {
      // Gọi đúng API endpoint GET /api/v1/pricing-rules theo Backend Contract (Fix BUG-007)
      const res: any = await apiClient.get('/pricing-rules', { params: { hotelId } });
      const data = res?.data || res || [];
      if (Array.isArray(data)) {
        setPricingRules(data);
      } else {
        setPricingRules([]);
      }
    } catch {
      setPricingRules([]);
    }
  }, []);

  useEffect(() => {
    fetchHostHotels();
  }, [fetchHostHotels]);

  useEffect(() => {
    if (selectedHotel) {
      fetchPricingRules(selectedHotel);
    }
  }, [selectedHotel, fetchPricingRules]);

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;

    setIsSaving(true);
    setSuccessMessage('');
    try {
      // Gọi đúng API endpoint POST /api/v1/pricing-rules (Fix BUG-007)
      await apiClient.post('/pricing-rules', {
        hotelId: selectedHotel,
        name: ruleName,
        multiplier: surgeMultiplier,
        startDate,
        endDate,
      });

      setSuccessMessage('Đã lưu quy tắc Dynamic Pricing thành công!');
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchPricingRules(selectedHotel);
    } catch (err: any) {
      alert(err?.message || 'Lưu quy tắc giá thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await apiClient.delete(`/pricing-rules/${ruleId}`);
      setPricingRules((prev) => prev.filter((r) => r.id !== ruleId));
    } catch (err: any) {
      alert(err?.message || 'Xóa quy tắc thất bại.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="lg:col-span-2 h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorState
          title="Lỗi tải danh sách khách sạn"
          message={error}
          onRetry={fetchHostHotels}
          isRetrying={isLoading}
        />
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          icon={<Building2 className="w-8 h-8" />}
          title="Bạn chưa có khách sạn nào"
          description="Vui lòng tạo cơ sở lưu trú trước khi thiết lập quy tắc giá theo mùa/cuối tuần."
        />
      </div>
    );
  }

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
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.city})
                </option>
              ))}
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

          <Button type="submit" variant="action" isLoading={isSaving} className="w-full font-bold gap-2 py-2.5">
            <Save className="w-4 h-4" /> Lưu Quy tắc Pricing
          </Button>

          {successMessage && (
            <p className="text-xs text-emerald-600 font-bold text-center">{successMessage}</p>
          )}
        </form>

        {/* Dynamic Pricing Rules List Panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-airbnb space-y-4">
          <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-booking-navy" /> Quy tắc Pricing Đang Hoạt động
          </h3>

          {pricingRules.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-500 font-medium">Chưa có quy tắc giá động nào cho khách sạn này.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pricingRules.map((rule) => (
                <div key={rule.id} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-extrabold text-sm text-booking-navy">{rule.name}</p>
                    <p className="text-xs text-gray-600">
                      Thời gian: {rule.startDate ? rule.startDate.split('T')[0] : 'Tất cả'} &rarr; {rule.endDate ? rule.endDate.split('T')[0] : 'Tất cả'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-booking-blue text-white px-3 py-1 rounded-lg text-xs font-black">
                      {rule.multiplier}x
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Xóa quy tắc"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
