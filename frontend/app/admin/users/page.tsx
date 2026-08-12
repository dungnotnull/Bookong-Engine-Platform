'use client';

import React, { useState } from 'react';
import { UserRole } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AdminUserItem {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isBanned: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([
    { id: 'u_1', email: 'user1@gmail.com', fullName: 'Nguyễn Văn A', role: 'USER', isBanned: false },
    { id: 'u_2', email: 'host1@gmail.com', fullName: 'Trần Văn Host', role: 'HOST', isBanned: false },
  ]);

  const toggleBan = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isBanned: !u.isBanned } : u))
    );
  };

  return (
    <div className="booking-container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Quản lý Tài khoản Người dùng & Host</h1>
        <p className="text-xs text-gray-500 mt-1">Kiểm soát quyền hạn và trạng thái hoạt động tài khoản</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-airbnb overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-600 uppercase">
                <th className="p-4">Họ và tên</th>
                <th className="p-4">Email</th>
                <th className="p-4">Vai trò (Role)</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80">
                  <td className="p-4 font-bold text-gray-900">{u.fullName}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <Badge variant={u.role === 'HOST' ? 'yellow' : 'blue'}>{u.role}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.isBanned ? 'orange' : 'green'}>
                      {u.isBanned ? 'Đã bị khóa' : 'Hoạt động'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant={u.isBanned ? 'action' : 'danger'} onClick={() => toggleBan(u.id)}>
                      {u.isBanned ? 'Mở khóa' : 'Khóa tài khoản'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
