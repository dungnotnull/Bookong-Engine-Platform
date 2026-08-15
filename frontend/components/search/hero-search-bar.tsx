'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Search, Sparkles } from 'lucide-react';
import { useSearchStore } from '@/stores/use-search-store';
import { Button } from '@/components/ui/button';

export function HeroSearchBar() {
  const router = useRouter();
  const searchStore = useSearchStore();

  const [location, setLocation] = useState(searchStore.location);
  const [checkIn, setCheckIn] = useState(searchStore.checkIn);
  const [checkOut, setCheckOut] = useState(searchStore.checkOut);
  const [guests, setGuests] = useState(searchStore.guests);
  const [semanticQuery, setSemanticQuery] = useState(searchStore.semanticQuery);
  const [errorMsg, setErrorMsg] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (newIn: string) => {
    setCheckIn(newIn);
    if (new Date(checkOut) <= new Date(newIn)) {
      const autoOut = new Date(new Date(newIn).setDate(new Date(newIn).getDate() + 1)).toISOString().split('T')[0];
      setCheckOut(autoOut);
    }
  };

  const handleCheckOutChange = (newOut: string) => {
    if (new Date(newOut) <= new Date(checkIn)) {
      const autoOut = new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() + 1)).toISOString().split('T')[0];
      setCheckOut(autoOut);
    } else {
      setCheckOut(newOut);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Client Validation: checkOut > checkIn
    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg('Ngày trả phòng (Check-out) phải lớn hơn ngày nhận phòng (Check-in) ít nhất 1 ngày.');
      return;
    }

    searchStore.setSearchParams({
      location,
      checkIn,
      checkOut,
      guests,
      semanticQuery,
    });

    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('guests', guests.toString());
    if (semanticQuery) params.set('q', semanticQuery);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-booking-yellow p-1.5 rounded-2xl shadow-float space-y-2">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 text-xs font-bold p-2.5 rounded-lg border border-red-200 text-center">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-xl p-3 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        {/* Destination / AI Semantic Query */}
        <div className="flex flex-col gap-1 border border-gray-200 rounded-lg p-2 hover:border-booking-blue transition-smooth">
          <label className="text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-booking-navy" />
            Địa điểm hoặc Mô tả AI
          </label>
          <input
            type="text"
            placeholder="vd: Phú Quốc hoặc Villa sát biển"
            value={semanticQuery || location}
            onChange={(e) => {
              setLocation(e.target.value);
              setSemanticQuery(e.target.value);
            }}
            className="w-full text-xs font-bold text-gray-900 bg-transparent outline-none"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-1 border border-gray-200 rounded-lg p-2 hover:border-booking-blue transition-smooth">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-booking-navy" />
              Check-in
            </label>
            <input
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="text-xs font-bold text-gray-900 bg-transparent outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 border-l border-gray-100 pl-2">
            <label className="text-[10px] font-bold uppercase text-gray-500">Check-out</label>
            <input
              type="date"
              min={checkIn || todayStr}
              value={checkOut}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              className="text-xs font-bold text-gray-900 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Guests selector */}
        <div className="flex flex-col gap-1 border border-gray-200 rounded-lg p-2 hover:border-booking-blue transition-smooth">
          <label className="text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-booking-navy" />
            Số lượng khách
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="text-xs font-bold text-gray-900 bg-transparent outline-none cursor-pointer"
          >
            <option value={1}>1 người lớn</option>
            <option value={2}>2 người lớn (1 phòng)</option>
            <option value={4}>4 người lớn (2 phòng)</option>
            <option value={6}>6 người lớn (Gia đình)</option>
          </select>
        </div>

        {/* Submit */}
        <Button type="submit" variant="action" size="lg" className="w-full font-bold gap-2 py-3">
          <Search className="w-4 h-4" />
          <span>Tìm kiếm chỗ nghỉ</span>
        </Button>
      </div>
    </form>
  );
}
