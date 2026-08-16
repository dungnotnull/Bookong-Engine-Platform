import { create } from 'zustand';

interface ChatStoreState {
  // Lưu trữ số lượng tin nhắn chưa đọc cho từng bookingId (bookingId -> count)
  unreadCounts: Record<string, number>;

  // Actions
  incrementUnread: (bookingId: string) => void;
  resetUnread: (bookingId: string) => void;
  getUnreadCount: (bookingId: string) => number;
}

const getStoredUnreadCounts = (): Record<string, number> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('bookong_unread_counts');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveUnreadCounts = (counts: Record<string, number>) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bookong_unread_counts', JSON.stringify(counts));
    } catch {
      // Ignored
    }
  }
};

export const useChatStore = create<ChatStoreState>((set, get) => ({
  unreadCounts: getStoredUnreadCounts(),

  // Tăng số tin nhắn chưa đọc thêm 1 cho bookingId chỉ định
  incrementUnread: (bookingId: string) => {
    if (!bookingId) return;
    set((state) => {
      const newCounts = {
        ...state.unreadCounts,
        [bookingId]: (state.unreadCounts[bookingId] || 0) + 1,
      };
      saveUnreadCounts(newCounts);
      return { unreadCounts: newCounts };
    });
  },

  // Reset số lượng tin nhắn chưa đọc về 0 khi click mở chat
  resetUnread: (bookingId: string) => {
    if (!bookingId) return;
    set((state) => {
      const newCounts = {
        ...state.unreadCounts,
        [bookingId]: 0,
      };
      saveUnreadCounts(newCounts);
      return { unreadCounts: newCounts };
    });
  },

  // Lấy số lượng tin nhắn chưa đọc của một booking
  getUnreadCount: (bookingId: string) => {
    return get().unreadCounts[bookingId] || 0;
  },
}));
