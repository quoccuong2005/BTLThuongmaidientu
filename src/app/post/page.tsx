'use client';
import { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { CATEGORIES } from '@/lib/db';

export default function PostPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('new');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Plus size={16} className="text-white" />
          </span>
          Đăng sản phẩm mới
        </h1>

        <div className="space-y-5">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh *</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer group">
              <Upload size={32} className="mx-auto text-gray-300 group-hover:text-orange-400 mb-2 transition-colors" />
              <p className="text-sm text-gray-500">Nhấn để tải ảnh lên</p>
              <p className="text-xs text-gray-400 mt-1">Tối đa 12 ảnh, mỗi ảnh dưới 10MB</p>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors"
            >
              <option value="">Chọn danh mục</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Nhập tên sản phẩm..."
              maxLength={100}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tình trạng *</label>
            <div className="rounded-xl border-2 border-orange-500 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700">
              Hàng mới chính hãng
            </div>
            <input type="hidden" value={condition} readOnly />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Giá bán *</label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Nhập giá..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">đ</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              placeholder="Mô tả chi tiết về sản phẩm..."
              maxLength={3000}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/3000</p>
          </div>

          {/* Submit */}
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-200 text-base">
            Đăng sản phẩm
          </button>
          <p className="text-xs text-center text-gray-400">
            Bằng cách đăng sản phẩm, bạn đồng ý với{' '}
            <a href="#" className="text-orange-500 hover:underline">Điều khoản sử dụng</a> của chúng tôi
          </p>
        </div>
      </div>
    </div>
  );
}
