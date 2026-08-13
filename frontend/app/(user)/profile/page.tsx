'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User, Mail, Phone, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { useAuthStore } from '@/stores/use-auth-store';
import { apiClient } from '@/lib/api-client';

export default function UserProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await apiClient.get('/auth/me');
      const data = res?.data || res;
      if (data && typeof data === 'object') {
        updateUser(data);
        setFullName(data.fullName || data.name || '');
        setPhone(data.phone || '');
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể tải thông tin trang cá nhân. Vui lòng đăng nhập lại.');
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    try {
      const res: any = await apiClient.patch('/user/profile', { fullName, phone });
      const updated = res?.data || res;
      if (updated && typeof updated === 'object') {
        updateUser(updated);
      }
      setSuccessMessage('Cập nhật thông tin tài khoản thành công!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err?.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  if (isLoading) {
    return (
      <div className="booking-container py-8 max-w-2xl space-y-6">
        <Skeleton className="h-10 w-1/2 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-container py-12">
        <ErrorState
          title="Không thể tải trang hồ sơ cá nhân"
          message={error}
          onRetry={fetchProfile}
          isRetrying={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="booking-container py-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-booking-navy">Cài đặt Hồ sơ Cá nhân</h1>
        <p className="text-xs text-gray-500 mt-1">Quản lý thông tin tài khoản và phân quyền người dùng</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-airbnb space-y-6">
        {/* User Role Badge Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-booking-navy text-white font-black text-lg flex items-center justify-center">
              {(fullName || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{fullName || 'Người dùng Bookong'}</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-booking-blue" />
                {user?.email || 'Chưa cập nhật email'}
              </p>
            </div>
          </div>
          <Badge variant={user?.role === 'HOST' ? 'yellow' : user?.role === 'ADMIN' ? 'navy' : 'blue'}>
            <Shield className="w-3 h-3 mr-1" />
            {user?.role || 'USER'}
          </Badge>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Họ và tên *"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên đầy đủ"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Địa chỉ Email (Không thể thay đổi)</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-500">
              <Mail className="w-4 h-4 text-gray-400" />
              {user?.email || 'user@example.com'}
            </div>
          </div>

          <Input
            label="Số điện thoại liên hệ"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="ví dụ: 0912345678"
          />

          {successMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              {successMessage}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button variant="danger" type="button" onClick={handleLogout} className="gap-2 font-bold">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </Button>

            <Button variant="action" type="submit" isLoading={isSaving} className="font-bold">
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
