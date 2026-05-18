export interface RegisterUserState {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
}

export interface VerifyOtpState {
    email: string;
    otp: string;
}