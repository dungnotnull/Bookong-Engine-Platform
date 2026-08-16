'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/use-auth-store';
import { useChatStore } from '@/stores/use-chat-store';
import { subscribeRealtimeChatMessages } from '@/lib/chat-service';

export function GlobalNotification() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);
  const incrementUnread = useChatStore((state) => state.incrementUnread);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 1. Lắng nghe tin nhắn phát sóng realtime qua BroadcastChannel & Storage Event
    const unsubscribeBroadcast = subscribeRealtimeChatMessages((msg) => {
      // Chỉ tăng unread count nếu tin nhắn do đối phương gửi đến (không phải do chính người dùng hiện tại vừa bấm gửi)
      const isFromOther =
        msg &&
        msg.bookingId &&
        (!currentUser?.id || (msg.senderId !== currentUser.id && (typeof msg.sender !== 'object' || msg.sender?.id !== currentUser.id)));

      if (isFromOther && msg.bookingId) {
        incrementUnread(msg.bookingId);
      }
    });

    // 2. Kết nối Socket ngầm nếu đã đăng nhập
    if (isAuthenticated && token) {
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

      const handleIncomingMessage = (data: any) => {
        const targetBookingId = data?.bookingId || data?.data?.bookingId;
        const senderId = data?.senderId || data?.sender?.id;

        if (targetBookingId && senderId !== currentUser?.id) {
          incrementUnread(targetBookingId);
        }
      };

      socket.on('newMessage', handleIncomingMessage);
      socket.on('chat_notification', handleIncomingMessage);
      socket.on('notification', handleIncomingMessage);
    }

    return () => {
      unsubscribeBroadcast();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, token, currentUser?.id, incrementUnread]);

  // Component chạy ngầm theo dõi notification, không render bất kỳ UI DOM nào
  return null;
}
