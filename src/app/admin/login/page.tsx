'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/services/adminApi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gọi thẳng xuống Backend
      const res = await adminApi.login({ username, password });
      
      // Chú ý: Backend của bạn trả về chữ token, accessToken hay nằm trong data.token?
      // Bạn cần console.log(res) để check nếu báo lỗi undefined
      const token = res.token || res.data?.token || res.accessToken; 
      
      if (token) {
        localStorage.setItem('admin_token', token);
        document.cookie = `admin_token=${token}; path=/; max-age=86400`;
        alert('Đăng nhập thành công!');
        router.push('/admin'); 
      } else {
        throw new Error("Không lấy được token từ Server!");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 w-full max-w-md">
        <h1 className="text-3xl font-black text-center text-orange-500 mb-8">Admin Login</h1>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
            <input 
              type="text" required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-orange-500"
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input 
              type="password" required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-orange-500"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}