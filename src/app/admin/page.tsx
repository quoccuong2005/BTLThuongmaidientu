'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus } from 'lucide-react';

export default function RolesAdminPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => { fetchRoles(); }, []);

  const fetchRoles = async () => {
    try {
      const res = await adminApi.getRoles();
      setRoles(res.data || res.items || res || []);
    } catch (error) { console.error(error); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createRole({ name });
      setName(''); fetchRoles();
    } catch (error: any) { alert(error.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa role này?')) return;
    try {
      await adminApi.deleteRole(id);
      fetchRoles();
    } catch (error: any) { alert(error.message); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Vai trò (Roles)</h1>
      <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-sm border mb-6 flex gap-4">
        <input type="text" placeholder="Tên Role..." required className="border p-2 rounded flex-1 focus:outline-orange-500" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2"><Plus size={18}/> Thêm</button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr><th className="p-4">Tên Vai trò</th><th className="p-4 text-right">Thao tác</th></tr>
          </thead>
          <tbody>
            {roles.map((role: any) => (
              <tr key={role.id} className="border-b">
                <td className="p-4 font-bold text-indigo-700">{role.name}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(role.id)} className="p-2 text-red-600 rounded"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}