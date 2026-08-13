'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Building2, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/stores/use-auth-store';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'HOST' | 'ADMIN'>('USER');
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
      // Gọi API POST /api/v1/auth/register kèm role
      const res = await apiClient.post('/auth/register', { fullName, email, password, role });
      
      const payload = (res as any)?.data || res;
      const token = payload?.accessToken || payload?.token;
      const user = payload?.user;

      if (token && user) {
        setAuth(token, user);

        // Tự động phân hướng màn hình tương ứng với vai trò tài khoản được đăng ký
        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (user.role === 'HOST') {
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

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bước chọn Vai trò / Role */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">Chọn vai trò của bạn *</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('USER')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  role === 'USER'
                    ? 'border-booking-blue bg-blue-50/50 text-booking-navy font-bold ring-2 ring-booking-blue/20'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <User className={`w-5 h-5 ${role === 'USER' ? 'text-booking-blue' : 'text-gray-400'}`} />
                <span className="text-xs font-bold">Khách hàng</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('HOST')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  role === 'HOST'
                    ? 'border-booking-blue bg-blue-50/50 text-booking-navy font-bold ring-2 ring-booking-blue/20'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Building2 className={`w-5 h-5 ${role === 'HOST' ? 'text-booking-blue' : 'text-gray-400'}`} />
                <span className="text-xs font-bold">Chủ nhà / Host</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  role === 'ADMIN'
                    ? 'border-booking-blue bg-blue-50/50 text-booking-navy font-bold ring-2 ring-booking-blue/20'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <ShieldCheck className={`w-5 h-5 ${role === 'ADMIN' ? 'text-booking-blue' : 'text-gray-400'}`} />
                <span className="text-xs font-bold">Quản trị viên</span>
              </button>
            </div>
          </div>

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
            Đăng ký ngay ({role === 'HOST' ? 'Tài khoản Chủ nhà' : role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'})
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-booking-blue font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

