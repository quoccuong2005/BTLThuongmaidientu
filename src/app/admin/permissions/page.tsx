'use client';
import { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Trash2, Plus } from 'lucide-react';

export default function PermissionsAdminPage() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await adminApi.getPermissions();
      setPermissions(res.data || res);
    } catch (error) { console.error(error); }
  };

  const handleCreate = async () => {
    if (!name) return;
    try {
      await adminApi.createPermission({ name, description: 'Quyền hệ thống' });
      setName('');
      fetchData();
    } catch (error: any) { alert(error.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa quyền này?')) return;
    try {
      await adminApi.deletePermission(id);
      fetchData();
    } catch (error: any) { alert(error.message); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Quyền (Permissions)</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
        <input 
          type="text" placeholder="Tên Quyền (VD: CREATE_PRODUCT)..." 
          className="border p-2 rounded flex-1 focus:outline-orange-500"
          value={name} onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleCreate} className="bg-orange-500 text-white px-4 py-2 rounded">
          <Plus size={18} className="inline mr-1"/> Thêm
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr><th className="p-4">Tên Quyền</th><th className="p-4 text-right">Thao tác</th></tr>
          </thead>
          <tbody>
            {permissions.map((perm, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{perm.name}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(perm.id)} className="p-2 text-red-600 rounded">
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