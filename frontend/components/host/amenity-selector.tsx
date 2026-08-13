'use client';

import React from 'react';
import { Wifi, Waves, Car, Wind, Utensils, Bath, Sun, Coffee, Check } from 'lucide-react';
import { DEFAULT_AMENITIES } from '@/lib/constants';
import { Amenity } from '@/types/hotel';

interface AmenitySelectorProps {
  category?: 'HOTEL' | 'ROOM';
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function AmenitySelector({ category, selectedIds, onChange }: AmenitySelectorProps) {
  const filtered = category
    ? DEFAULT_AMENITIES.filter((a) => a.category === category)
    : DEFAULT_AMENITIES;

  const toggleAmenity = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const renderIcon = (id: string) => {
    switch (id) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'pool': return <Waves className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'aircon': return <Wind className="w-4 h-4" />;
      case 'breakfast': return <Utensils className="w-4 h-4" />;
      case 'bath': return <Bath className="w-4 h-4" />;
      case 'balcony': return <Sun className="w-4 h-4" />;
      case 'minibar': return <Coffee className="w-4 h-4" />;
      default: return <Check className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {filtered.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleAmenity(item.id)}
            className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-smooth text-left ${
              isSelected
                ? 'border-booking-blue bg-blue-50/80 text-booking-blue shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className={isSelected ? 'text-booking-blue' : 'text-gray-400'}>
              {renderIcon(item.id)}
            </div>
            <span className="truncate">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}
