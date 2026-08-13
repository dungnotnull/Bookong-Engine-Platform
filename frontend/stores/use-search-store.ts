import { create } from 'zustand';
import { format, addDays } from 'date-fns';

interface SearchStoreState {
  location: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  semanticQuery: string;
  minPrice?: number;
  maxPrice?: number;
  selectedAmenities: string[];

  // Actions
  setSearchParams: (params: Partial<SearchStoreState>) => void;
  resetFilters: () => void;
}

const today = new Date();
const tomorrow = addDays(today, 1);

export const useSearchStore = create<SearchStoreState>((set) => ({
  location: 'Phú Quốc',
  checkIn: format(today, 'yyyy-MM-dd'),
  checkOut: format(tomorrow, 'yyyy-MM-dd'),
  guests: 2,
  semanticQuery: '',
  minPrice: undefined,
  maxPrice: undefined,
  selectedAmenities: [],

  setSearchParams: (params) => set((state) => ({ ...state, ...params })),
  resetFilters: () => set({ minPrice: undefined, maxPrice: undefined, selectedAmenities: [] }),
}));
