'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/types/user';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin.');
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API POST /api/v1/auth/register tới NestJS Backend
      const res = await apiClient.post('/auth/register', { fullName, email, password, role });
      
      const payload = (res as any)?.data || res;
      const token = payload?.accessToken || payload?.token;
      const user = payload?.user;

      if (token && user) {
        setAuth(token, user);
        if (role === 'HOST') {
          router.push('/host/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setErrorMsg('Đăng ký thất bại. Phản hồi từ máy chủ không hợp lệ.');
      }
    } catch (err: any) {
      const message = err?.message || err?.error || 'Đăng ký thất bại. Email có thể đã tồn tại.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-float p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-booking-navy">Đăng ký tài khoản</h1>
          <p className="text-xs text-gray-500 mt-1">Trải nghiệm dịch vụ đặt phòng và quản lý tài sản hàng đầu</p>
        </div>

        {/* Tab Chọn Vai trò Đăng ký */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('USER')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-smooth ${
              role === 'USER' ? 'bg-white text-booking-navy shadow-sm' : 'text-gray-500'
            }`}
          >
            Khách du lịch (User)
          </button>
          <button
            type="button"
            onClick={() => setRole('HOST')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-smooth ${
              role === 'HOST' ? 'bg-white text-booking-navy shadow-sm' : 'text-gray-500'
            }`}
          >
            Chủ nhà / Khách sạn (Host)
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Địa chỉ Email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="yellow" className="w-full font-bold py-2.5 text-slate-900" isLoading={isLoading}>
            Tạo tài khoản {role}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Đã có tài khoản?{' '}
          <Link href="/register" className="text-booking-blue font-bold hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
