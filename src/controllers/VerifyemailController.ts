import { VerifyOtpState } from '../models/registeruser';
import api from '@/lib/axios';


export class VerifyemailController {
    static async verifyOtp(otpState: VerifyOtpState): Promise<{ success: boolean, message: string }> {
        try {
            const response = await api.post('/verify-otp', otpState);
            return { success: true, message: response.data?.message || 'Xác thực OTP thành công!' };
        } catch (error: any) {
            console.error('Error verifying OTP:', error);
            if (error.response?.data?.message) {
                return { success: false, message: error.response.data.message };
            }
            return { success: false, message: 'Đã xảy ra lỗi khi xác thực OTP.' };
        }
    }
}