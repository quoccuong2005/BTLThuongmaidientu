
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const sessionId = localStorage.getItem("sessionId");
        if (sessionId) {
            config.headers['x-auth-signature'] = sessionId;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;