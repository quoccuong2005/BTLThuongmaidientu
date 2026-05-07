'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { adminApi } from '@/services/adminApi';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gọi thử API Đăng nhập Admin
const res = await adminApi.login({ identifier: identifier, password: password });
      // Lấy token (tùy thuộc vào backend trả về res.token, res.data.accessToken...)
      const token = res.token || res.data?.token || res.accessToken;
      
      if (token) {
        localStorage.setItem('admin_token', token);
        document.cookie = `admin_token=${token}; path=/; max-age=86400`;
        alert('Đăng nhập Admin thành công!');
        router.push('/admin');
      } else {
        throw new Error("Tài khoản không hợp lệ!");
      }
    } catch (err: any) {
      // Chỗ này sau này bạn viết thêm catch cho User API. Hiện tại nếu lỗi thì báo lỗi.
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đăng nhập tài khoản</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email hoặc Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input type="text" required className="block w-full pl-10 border-gray-300 rounded-md py-2.5 border outline-none" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input type="password" required className="block w-full pl-10 border-gray-300 rounded-md py-2.5 border outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 rounded-md text-white bg-orange-600 hover:bg-orange-700">
              {loading ? 'Đang xử lý...' : 'Đăng nhập'} <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}