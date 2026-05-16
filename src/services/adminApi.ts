const API_URL = '/api/proxy';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  
  // 🔴 THAY ĐỔI QUAN TRỌNG 1: Dùng 'x-auth-signature' theo đúng API document
  const headers: Record<string, string> = {
    ...(token ? { 'x-auth-signature': token } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();
  
  if (!response.ok) throw new Error(data.message || data.error || 'Lỗi từ máy chủ Backend!');
  return data;
}

export const adminApi = {
  // ================= 1. AUTH =================
  // 🔴 THAY ĐỔI QUAN TRỌNG 2: Nhận vào identifier và password
  login: (data: { identifier: string; password: string }) => 
    fetchWithAuth('/auth/admin/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => fetchWithAuth('/auth/admin/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => fetchWithAuth('/auth/admin/me', { method: 'GET' }),

  // ================= 2. CATEGORIES =================
  // (Nếu Backend có API GET /categories thì dùng, không thì tạm để đây)
  getCategories: () => fetchWithAuth('/categories', { method: 'GET' }), 
  createCategory: (data: any) => fetchWithAuth('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string | number, data: any) => fetchWithAuth(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCategory: (id: string | number) => fetchWithAuth(`/categories/${id}`, { method: 'DELETE' }),

  // ================= 3. PRODUCT LINES =================
  // GET: Lấy danh sách sản phẩm (Hỗ trợ phân trang, tìm kiếm)
  getProductLines: (params?: { page?: number; limit?: number; category_id?: number; keyword?: string; sort?: string; order?: string }) => {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchWithAuth(`/products${queryString}`, { method: 'GET' });
  },
  // GET: Lấy chi tiết 1 sản phẩm
  getProductLineDetail: (id: string | number) => fetchWithAuth(`/products/${id}`, { method: 'GET' }),
  createProductLine: (data: any) => fetchWithAuth('/products/admin', { method: 'POST', body: JSON.stringify(data) }),
  updateProductLine: (id: string | number, data: any) => fetchWithAuth(`/products/admin/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProductLine: (id: string | number) => fetchWithAuth(`/products/admin/${id}`, { method: 'DELETE' }),

  // ================= 5. PRODUCT IMAGES =================
  // GET: Lấy toàn bộ ảnh của 1 sản phẩm
  getProductImages: (productLineId: string | number) => fetchWithAuth(`/product-images/by-product-line/${productLineId}`, { method: 'GET' }),
  // GET: Lấy chi tiết 1 ảnh
  getProductImageDetail: (id: string | number) => fetchWithAuth(`/product-images/${id}`, { method: 'GET' }),
  createProductImage: (data: { product_line_id: number; url: string; sort_order?: number }) => 
    fetchWithAuth('/product-images', { method: 'POST', body: JSON.stringify(data) }),
  updateProductImage: (id: string | number, data: any) => fetchWithAuth(`/product-images/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProductImage: (id: string | number) => fetchWithAuth(`/product-images/${id}`, { method: 'DELETE' }),
  
  // ================= 4. VARIANTS (SKU) =================
  createVariant: (productLineId: string | number, data: any) => fetchWithAuth(`/admin/products/${productLineId}/variants`, { method: 'POST', body: JSON.stringify(data) }),
  getVariantDetail: (id: string | number) => fetchWithAuth(`/admin/products/variants/${id}`, { method: 'GET' }),
  updateVariant: (id: string | number, data: any) => fetchWithAuth(`/admin/products/variants/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteVariant: (id: string | number) => fetchWithAuth(`/admin/products/variants/${id}`, { method: 'DELETE' }),


  // ================= 6. ROLES =================
  getRoles: () => fetchWithAuth('/roles', { method: 'GET' }),
  getRoleDetail: (id: string | number) => fetchWithAuth(`/roles/${id}`, { method: 'GET' }),
  createRole: (data: any) => fetchWithAuth('/roles', { method: 'POST', body: JSON.stringify(data) }),
  updateRole: (id: string | number, data: any) => fetchWithAuth(`/roles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteRole: (id: string | number) => fetchWithAuth(`/roles/${id}`, { method: 'DELETE' }),
  assignRolePermissions: (id: string | number, permissionIds: number[]) => fetchWithAuth(`/roles/${id}/permissions`, { method: 'PATCH', body: JSON.stringify({ permissionIds }) }),


  // --- QUẢN LÝ ĐƠN HÀNG ---
  getOrders: (params?: { page?: number; limit?: number; status?: string; user_id?: number; sort?: string; order?: string }) => {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchWithAuth(`/admin/orders${queryString}`, { method: 'GET' });
  },
  getOrderDetail: (id: string | number) => fetchWithAuth(`/admin/orders/${id}`, { method: 'GET' }),
  updateOrderStatus: (id: string | number, status: string) => fetchWithAuth(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // ================= 7. UPLOAD =================
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file); // Đúng tên field 'file' theo doc của bạn
    return fetchWithAuth('/upload/image', { method: 'POST', body: formData });
  },


  // ================= 8. VOUCHERS (MÃ GIẢM GIÁ) =================
  getVouchers: () => fetchWithAuth('/admin/vouchers', { method: 'GET' }),
  createVoucher: (data: any) => fetchWithAuth('/admin/vouchers', { method: 'POST', body: JSON.stringify(data) }),
  updateVoucher: (id: string | number, data: any) => fetchWithAuth(`/admin/vouchers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteVoucher: (id: string | number) => fetchWithAuth(`/admin/vouchers/${id}`, { method: 'DELETE' }),
};