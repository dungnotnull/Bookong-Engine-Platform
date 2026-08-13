import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export function useSocketChat(bookingId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderId: 'host_1',
      senderName: 'Sunset Sanato Host',
      content: 'Xin chào quý khách! Cảm ơn bạn đã lựa chọn chỗ nghỉ của chúng tôi.',
      createdAt: '10:15',
    },
    {
      id: 'm2',
      senderId: 'user_1',
      senderName: 'Tôi',
      content: 'Dạ cho em hỏi khách sạn có hỗ trợ nhận phòng sớm khoảng 12h trưa không ạ?',
      createdAt: '10:16',
    },
  ]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: 'm_' + Date.now(),
      senderId: 'user_1',
      senderName: 'Tôi',
      content: text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return {
    messages,
    sendMessage,
  };
}
