'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import {
  Package,
  Tags,
  ShoppingCart,
  TrendingUp,
  DollarSign
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import Link from 'next/link';

// Màu cho biểu đồ
const COLORS = [
  '#f97316',
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#ef4444',
  '#eab308',
  '#06b6d4'
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
  });

  const [pieData, setPieData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getProductLines()
      ]);

      // Lấy danh sách thật
      const catList = catRes?.data?.items || catRes?.items || catRes || [];
      const prodList = prodRes?.data?.items || prodRes?.items || prodRes || [];

      // Thống kê tổng
      setStats({
        categories: catList.length,
        products: prodList.length
      });

      // Thống kê sản phẩm theo danh mục
      const chartData = catList
        .map((cat: any) => {
          const count = prodList.filter(
            (p: any) =>
              p.category_id === cat.id ||
              p.categoryId === cat.id
          ).length;

          return {
            name: cat.name,
            value: count
          };
        })
        .filter((item: any) => item.value > 0);

      setPieData(chartData);

    } catch (error) {
      console.error('Lỗi lấy thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Tổng quan Hệ thống
        </h1>

        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* PRODUCTS */}
        <Link
          href="/admin/products"
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-orange-500 transition-colors">
              Tổng Dòng Sản Phẩm
            </p>

            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? '...' : stats.products}
            </h3>

            <p className="text-sm text-green-500 mt-2 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              Bấm để quản lý
            </p>
          </div>

          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package size={28} />
          </div>
        </Link>

        {/* CATEGORIES */}
        <Link
          href="/admin/categories"
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-blue-500 transition-colors">
              Tổng Danh Mục
            </p>

            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? '...' : stats.categories}
            </h3>

            <p className="text-sm text-green-500 mt-2 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              Bấm để quản lý
            </p>
          </div>

          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Tags size={28} />
          </div>
        </Link>

        {/* ORDERS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Đơn hàng mới
            </p>

            <h3 className="text-3xl font-bold text-gray-800">
              1,245
            </h3>

            <p className="text-sm text-green-500 mt-2 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              +5% tuần trước
            </p>
          </div>

          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <ShoppingCart size={28} />
          </div>
        </div>

        {/* REVENUE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Doanh thu tháng này
            </p>

            <h3 className="text-3xl font-bold text-gray-800">
              42Tr
            </h3>

            <p className="text-sm text-green-500 mt-2 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              +18% tháng trước
            </p>
          </div>

          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <DollarSign size={28} />
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Thống kê Sản phẩm/Danh mục
          </h3>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow:
                      '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />

                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  barSize={50}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Tỷ lệ Sản phẩm theo Danh mục
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Phân loại màu sắc theo từng nhóm hàng
          </p>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow:
                      '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />

                <Legend
                  iconType="circle"
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />

              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}