'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RegisterUser } from '../api/register/register';
import { VerifyemailController } from '@/controllers/VerifyemailController';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await RegisterUser(formData);

    if (result.success) {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.');
      setRegisteredEmail(formData.email);
      setStep('verify');
    } else {
      toast.error(result.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error('Vui lòng nhập mã OTP');
      return;
    }

    const result = await VerifyemailController.verifyOtp({
      email: registeredEmail,
      otp,
    });

    if (result.success) {
      toast.success('Xác thực email thành công!');
      router.push('/login');
    } else {
      toast.error(result.message || 'Mã OTP không chính xác!');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden rounded-[2rem] shadow-2xl lg:block">
          <img
            src="./login-banner.png"
            alt="Register Background"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#FB6A01]/85 via-orange-500/70 to-rose-500/80" />
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative z-10 flex min-h-[700px] flex-col justify-between p-10 text-white">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] backdrop-blur-xl">
                {step === 'register' ? 'Create account' : 'Verify email'}
              </span>

              <h1 className="mt-8 max-w-xl text-5xl font-black leading-tight">
                {step === 'register'
                  ? 'Tạo tài khoản để mua sắm tiện lợi hơn'
                  : 'Xác thực email để hoàn tất đăng ký'}
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-orange-50">
                {step === 'register'
                  ? 'Lưu đơn hàng, nhận voucher độc quyền, theo dõi sản phẩm yêu thích và trải nghiệm hệ sinh thái mua sắm hiện đại của ChoViet.'
                  : 'Nhập mã OTP được gửi tới email của bạn để kích hoạt tài khoản và bắt đầu mua sắm.'}
              </p>
            </div>


          </div>
        </section>

        {/* RIGHT FORM */}
        <section className="mx-auto w-full max-w-lg">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900">
              {step === 'register' ? 'Đăng ký tài khoản mới' : 'Xác thực email'}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {step === 'register' ? (
                <>
                  Đã có tài khoản?{' '}
                  <Link
                    href="/login"
                    className="font-bold text-[#FB6A01] hover:text-orange-600"
                  >
                    Đăng nhập ngay
                  </Link>
                </>
              ) : (
                <>
                  Mã OTP đã được gửi tới{' '}
                  <span className="font-bold text-[#FB6A01]">
                    {registeredEmail}
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-xl shadow-orange-500/10 sm:p-8">
            {step === 'register' ? (
              <form className="space-y-5" onSubmit={handleRegister}>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Họ và tên
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-400" />

                    <input
                      value={formData.name}
                      onChange={handleInputChange}
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block w-full rounded-2xl border border-orange-100 bg-orange-50/50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Tên đăng nhập
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-400" />

                    <input
                      value={formData.username}
                      onChange={handleInputChange}
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="block w-full rounded-2xl border border-orange-100 bg-orange-50/50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      placeholder="nguyenvana"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Địa chỉ Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-400" />

                    <input
                      value={formData.email}
                      onChange={handleInputChange}
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full rounded-2xl border border-orange-100 bg-orange-50/50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Số điện thoại
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-400" />

                    <input
                      value={formData.phone}
                      onChange={handleInputChange}
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="block w-full rounded-2xl border border-orange-100 bg-orange-50/50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      placeholder="0901234567"
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
                      required
                      className="block w-full rounded-2xl border border-orange-100 bg-orange-50/50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm text-slate-600">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-orange-200 text-[#FB6A01] focus:ring-orange-500"
                  />

                  <span>
                    Tôi đồng ý với{' '}
                    <a href="#" className="font-bold text-[#FB6A01]">
                      Điều khoản dịch vụ
                    </a>{' '}
                    và{' '}
                    <a href="#" className="font-bold text-[#FB6A01]">
                      Chính sách bảo mật
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  className="group flex w-full items-center justify-center rounded-2xl bg-[#FB6A01] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600"
                >
                  Tạo tài khoản
                  <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleVerifyOtp}>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-orange-50 text-[#FB6A01]">
                  <ShieldCheck size={38} />
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-[#FB6A01]" />
                  <p className="mt-2 text-sm font-bold text-slate-800">
                    Tài khoản đã được tạo
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Vui lòng nhập mã OTP được gửi tới email để hoàn tất xác thực.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Email xác thực
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-400" />

                    <input
                      value={registeredEmail}
                      readOnly
                      className="block w-full rounded-2xl border border-orange-100 bg-orange-50/50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Mã OTP
                  </label>

                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    required
                    className="block w-full rounded-2xl border border-orange-100 bg-orange-50/50 px-4 py-4 text-center text-2xl font-black tracking-[0.5em] text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    placeholder="------"
                  />
                </div>

                <button
                  type="submit"
                  className="group flex w-full items-center justify-center rounded-2xl bg-[#FB6A01] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600"
                >
                  Xác thực email
                  <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="w-full text-sm font-bold text-slate-500 transition hover:text-[#FB6A01]"
                >
                  Quay lại chỉnh email
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}