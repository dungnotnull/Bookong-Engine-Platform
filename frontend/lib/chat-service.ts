// Helper service quản lý Chat Realtime Local Storage Persistence & Cross-Tab BroadcastChannel
import { ChatMessage } from '@/hooks/use-socket-chat';

const STORAGE_PREFIX = 'bookong_chat_msg_';
const BROADCAST_CHANNEL_NAME = 'bookong_chat_channel';

// Khởi tạo BroadcastChannel để phát tin nhắn realtime giữa các tab/cửa sổ trình duyệt
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch {
    broadcastChannel = null;
  }
}

// Lấy lịch sử tin nhắn từ localStorage theo bookingId
export function getLocalChatHistory(bookingId: string): ChatMessage[] {
  if (typeof window === 'undefined' || !bookingId) return [];
  try {
    const key = STORAGE_PREFIX + bookingId;
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Tin nhắn chào mừng mẫu từ Host khởi tạo mặc định nếu chưa phát sinh chat
      const defaultHistory: ChatMessage[] = [
        {
          id: 'msg_welcome_' + bookingId,
          bookingId,
          senderId: 'host_system',
          senderRole: 'HOST',
          senderName: 'Host Chỗ Nghỉ',
          sender: { id: 'host_system', fullName: 'Host Chỗ Nghỉ' },
          content: 'Xin chào quý khách! Cảm ơn bạn đã lựa chọn đặt phòng tại chỗ nghỉ của chúng tôi. Chỗ nghỉ có thể hỗ trợ gì thêm cho chuyến đi của bạn không ạ?',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      localStorage.setItem(key, JSON.stringify(defaultHistory));
      return defaultHistory;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Lưu một tin nhắn mới vào localStorage và phát sóng realtime cho tất cả các tab khác
export function saveAndBroadcastChatMessage(message: ChatMessage): ChatMessage[] {
  if (typeof window === 'undefined' || !message.bookingId) return [];
  try {
    const key = STORAGE_PREFIX + message.bookingId;
    const current = getLocalChatHistory(message.bookingId);
    
    // Tránh lưu trùng lặp tin nhắn theo ID
    if (current.some((m) => m.id === message.id)) {
      return current;
    }

    const updated = [...current, message];
    localStorage.setItem(key, JSON.stringify(updated));

    // 1. Phát sóng qua BroadcastChannel cho các tab/cửa sổ khác
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'NEW_CHAT_MESSAGE',
        message,
        bookingId: message.bookingId,
      });
    }

    // 2. Bắn CustomEvent cho chính tab hiện tại
    window.dispatchEvent(
      new CustomEvent('bookong_chat_new_message', {
        detail: { message, bookingId: message.bookingId },
      })
    );

    return updated;
  } catch {
    return [];
  }
}

// Đăng ký nhận tin nhắn mới realtime (từ BroadcastChannel, CustomEvent & Storage Event)
export function subscribeRealtimeChatMessages(
  onNewMessage: (msg: ChatMessage) => void
) {
  if (typeof window === 'undefined') return () => {};

  // 1. Lắng nghe BroadcastChannel giữa các tab
  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === 'NEW_CHAT_MESSAGE' && event.data?.message) {
      onNewMessage(event.data.message);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  // 2. Lắng nghe CustomEvent trong cùng một tab
  const handleCustomEvent = (event: Event) => {
    const customEvt = event as CustomEvent;
    if (customEvt.detail?.message) {
      onNewMessage(customEvt.detail.message);
    }
  };
  window.addEventListener('bookong_chat_new_message', handleCustomEvent);

  // 3. Lắng nghe storage event làm fallback
  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key.startsWith(STORAGE_PREFIX) && event.newValue) {
      try {
        const list: ChatMessage[] = JSON.parse(event.newValue);
        if (Array.isArray(list) && list.length > 0) {
          const lastMsg = list[list.length - 1];
          onNewMessage(lastMsg);
        }
      } catch {
        // Ignored
      }
    }
  };
  window.addEventListener('storage', handleStorage);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('bookong_chat_new_message', handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
  };
}
