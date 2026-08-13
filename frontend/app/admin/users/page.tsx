'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { UserRole } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { Pagination } from '@/components/common/pagination';
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

  // Modal Create Admin states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await apiClient.get('/admin/users', { params: { page, limit: LIMIT } });
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const meta = res?.meta || {};

      setUsers(data);
      setTotalPages(meta.totalPages || Math.ceil((data.length || 1) / LIMIT));
      setTotalItems(meta.total ?? data.length);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách tài khoản người dùng. Vui lòng kiểm tra quyền Admin.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

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

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!newEmail || !newPassword) {
      setCreateError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    if (newPassword.length < 6) {
      setCreateError('Mật khẩu tối thiểu phải từ 6 ký tự.');
      return;
    }

    setIsCreating(true);
    try {
      // Gọi API POST /api/v1/admin/users để khởi tạo Admin mới
      await apiClient.post('/admin/users', {
        email: newEmail,
        password: newPassword,
        fullName: newFullName || undefined,
      });

      setIsModalOpen(false);
      setNewEmail('');
      setNewPassword('');
      setNewFullName('');
      fetchUsers();
    } catch (err: any) {
      setCreateError(err?.message || 'Không thể tạo tài khoản Admin mới. Vui lòng thử lại sau.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="booking-container py-8 space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-booking-navy">Quản lý Tài khoản Người dùng & Host</h1>
          <p className="text-xs text-gray-500 mt-1">Kiểm soát quyền hạn, khởi tạo quản trị viên và quản lý trạng thái tài khoản</p>
        </div>

        {/* Nút bấm Tạo tài khoản Admin mới (BUG-006 Resolution) */}
        <Button
          variant="action"
          onClick={() => setIsModalOpen(true)}
          className="font-bold gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Tạo tài khoản Admin mới
        </Button>
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
        <>
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

          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalItems}
            limit={LIMIT}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}

      {/* Modal Form Tạo Admin mới (Fix BUG-006) */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tạo Tài khoản Admin Quản trị mới">
        <form onSubmit={handleCreateAdmin} className="space-y-4 py-2">
          <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-booking-navy flex items-start gap-2 border border-blue-100">
            <ShieldCheck className="w-5 h-5 shrink-0 text-booking-blue" />
            <span>
              Tài khoản Admin tạo ra sẽ có đầy đủ quyền phê duyệt khách sạn, quản lý người dùng và cấu hình toàn hệ thống.
            </span>
          </div>

          {createError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {createError}
            </div>
          )}

          <Input
            label="Họ và tên Admin"
            placeholder="Nguyễn Văn A"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
          />

          <Input
            label="Địa chỉ Email *"
            type="email"
            placeholder="admin@bookong.vn"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />

          <Input
            label="Mật khẩu khởi tạo *"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="action" type="submit" isLoading={isCreating} className="font-bold">
              Tạo Admin ngay
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
