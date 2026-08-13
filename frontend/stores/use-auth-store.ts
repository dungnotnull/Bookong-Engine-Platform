import { create } from 'zustand';
import { UserProfile, UserRole } from '@/types/user';

interface AuthStoreState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
  updateUser: (user: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('bookong_token') : null,
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('bookong_user') || 'null') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('bookong_token') : false,
  isLoading: false,

  setAuth: (token: string, user: UserProfile) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookong_token', token);
      localStorage.setItem('bookong_user', JSON.stringify(user));
    }
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bookong_token');
      localStorage.removeItem('bookong_user');
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  updateUser: (updatedFields) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedFields };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookong_user', JSON.stringify(newUser));
      }
      return { user: newUser };
    });
  },
}));
