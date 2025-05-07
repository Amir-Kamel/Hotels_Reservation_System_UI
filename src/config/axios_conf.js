import axios from 'axios';

// Dynamically set the base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production' 
  ? "https://hotels-reservation-system-api.onrender.com" 
  : "http://127.0.0.1:8000";

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Sending token:', config.headers['Authorization']);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor with public page handling
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if request is already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh = localStorage.getItem('refresh');
                if (refresh) {
                    const response = await axios.post(`${baseURL}/accounts/login/refresh/`, {
                        refresh: refresh,
                    });
                    localStorage.setItem('access', response.data.access);
                    axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return axiosInstance(originalRequest); // Retry original request
                } else {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');

                    // 🚫 Don't redirect if it's a public page
                    const isPublicPath = originalRequest.url === '/' || originalRequest.url.startsWith('/hotels/');
                    if (!isPublicPath) {
                        window.location.href = '/login';
                    }
                }
            } catch (err) {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');

                // 🚫 Don't redirect if it's a public page
                const isPublicPath = originalRequest.url === '/' || originalRequest.url.startsWith('/hotels/');
                if (!isPublicPath) {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export { baseURL };
export default axiosInstance;
