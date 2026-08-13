'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PillSearchBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'location' | 'dates' | 'guests' | null>(null);

  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const totalGuests = adults + childrenCount;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('guests', totalGuests.toString());

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Search Pill Container */}
      <form
        onSubmit={handleSearch}
        className={cn(
          'relative flex flex-col md:flex-row items-center bg-white border border-border rounded-2xl md:rounded-pill shadow-pill-search hover:shadow-airbnb-hover transition-all duration-300 divide-y md:divide-y-0 md:divide-x divide-border-light p-1.5 md:p-2'
        )}
      >
        {/* Section 1: Location */}
        <div
          onClick={() => setActiveTab('location')}
          className={cn(
            'flex-1 w-full px-5 py-3 rounded-xl md:rounded-pill cursor-pointer transition-colors duration-200 hover:bg-gray-100/70',
            activeTab === 'location' && 'bg-white shadow-md'
          )}
        >
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-main">
            Địa điểm / AI Search
          </label>
          <input
            type="text"
            placeholder="Tìm điểm đến hoặc 'Villa sát biển Phú Quốc'"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-xs font-semibold text-main placeholder-muted bg-transparent outline-none truncate"
          />
        </div>

        {/* Section 2: Dates */}
        <div
          onClick={() => setActiveTab('dates')}
          className={cn(
            'flex-1 w-full px-5 py-3 rounded-xl md:rounded-pill cursor-pointer transition-colors duration-200 hover:bg-gray-100/70',
            activeTab === 'dates' && 'bg-white shadow-md'
          )}
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-main">
                Nhận phòng
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-xs font-semibold text-main bg-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-main">
                Trả phòng
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-xs font-semibold text-main bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Guests */}
        <div
          onClick={() => {
            setActiveTab('guests');
            setIsGuestsOpen(!isGuestsOpen);
          }}
          className={cn(
            'relative flex-1 w-full px-5 py-3 rounded-xl md:rounded-pill cursor-pointer transition-colors duration-200 hover:bg-gray-100/70 flex items-center justify-between',
            activeTab === 'guests' && 'bg-white shadow-md'
          )}
        >
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-main">
              Thêm khách
            </label>
            <span className="text-xs font-semibold text-main block truncate">
              {totalGuests > 0 ? `${totalGuests} khách` : 'Thêm số khách'}
            </span>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="hidden md:flex items-center justify-center gap-2 bg-rausch hover:bg-rausch-hover text-white font-bold text-sm px-5 py-3 rounded-full shadow-md transition-all active:scale-95 shrink-0 ml-2"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Tìm kiếm</span>
          </button>
        </div>

        {/* Mobile Search CTA */}
        <button
          type="submit"
          className="md:hidden w-full flex items-center justify-center gap-2 bg-rausch hover:bg-rausch-hover text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all mt-2"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span>Tìm kiếm</span>
        </button>

        {/* Guests Popover Selector */}
        {isGuestsOpen && (
          <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl p-5 shadow-modal border border-border-light z-50 animate-fade-in text-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-main">Người lớn</p>
                <p className="text-muted text-[11px]">Từ 13 tuổi trở lên</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={adults <= 1}
                  onClick={() => setAdults(adults - 1)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-main hover:border-main disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-main w-4 text-center">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-main hover:border-main"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border-light pt-3">
              <div>
                <p className="font-bold text-main">Trẻ em</p>
                <p className="text-muted text-[11px]">Độ tuổi 2 – 12</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={childrenCount <= 0}
                  onClick={() => setChildrenCount(childrenCount - 1)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-main hover:border-main disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-main w-4 text-center">{childrenCount}</span>
                <button
                  type="button"
                  onClick={() => setChildrenCount(childrenCount + 1)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-main hover:border-main"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
