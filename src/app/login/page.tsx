"use client"
import React from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Github, Facebook } from 'lucide-react';
import { Loginuser } from '../api/login/login';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await Loginuser(formData);

    if (result.success) {
      toast.success('Đăng nhập thành công!');
      // Lưu thông tin vào localStorage
      localStorage.setItem('sessionId', result.data.data.sessionId);
      localStorage.setItem('user', JSON.stringify(result.data.data.user));

      // Chuyển hướng về trang chủ
      router.push('/');
      // Refresh trang để header cập nhật trạng thái (cách đơn giản nhất)
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      toast.error('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT HERO */}
        <section className="relative hidden overflow-hidden rounded-[2rem] shadow-2xl lg:block">
          {/* Background image */}
          <img
            src="./login-banner.png"
            alt="Login Background"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FB6A01]/85 via-orange-500/70 to-rose-500/80" />

          {/* Blur glow */}
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex min-h-[620px] flex-col justify-between p-10 text-white">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] backdrop-blur-xl">
                Welcome back
              </span>

              <h1 className="mt-8 max-w-xl text-5xl font-black leading-tight">
                Đăng nhập để săn deal nhanh hơn
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-orange-50">
                Theo dõi đơn hàng, lưu sản phẩm yêu thích, nhận voucher và mua sắm tiện lợi hơn trên ChoViet.
              </p>
            </div>


          </div>
        </section>

        {/* FORM */}
        <section className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900">
              Đăng nhập tài khoản
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Chưa có tài khoản?{' '}
              <Link
                href="/register"
                className="font-bold text-[#FB6A01] hover:text-orange-600"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-xl shadow-orange-500/10 sm:p-8">
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email hoặc tên đăng nhập
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-400" />

                  <input
                    value={formData.identifier}
                    onChange={handleInputChange}
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    required
                    className="block w-full rounded-2xl border border-orange-100 bg-orange-50/50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Mật khẩu
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-400" />

                  <input
                    value={formData.password}
                    onChange={handleInputChange}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-2xl border border-orange-100 bg-orange-50/50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-orange-200 text-[#FB6A01] focus:ring-orange-500"
                  />
                  Ghi nhớ đăng nhập
                </label>

                <a
                  href="#"
                  className="text-sm font-bold text-[#FB6A01] hover:text-orange-600"
                >
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center rounded-2xl bg-[#FB6A01] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Đăng nhập
                <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400">
                Hoặc tiếp tục với
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-3 transition hover:bg-slate-50"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
              </a>

              <a
                href="#"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-3 transition hover:bg-slate-50"
              >
                <Github className="h-5 w-5 text-slate-900" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
