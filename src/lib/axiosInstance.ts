import axios from 'axios';

// You can store the token in localStorage or cookies
const getToken = () =>
{
    if (typeof window !== 'undefined')
    {
        return localStorage.getItem('token');
    }
    return null;
};

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '', // optional
});

// ✅ Request interceptor — attach JWT token
axiosInstance.interceptors.request.use(
    (config) =>
    {
        const token = getToken();
        if (token && config.headers)
        {
            config.headers.token = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🚫 Response interceptor — handle 401/403 globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
    {
        if (error.response?.status === 401 || error.response?.status === 403)
        {
            // Optional: auto-logout, redirect
            console.warn('Unauthorized or forbidden - logging out');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
