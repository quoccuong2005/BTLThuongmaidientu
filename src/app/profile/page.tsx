'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Phone, Calendar, Shield,
  MapPin, Camera, Edit3, Settings,
  ShoppingBag, Heart, Star, ChevronRight, Loader2, CheckCircle2
} from 'lucide-react';
import { GetProfile, UpdateProfile, UploadImage, ChangePassword } from '@/app/api/user/user';
import { AddressController } from '@/controllers/AddressController';
import { Address } from '@/models/Address';
import { X } from 'lucide-react';
import { toast } from 'sonner';
export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    gender: '',
    dob: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchProfile = async (isSilent = false) => {
    const response = await GetProfile();
    if (response.success) {
      const userData = response.data.data;
      setUser(userData);
      setEditForm({
        name: userData.name || '',
        phone: userData.phone || '',
        gender: userData.gender || 'male',
        dob: userData.dob ? userData.dob.split('T')[0] : ''
      });

      // Lấy địa chỉ mặc định
      const addrList = await AddressController.getAddresses();
      const defaultAddr = addrList.find(a => a.is_default) || addrList[0] || null;
      setDefaultAddress(defaultAddr);
    } else if (!isSilent) {
      router.push('/login');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    // BƯỚC 1: Tải ảnh lên server để lấy URL
    const uploadRes = await UploadImage(file);

    if (uploadRes.success) {
      // Check if data is a string or an object containing the URL
      const rawData = uploadRes.data?.data;
      const imageUrl = typeof rawData === 'string' ? rawData : rawData?.url;

      console.log("Extracted Image URL:", imageUrl);

      if (imageUrl) {
        // BƯỚC 2: Cập nhật URL vào hồ sơ
        const response = await UpdateProfile({ avatar: imageUrl });

        if (response.success) {
          toast.success('Cập nhật ảnh đại diện thành công!');
          if (response.data?.data) {
            setUser(response.data.data);
          } else {
            fetchProfile(true);
          }
        } else {
          toast.error(response.message);
        }
      } else {
        toast.error("Không nhận được đường dẫn ảnh từ server!");
      }
    } else {
      toast.error(uploadRes.message);
    }

    setIsUploadingAvatar(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const response = await UpdateProfile(editForm);
    setIsUpdating(false);

    if (response.success) {
      // Check if server returned a new sessionId and update it
      const newSessionId = response.data?.data?.sessionId || response.data?.sessionId;
      if (newSessionId) {
        localStorage.setItem('sessionId', newSessionId);
      }

      // Update UI directly from response data to avoid extra API call
      if (response.data?.data) {
        setUser(response.data.data);
      }

      toast.success('Cập nhật hồ sơ thành công!');
      setIsEditModalOpen(false);
    } else {
      toast.error(response.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    setIsChangingPassword(true);
    const response = await ChangePassword({
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password
    });
    setIsChangingPassword(false);
    if (response.success) {
      toast.success('Đổi mật khẩu thành công!');
      setIsPasswordModalOpen(false);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } else {
      toast.error(response.message || 'Đổi mật khẩu thất bại!');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderText = (gender: string | null) => {
    if (gender === 'male') return 'Nam';
    if (gender === 'female') return 'Nữ';
    return 'Chưa cập nhật';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white pb-12">
      {/* Cover */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FB6A01] via-orange-500 to-rose-500">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="relative group">
                <div className="h-32 w-32 overflow-hidden rounded-[2rem] border-4 border-white bg-white p-1 shadow-2xl md:h-40 md:w-40">
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-orange-100 text-5xl font-black text-orange-600">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}

                    {isUploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Loader2 className="animate-spin text-white" size={32} />
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-xl transition hover:scale-105 hover:bg-orange-50 disabled:opacity-50"
                >
                  <Camera size={18} />
                </button>
              </div>

              <div className="pb-1 text-white">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black md:text-5xl">
                    {user.name}
                  </h1>

                  {user.login_streak > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-xl">
                      <Star size={12} fill="currentColor" />
                      Streak: {user.login_streak}
                    </span>
                  )}
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-orange-50">
                  @{user.username}
                  <span className="h-2 w-2 rounded-full bg-green-300" />
                  Đang hoạt động
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-5 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/25"
              >
                <Settings size={18} />
                Đổi mật khẩu
              </button>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#FB6A01] shadow-xl transition hover:-translate-y-0.5 hover:bg-orange-50"
              >
                <Edit3 size={18} />
                Sửa hồ sơ
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
                  Hồ sơ cá nhân
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Thông tin tài khoản
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    value: user.email,
                    color: 'bg-blue-50 text-blue-500',
                  },
                  {
                    icon: Phone,
                    label: 'Số điện thoại',
                    value: user.phone || 'Chưa cập nhật',
                    color: 'bg-green-50 text-green-500',
                  },
                  {
                    icon: Heart,
                    label: 'Giới tính',
                    value: getGenderText(user.gender),
                    color: 'bg-pink-50 text-pink-500',
                  },
                  {
                    icon: Calendar,
                    label: 'Ngày sinh',
                    value: formatDate(user.dob),
                    color: 'bg-yellow-50 text-yellow-600',
                  },
                  {
                    icon: Shield,
                    label: 'Ngày tham gia',
                    value: formatDate(user.created_at),
                    color: 'bg-purple-50 text-purple-500',
                  },
                  {
                    icon: Star,
                    label: 'Vai trò',
                    value: user.role_id === null ? 'Người dùng' : 'Quản trị viên',
                    color: 'bg-orange-50 text-orange-500',
                  },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
                  >
                    <div className={`rounded-xl p-2 ${item.color}`}>
                      <item.icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-400">
                        {item.label}
                      </p>
                      <p className="truncate text-sm font-bold text-slate-700">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>


          </aside>

          {/* Main content */}
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <MapPin size={26} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">
                      Địa chỉ mặc định
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-900">
                      Địa chỉ giao hàng
                    </h2>
                    <p className="text-sm text-slate-500">
                      Nơi nhận hàng mặc định của bạn
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/profile/addresses')}
                  className="inline-flex w-fit items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-5 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
                >
                  <Edit3 size={16} />
                  Tùy chỉnh
                </button>
              </div>

              {defaultAddress ? (
                <div className="rounded-[2rem] border border-dashed border-orange-200 bg-orange-50/60 p-6 md:p-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="flex items-center gap-2 text-xl font-black text-slate-900">
                            <User size={19} className="text-orange-500" />
                            {defaultAddress.recipient_name}
                          </h3>

                          {defaultAddress.is_default && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FB6A01] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                              <CheckCircle2 size={11} />
                              Mặc định
                            </span>
                          )}
                        </div>

                        <p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600">
                          <Phone size={16} className="text-orange-500" />
                          {defaultAddress.phone}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
                      <p className="text-base font-semibold leading-7 text-slate-700">
                        {defaultAddress.street}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {defaultAddress.ward}, {defaultAddress.district},{' '}
                        {defaultAddress.province}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-orange-200 bg-orange-50/60 p-8 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-orange-400 shadow-sm">
                    <MapPin size={42} />
                  </div>

                  <h3 className="mt-6 text-xl font-black text-slate-900">
                    Chưa có địa chỉ
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Bạn chưa có địa chỉ giao hàng nào. Thêm ngay để đặt hàng nhanh chóng hơn.
                  </p>

                  <button
                    onClick={() => router.push('/profile/addresses')}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#FB6A01] px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600"
                  >
                    Thêm địa chỉ ngay <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: ShoppingBag,
                  title: 'Đơn hàng',
                  desc: 'Theo dõi đơn mua',
                  href: '/orders',
                },
                {
                  icon: Heart,
                  title: 'Yêu thích',
                  desc: 'Sản phẩm đã lưu',
                  href: '/wishlist',
                },
                {
                  icon: Star,
                  title: 'Đánh giá',
                  desc: 'Nhận xét của bạn',
                  href: '/profile/reviews',
                },
              ].map(item => (
                <button
                  key={item.title}
                  onClick={() => router.push(item.href)}
                  className="group rounded-[1.5rem] border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <item.icon size={22} />
                  </div>
                  <p className="font-black text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
      {/* Profile Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => !isUpdating && setIsEditModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#FB6A01] via-orange-500 to-rose-500 p-6 text-white">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/20 blur-2xl" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-100">
                    Profile Settings
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Chỉnh sửa hồ sơ
                  </h2>
                  <p className="mt-1 text-sm text-orange-50">
                    Cập nhật thông tin cá nhân của bạn.
                  </p>
                </div>

                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-xl transition hover:bg-white/25 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    placeholder="Nhập họ tên của bạn"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">
                      Giới tính
                    </label>
                    <select
                      value={editForm.gender}
                      onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                      className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={editForm.dob}
                      onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
                      className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-7 flex gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 rounded-2xl bg-[#FB6A01] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:translate-y-0 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Đang lưu...
                    </span>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => !isChangingPassword && setIsPasswordModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-700 p-6 text-white">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-400/30 blur-2xl" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-orange-200 backdrop-blur-xl">
                    <Shield size={22} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-200">
                      Security
                    </p>
                    <h2 className="mt-1 text-2xl font-black">
                      Đổi mật khẩu
                    </h2>
                    <p className="mt-1 text-sm text-slate-300">
                      Mật khẩu mới phải có ít nhất 6 ký tự.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={isChangingPassword}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={passwordForm.current_password}
                    onChange={e =>
                      setPasswordForm({
                        ...passwordForm,
                        current_password: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={e =>
                      setPasswordForm({
                        ...passwordForm,
                        new_password: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={e =>
                      setPasswordForm({
                        ...passwordForm,
                        confirm_password: e.target.value,
                      })
                    }
                    className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:ring-4 ${passwordForm.confirm_password &&
                      passwordForm.confirm_password !== passwordForm.new_password
                      ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-500/10'
                      : 'border-slate-200 bg-slate-50 focus:border-orange-400 focus:bg-white focus:ring-orange-500/10'
                      }`}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    autoComplete="new-password"
                  />

                  {passwordForm.confirm_password &&
                    passwordForm.confirm_password !== passwordForm.new_password && (
                      <p className="mt-2 text-xs font-semibold text-red-500">
                        Mật khẩu không khớp
                      </p>
                    )}
                </div>
              </div>

              <div className="mt-7 flex gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordForm({
                      current_password: '',
                      new_password: '',
                      confirm_password: '',
                    });
                  }}
                  disabled={isChangingPassword}
                  className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 rounded-2xl bg-[#FB6A01] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:translate-y-0 disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Đang lưu...
                    </span>
                  ) : (
                    'Lưu mật khẩu'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* giữ nguyên 2 modal edit profile và đổi mật khẩu của bạn ở đây */}
    </main>

  );
}
