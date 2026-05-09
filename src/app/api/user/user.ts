import { User } from "@/models/User";
import api from "@/lib/axios";

export async function GetProfile() {
    try {

        const response = await api.get('/users/me');
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("GetProfile error:", error.response?.data || error.message);
        if (error.response) {
            return {
                success: false,
                message: error.response.data?.message || "Lấy thông tin thất bại!"
            };
        }
        return { success: false, message: "Lỗi kết nối đến server" };
    }
}

export async function UpdateProfile(userData: any) {
    try {
        const response = await api.patch('/users/me', userData);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("UpdateProfile error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Cập nhật thất bại!"
        };
    }
}

export async function UploadImage(file: File) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("UploadImage error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Tải ảnh lên thất bại!"
        };
    }
}

export async function ChangePassword(data: any) {
    try {
        const response = await api.patch('/users/me/password', data);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("ChangePassword error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Thay đổi mật khẩu thất bại!"
        };
    }
}