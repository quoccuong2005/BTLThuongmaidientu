import { RegisterUserState } from "@/models/registeruser";
import axios from "axios";
import api from '@/lib/axios';

export async function RegisterUser(user: RegisterUserState) {
    try {
        const response = await api.post('/auth/register', user);
        return { success: true, data: response.data };
    } catch (error: any) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Đăng ký thất bại!"
            };
        }
        return { success: false, message: "Lỗi kết nối đến server" };
    }
}