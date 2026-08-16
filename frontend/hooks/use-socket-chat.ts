import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/use-auth-store';
import {
  getLocalChatHistory,
  saveAndBroadcastChatMessage,
  subscribeRealtimeChatMessages,
} from '@/lib/chat-service';

export interface ChatMessage {
  id: string;
  bookingId?: string;
  senderId?: string;
  senderRole?: 'GUEST' | 'HOST';
  senderName: string;
  sender?: {
    id?: string;
    fullName?: string;
    email?: string;
    avatar?: string;
  } | string;
  content: string;
  createdAt: string;
}

export function useSocketChat(bookingId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket | null>(null);

  // Fetch lịch sử tin nhắn từ API và kết hợp dữ liệu lưu trữ local (chống crash khi API offline)
  const fetchMessageHistory = useCallback(async () => {
    if (!bookingId) return;
    setIsLoading(true);

    // 1. Tải trước lịch sử chat từ localStorage
    const localHistory = getLocalChatHistory(bookingId);
    setMessages(localHistory);

    // 2. Thử fetch thêm từ API Backend nếu backend có sẵn endpoint
    try {
      let res: any;
      try {
        res = await apiClient.get(`/messages/${bookingId}`);
      } catch {
        try {
          res = await apiClient.get(`/chat/messages/${bookingId}`);
        } catch {
          res = await apiClient.get(`/chat/${bookingId}`);
        }
      }

      // Safe unpacking TransformInterceptor của NestJS
      const rawData = res?.data ?? res;
      let apiList: ChatMessage[] = [];

      if (Array.isArray(rawData)) {
        apiList = rawData;
      } else if (Array.isArray(rawData?.data)) {
        apiList = rawData.data;
      } else if (Array.isArray(rawData?.messages)) {
        apiList = rawData.messages;
      } else if (Array.isArray(rawData?.items)) {
        apiList = rawData.items;
      }

      if (apiList.length > 0) {
        setMessages((prev) => {
          const mergedMap = new Map<string, ChatMessage>();
          [...prev, ...apiList].forEach((item) => {
            if (item.id) mergedMap.set(item.id, item);
          });
          return Array.from(mergedMap.values());
        });
      }
    } catch {
      // Giữ lịch sử local mượt mà khi API backend chưa tạo endpoint
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) return;

    fetchMessageHistory();

    // 1. Kết nối Socket.IO thật với fallback an toàn
    const token =
      useAuthStore.getState().token ||
      (typeof window !== 'undefined' ? localStorage.getItem('bookong_token') : null);
    const socketBaseUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
      'http://localhost:3000';

    const socket = io(socketBaseUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 2,
      timeout: 3000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinRoom', { bookingId });
      socket.emit('join_booking', { bookingId });
    });

    // Bắt sự kiện tin nhắn mới từ Socket server
    const handleNewMessage = (newMsg: ChatMessage) => {
      if (newMsg && (newMsg.bookingId === bookingId || !newMsg.bookingId)) {
        setMessages((prev) => {
          const safePrev = Array.isArray(prev) ? prev : [];
          if (safePrev.some((m) => m.id === newMsg.id)) return safePrev;
          return [...safePrev, newMsg];
        });
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('receiveMessage', handleNewMessage);

    // 2. Lắng nghe phát sóng realtime giữa các tab/cửa sổ (BroadcastChannel engine)
    const unsubscribeBroadcast = subscribeRealtimeChatMessages((incomingMsg) => {
      if (incomingMsg && incomingMsg.bookingId === bookingId) {
        setMessages((prev) => {
          const safePrev = Array.isArray(prev) ? prev : [];
          if (safePrev.some((m) => m.id === incomingMsg.id)) return safePrev;
          return [...safePrev, incomingMsg];
        });
      }
    });

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('receiveMessage', handleNewMessage);
      socket.disconnect();
      unsubscribeBroadcast();
    };
  }, [bookingId, fetchMessageHistory]);

  // Hàm gửi tin nhắn qua BroadcastChannel, Socket & API
  const sendMessage = async (text: string) => {
    if (!text.trim() || !bookingId) return;

    const isHost = typeof window !== 'undefined' && window.location.pathname.startsWith('/host');
    const senderRole: 'GUEST' | 'HOST' = isHost ? 'HOST' : 'GUEST';
    const currentUser = useAuthStore.getState().user;
    const senderId = currentUser?.id || (isHost ? 'host_user' : 'guest_user');
    const senderName = currentUser?.fullName || (isHost ? 'Host Chỗ Nghỉ' : 'Khách hàng');

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      bookingId,
      senderId,
      senderRole,
      senderName,
      sender: currentUser ? { id: currentUser.id, fullName: currentUser.fullName } : undefined,
      content: text.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // 1. Lưu & phát sóng realtime tới tất cả các tab/cửa sổ khác qua BroadcastChannel
    const updatedLocal = saveAndBroadcastChatMessage(newMsg);
    setMessages(updatedLocal);

    // 2. Gửi qua Socket event nếu socket server đang online
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', { bookingId, content: text, senderId, senderRole });
    }

    // 3. Gửi API lưu DB nếu backend đã có sẵn controller
    try {
      await apiClient.post('/messages', { bookingId, content: text, senderRole });
    } catch {
      try {
        await apiClient.post('/chat/messages', { bookingId, content: text, senderRole });
      } catch {
        // Ignored: đã được lưu & phát sóng qua realtime engine
      }
    }
  };

  return {
    messages: Array.isArray(messages) ? messages : [],
    isLoading,
    sendMessage,
  };
}
