'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ Email và Mật khẩu.');
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API POST /api/v1/auth/login
      const res = await apiClient.post('/auth/login', { email, password });
      
      const payload = (res as any)?.data || res;
      const token = payload?.accessToken || payload?.token;
      const user = payload?.user;

      if (token && user) {
        setAuth(token, user);
        
        // Tự động phân hướng chuyển màn hình dựa vào role của user trong cơ sở dữ liệu
        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (user.role === 'HOST') {
          router.push('/host/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setErrorMsg('Dữ liệu phản hồi từ máy chủ không đúng định dạng.');
      }
    } catch (err: any) {
      const message =
        err?.message === 'Invalid credentials'
          ? 'Địa chỉ Email hoặc Mật khẩu không chính xác.'
          : err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-float p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-booking-navy">Đăng nhập Bookong</h1>
          <p className="text-xs text-gray-500 mt-1">Đăng nhập tài khoản để truy cập hệ thống theo đúng phân quyền</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" variant="action" className="w-full font-bold py-2.5" isLoading={isLoading}>
            Đăng nhập ngay
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-booking-blue font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
