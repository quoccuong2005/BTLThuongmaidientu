'use client';
import { useState, useEffect } from 'react';
import { Address, AddressInput } from '@/models/Address';
import { AddressController } from '@/controllers/AddressController';
import { AddressModal } from '@/components/profile/AddressModal';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    const data = await AddressController.getAddresses();
    setAddresses(data);
    setIsLoading(false);
  };

  const handleAddClick = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: AddressInput) => {
    if (editingAddress) {
      const updated = await AddressController.updateAddress(editingAddress.id, formData);
      if (updated) {
        toast.success('Cập nhật địa chỉ thành công');
        fetchAddresses();
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật');
      }
    } else {
      const created = await AddressController.createAddress(formData);
      if (created) {
        toast.success('Thêm địa chỉ thành công');
        fetchAddresses();
      } else {
        toast.error('Có lỗi xảy ra khi thêm địa chỉ');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      const success = await AddressController.deleteAddress(id);
      if (success) {
        toast.success('Xóa địa chỉ thành công');
        setAddresses(addresses.filter((a) => a.id !== id));
      } else {
        toast.error('Không thể xóa địa chỉ');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <MapPin className="text-orange-500" />
            Địa chỉ của tôi
          </h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các địa chỉ nhận hàng của bạn</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-orange-100 active:scale-95"
        >
          <Plus size={20} />
          <span>Thêm địa chỉ mới</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-orange-200" />
          </div>
          <p className="text-gray-400 font-medium">Bạn chưa có địa chỉ nào được lưu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white p-6 rounded-3xl border-2 transition-all ${
                address.is_default ? 'border-orange-500' : 'border-gray-50 hover:border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 font-black text-gray-900">
                      <User size={16} className="text-gray-400" />
                      {address.recipient_name}
                    </span>
                    {address.is_default && (
                      <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Phone size={14} />
                    {address.phone}
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {address.street}
                    <br />
                    {address.ward}, {address.district}, {address.province}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(address)}
                    className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingAddress}
        title={editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
      />
    </div>
  );
}
