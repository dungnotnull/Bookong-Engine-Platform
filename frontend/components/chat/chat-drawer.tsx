'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { useSocketChat } from '@/hooks/use-socket-chat';
import { useAuthStore } from '@/stores/use-auth-store';
import { useChatStore } from '@/stores/use-chat-store';
import { Button } from '@/components/ui/button';

interface ChatDrawerProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string; // Tên thật của đối phương (Tên Khách sạn/Host hoặc Tên Khách hàng)
}

export function ChatDrawer({ bookingId, isOpen, onClose, recipientName }: ChatDrawerProps) {
  const { messages, isLoading, sendMessage } = useSocketChat(bookingId);
  const currentUser = useAuthStore((state) => state.user);
  const resetUnread = useChatStore((state) => state.resetUnread);
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Tự động cuộn xuống cuối danh sách tin nhắn khi có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Reset số lượng tin nhắn chưa đọc của bookingId này về 0 khi mở Chat Drawer
  useEffect(() => {
    if (isOpen && bookingId) {
      resetUnread(bookingId);
    }
  }, [isOpen, bookingId, resetUnread]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  // Đảm bảo an toàn 100% dữ liệu mảng tin nhắn để UI không bao giờ bị crash trắng trang
  const safeMessages = Array.isArray(messages) ? messages : [];

  // Xác định vai trò hiện tại của giao diện (HOST hay GUEST)
  const isHostView = typeof window !== 'undefined' && window.location.pathname.startsWith('/host');
  const currentRole: 'GUEST' | 'HOST' = isHostView ? 'HOST' : 'GUEST';

  // Tên tiêu đề hiển thị trên header
  const headerTitle = recipientName
    ? isHostView
      ? `Trao đổi với ${recipientName}`
      : `Nhắn tin với ${recipientName}`
    : isHostView
    ? 'Trao đổi trực tiếp với Khách hàng'
    : 'Nhắn tin trực tiếp với Host';

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-float border border-gray-200 overflow-hidden flex flex-col h-[480px] animate-fade-in">
      {/* Header Chat Drawer */}
      <div className="bg-booking-navy text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 bg-white/10 rounded-xl shrink-0">
            <MessageSquare className="w-5 h-5 text-booking-yellow" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs truncate">{headerTitle}</h4>
            <span className="text-[10px] text-gray-300 block">Mã đơn #{bookingId.substring(0, 8).toUpperCase()}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0"
          aria-label="Đóng chat"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Danh sách Tin nhắn Chat */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-xs">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang tải lịch sử tin nhắn...</span>
          </div>
        ) : safeMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-1">
            <MessageSquare className="w-8 h-8 text-gray-300 stroke-1" />
            <p className="text-[11px] font-medium">Chưa có tin nhắn nào</p>
            <p className="text-[10px] text-gray-400">Hãy gửi tin nhắn đầu tiên cho đối phương!</p>
          </div>
        ) : (
          safeMessages.map((m) => {
            // Phân loại tin nhắn của "Tôi" hay của "Đối phương" dựa trên senderRole hoặc currentUser.id
            const senderObjId = typeof m.sender === 'object' ? m.sender?.id : undefined;
            const isMe = m.senderRole
              ? m.senderRole === currentRole
              : Boolean(currentUser?.id && (m.senderId === currentUser.id || senderObjId === currentUser.id));

            // Map tên thật của người gửi chuẩn xác từ m.sender.fullName / m.senderName / recipientName
            const senderFullName =
              typeof m.sender === 'object' && m.sender?.fullName
                ? m.sender.fullName
                : m.senderName && m.senderName !== 'Tôi' && m.senderName !== 'Host Chỗ Nghỉ' && m.senderName !== 'Khách hàng'
                ? m.senderName
                : recipientName || (m.senderRole === 'HOST' ? 'Host Chỗ Nghỉ' : 'Khách hàng');

            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-gray-400 mb-0.5 px-1 font-medium">
                  {isMe ? 'Tôi' : senderFullName} · {m.createdAt}
                </span>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] break-words leading-relaxed text-xs shadow-xs ${
                    isMe
                      ? 'bg-booking-blue text-white rounded-tr-none font-medium'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input gửi tin nhắn */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 text-xs px-3 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-booking-blue focus:border-transparent transition-all"
        />
        <Button type="submit" variant="action" size="sm" className="p-2.5 rounded-xl shrink-0" disabled={!text.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
