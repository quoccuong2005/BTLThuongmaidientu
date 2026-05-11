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
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Cover Profile Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-48 md:h-64 relative">
        <div className="max-w-5xl mx-auto px-4 h-full relative">
          <div className="absolute -bottom-16 left-4 md:left-8 flex flex-col md:flex-row items-end gap-4 w-full">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl p-1.5 shadow-xl border-4 border-white overflow-hidden">
                <div className="w-full h-full bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-4xl md:text-5xl font-black relative overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="text-white animate-spin" size={32} />
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
                className="absolute bottom-2 right-2 p-2 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                <Camera size={18} />
              </button>
            </div>
            <div className="mb-2 md:mb-1 flex-1 ">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h1>
                {user.login_streak > 0 && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
                    <Star size={12} fill="currentColor" />
                    Streak: {user.login_streak}
                  </div>
                )}
              </div>
              <p className="text-gray-600 font-medium flex items-center gap-1">
                @{user.username} <span className="w-2 h-2 bg-green-500 rounded-full inline-block ml-1 animate-pulse"></span>
              </p>
            </div>
            <div className="hidden md:flex mb-4 gap-2">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-gray-700 font-bold shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Settings size={18} /> Đổi mật khẩu
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-xl text-white font-bold shadow-sm hover:bg-orange-600 transition-colors"
              >
                <Edit3 size={18} /> Sửa hồ sơ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isUpdating && setIsEditModalOpen(false)}
          ></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Họ và tên</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="Nhập họ tên của bạn"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Số điện thoại</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Giới tính</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-white appearance-none"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Ngày sinh</label>
                  <input
                    type="date"
                    value={editForm.dob}
                    onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:transform-none"
                >
                  {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isChangingPassword && setIsPasswordModalOpen(false)}
          />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Shield size={20} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Đổi mật khẩu</h2>
                  <p className="text-xs text-gray-400">Mật khẩu mới phải có ít nhất 6 ký tự</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                disabled={isChangingPassword}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {/* Mật khẩu hiện tại */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm ${passwordForm.confirm_password && passwordForm.confirm_password !== passwordForm.new_password
                      ? 'border-red-400 focus:ring-2 focus:ring-red-500/20 focus:border-red-400'
                      : 'border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                    }`}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  autoComplete="new-password"
                />
                {passwordForm.confirm_password && passwordForm.confirm_password !== passwordForm.new_password && (
                  <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
                  }}
                  disabled={isChangingPassword}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-60"
                >
                  {isChangingPassword ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Đang lưu...
                    </span>
                  ) : 'Lưu mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 mt-24">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Thông tin tài khoản</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-semibold text-gray-700 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 text-green-500 rounded-lg">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Số điện thoại</p>
                    <p className="text-sm font-semibold text-gray-700">{user.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-pink-50 text-pink-500 rounded-lg">
                    <Heart size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Giới tính</p>
                    <p className="text-sm font-semibold text-gray-700">{getGenderText(user.gender)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Ngày sinh</p>
                    <p className="text-sm font-semibold text-gray-700">{formatDate(user.dob)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Ngày tham gia</p>
                    <p className="text-sm font-semibold text-gray-700">{formatDate(user.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Vai trò</p>
                    <p className="text-sm font-semibold text-gray-700">{user.role_id === null ? 'Người dùng' : 'Quản trị viên'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Hoạt động</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className="text-gray-400 group-hover:text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">Tin đã đăng</span>
                  </div>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-500">0</span>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Heart size={18} className="text-gray-400 group-hover:text-red-500" />
                    <span className="text-sm font-medium text-gray-600">Yêu thích</span>
                  </div>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-500">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <MapPin size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900">Địa chỉ giao hàng</h4>
                    <p className="text-sm text-gray-500">Nơi nhận hàng mặc định của bạn</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/profile/addresses')}
                  className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-all flex items-center gap-2 border border-gray-100"
                >
                  <Edit3 size={16} />
                  Tùy chỉnh
                </button>
              </div>

              {defaultAddress ? (
                <div className="bg-gray-50/50 rounded-3xl p-8 border-2 border-dashed border-gray-100 flex-1 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-black text-gray-900 flex items-center gap-2">
                            <User size={18} className="text-gray-400" />
                            {defaultAddress.recipient_name}
                          </span>
                          {defaultAddress.is_default && (
                            <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm shadow-orange-100">
                              <CheckCircle2 size={10} />
                              Mặc định
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 font-bold">
                          <Phone size={16} className="text-gray-400" />
                          {defaultAddress.phone}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {defaultAddress.street}
                        <br />
                        <span className="text-gray-500 text-sm">
                          {defaultAddress.ward}, {defaultAddress.district}, {defaultAddress.province}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <MapPin size={40} className="text-orange-200" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Chưa có địa chỉ</h4>
                  <p className="text-gray-500 text-center max-w-xs mb-8">
                    Bạn chưa có địa chỉ giao hàng nào. Thêm ngay để đặt hàng nhanh chóng hơn!
                  </p>
                  <button 
                    onClick={() => router.push('/profile/addresses')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    Thêm địa chỉ ngay <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>

  );
}
