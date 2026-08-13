import { create } from 'zustand';
import { UserProfile } from '@/types/user';

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

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const local = localStorage.getItem('bookong_token');
  if (local) return local;
  const cookieMatch = document.cookie.match(/bookong_token=([^;]+)/);
  return cookieMatch ? cookieMatch[1] : null;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  token: getStoredToken(),
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('bookong_user') || 'null') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!getStoredToken() : false,
  isLoading: false,

  setAuth: (token: string, user: UserProfile) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookong_token', token);
      localStorage.setItem('bookong_user', JSON.stringify(user));
      // Lưu đồng thời token vào cookie để Next.js Middleware đọc được khi truy cập /host và /admin
      document.cookie = `bookong_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bookong_token');
      localStorage.removeItem('bookong_user');
      // Xóa cookie token
      document.cookie = 'bookong_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
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
