'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useSocketChat } from '@/hooks/use-socket-chat';
import { Button } from '@/components/ui/button';

interface ChatDrawerProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatDrawer({ bookingId, isOpen, onClose }: ChatDrawerProps) {
  const { messages, sendMessage } = useSocketChat(bookingId);
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    sendMessage(text);
    setText('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-float border border-gray-200 overflow-hidden flex flex-col h-[480px] animate-fade-in">
      {/* Drawer Header */}
      <div className="bg-booking-navy text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-booking-yellow" />
          <div>
            <h4 className="font-bold text-xs">Nhắn tin trực tiếp với Host</h4>
            <span className="text-[10px] text-gray-300">Booking #{bookingId}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-xs">
        {messages.map((m) => {
          const isMe = m.senderId === 'user_1';
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-gray-400 mb-0.5">{m.senderName} · {m.createdAt}</span>
              <div
                className={`p-3 rounded-2xl max-w-[80%] ${
                  isMe
                    ? 'bg-booking-blue text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-booking-blue"
        />
        <Button type="submit" variant="action" size="sm" className="p-2">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
