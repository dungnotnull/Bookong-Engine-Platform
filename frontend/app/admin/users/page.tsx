'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserRole } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { apiClient } from '@/lib/api-client';

interface AdminUserItem {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  role: UserRole;
  isBanned?: boolean;
  status?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API GET /api/v1/admin/users
      const res: any = await apiClient.get('/admin/users');
      const data = res?.data || res || [];
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách tài khoản người dùng. Vui lòng kiểm tra quyền Admin.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleBan = async (id: string, currentBannedStatus: boolean) => {
    try {
      await apiClient.patch(`/admin/users/${id}/status`, { isBanned: !currentBannedStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBanned: !currentBannedStatus } : u))
      );
    } catch (err: any) {
      alert(err?.message || 'Cập nhật trạng thái tài khoản thất bại.');
    }
  };

  return (
    <div className="booking-container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Quản lý Tài khoản Người dùng & Host</h1>
        <p className="text-xs text-gray-500 mt-1">Kiểm soát quyền hạn và trạng thái hoạt động tài khoản</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : error ? (
        <ErrorState
          title="Lỗi tải danh sách tài khoản"
          message={error}
          onRetry={fetchUsers}
          isRetrying={isLoading}
        />
      ) : users.length === 0 ? (
        <EmptyState
          title="Chưa có tài khoản người dùng nào"
          description="Hiện chưa có dữ liệu tài khoản trên hệ thống."
        />
      ) : (
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
                    <td className="p-4 font-bold text-gray-900">{u.fullName || u.name || 'Người dùng'}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <Badge variant={u.role === 'HOST' ? 'yellow' : u.role === 'ADMIN' ? 'navy' : 'blue'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={u.isBanned ? 'orange' : 'green'}>
                        {u.isBanned ? 'Đã bị khóa' : 'Hoạt động'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant={u.isBanned ? 'action' : 'danger'} onClick={() => toggleBan(u.id, !!u.isBanned)}>
                        {u.isBanned ? 'Mở khóa' : 'Khóa tài khoản'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
