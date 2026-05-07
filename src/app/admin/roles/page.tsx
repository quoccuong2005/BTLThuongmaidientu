'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus, ShieldCheck } from 'lucide-react';

export default function RolesAdminPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [roleName, setRoleName] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await adminApi.getRoles();
      setRoles(res.data || res);
    } catch (error) { console.error(error); }
  };

  const handleCreate = async () => {
    if (!roleName) return;
    try {
      await adminApi.createRole({ name: roleName });
      setRoleName('');
      fetchData();
    } catch (error: any) { alert(error.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Cảnh báo: Xóa vai trò sẽ ảnh hưởng tới các user đang giữ vai trò này. Tiếp tục?')) return;
    try {
      await adminApi.deleteRole(id);
      fetchData();
    } catch (error: any) { alert(error.message); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Vai trò (Roles)</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
        <input 
          type="text" placeholder="Tên Role (VD: SUPER_ADMIN, MODERATOR)..." 
          className="border p-2 rounded flex-1 focus:outline-orange-500"
          value={roleName} onChange={(e) => setRoleName(e.target.value)}
        />
        <button onClick={handleCreate} className="bg-orange-500 text-white px-4 py-2 rounded">
          <Plus size={18} className="inline mr-1"/> Thêm Role
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr><th className="p-4">Tên Vai trò</th><th className="p-4 text-right">Thao tác</th></tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold text-indigo-700">{role.name}</td>
                <td className="p-4 text-right">
                  <button className="p-2 text-indigo-600 mr-2 rounded hover:bg-indigo-50" title="Gán quyền cho Role này">
                    <ShieldCheck size={18} />
                  </button>
                  <button onClick={() => handleDelete(role.id)} className="p-2 text-red-600 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}