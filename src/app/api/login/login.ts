import { LoginUser } from "@/models/loginuser";
import api from '@/lib/axios';
export async function Loginuser(user: LoginUser) {
    try {
        const response = await api.post('/auth/login', user);
        return { success: true, data: response.data };
    } catch (error: any) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Đăng nhập thất bại!"
            };
        }
        return { success: false, message: "Lỗi kết nối đến server" };
    }
}
