'use client';
import { useState, useEffect } from 'react';
import { Address, AddressInput } from '@/models/Address';
import { LocationController, Province, District, Ward } from '@/controllers/LocationController';
import { X, ChevronDown } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: AddressInput) => Promise<void>;
  initialData?: Address | null;
  title: string;
}

export function AddressModal({ isOpen, onClose, onSubmit, initialData, title }: AddressModalProps) {
  const [formData, setFormData] = useState<AddressInput>({
    recipient_name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    street: '',
    is_default: false,
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<number | ''>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | ''>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await LocationController.getProvinces();
      setProvinces(data);
    };
    fetchProvinces();
  }, []);

  // Sync initial data or reset
  useEffect(() => {
    if (initialData) {
      setFormData({
        recipient_name: initialData.recipient_name,
        phone: initialData.phone,
        province: initialData.province,
        district: initialData.district,
        ward: initialData.ward,
        street: initialData.street,
        is_default: !!initialData.is_default, // Ép kiểu boolean tại đây
      });
    } else {
      setFormData({
        recipient_name: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        street: '',
        is_default: false,
      });
      setSelectedProvinceId('');
      setSelectedDistrictId('');
      setDistricts([]);
      setWards([]);
    }
  }, [initialData, isOpen]);

  // Handle Province change
  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = Number(e.target.value);
    const provinceName = provinces.find(p => p.PROVINCE_ID === provinceId)?.PROVINCE_NAME || '';

    setSelectedProvinceId(provinceId);
    setFormData({ ...formData, province: provinceName, district: '', ward: '' });

    // Reset district/ward lists
    setDistricts([]);
    setWards([]);

    if (provinceId) {
      const data = await LocationController.getDistricts(provinceId);
      setDistricts(data);
    }
  };

  // Handle District change
  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = Number(e.target.value);
    const districtName = districts.find(d => d.DISTRICT_ID === districtId)?.DISTRICT_NAME || '';

    setSelectedDistrictId(districtId);
    setFormData({ ...formData, district: districtName, ward: '' });
    setWards([]);

    if (districtId) {
      const data = await LocationController.getWards(districtId);
      setWards(data);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 relative top-[8%]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Họ và tên</label>
              <input
                required
                type="text"
                value={formData.recipient_name}
                onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Số điện thoại</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                placeholder="0901234567"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Tỉnh / Thành phố</label>
            <div className="relative">
              <select
                required
                value={selectedProvinceId}
                onChange={handleProvinceChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all appearance-none bg-white"
              >
                <option value="">Chọn Tỉnh / Thành phố</option>
                {provinces.map((p) => (
                  <option key={p.PROVINCE_ID} value={p.PROVINCE_ID}>
                    {p.PROVINCE_NAME}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Quận / Huyện</label>
              <div className="relative">
                <select
                  required
                  disabled={!selectedProvinceId}
                  value={selectedDistrictId}
                  onChange={handleDistrictChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn Quận / Huyện</option>
                  {districts.map((d) => (
                    <option key={d.DISTRICT_ID} value={d.DISTRICT_ID}>
                      {d.DISTRICT_NAME}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Phường / Xã</label>
              <div className="relative">
                <select
                  required
                  disabled={!selectedDistrictId}
                  value={wards.find(w => w.WARDS_NAME === formData.ward)?.WARDS_ID || ''}
                  onChange={(e) => {
                    const wardName = wards.find(w => w.WARDS_ID === Number(e.target.value))?.WARDS_NAME || '';
                    setFormData({ ...formData, ward: wardName });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn Phường / Xã</option>
                  {wards.map((w) => (
                    <option key={w.WARDS_ID} value={w.WARDS_ID}>
                      {w.WARDS_NAME}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Địa chỉ cụ thể</label>
            <textarea
              required
              rows={2}
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
              placeholder="Số nhà, tên đường..."
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
            />
            <label htmlFor="is_default" className="text-sm font-medium text-gray-700 cursor-pointer">
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
