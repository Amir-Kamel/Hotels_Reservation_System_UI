import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
    },
    timeout: 10000,
})

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


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refresh = localStorage.getItem('refresh');
                if (refresh) {
                    const response = await axios.post('http://127.0.0.1:8000/accounts/login/refresh/', {
                        refresh: refresh,
                    });
                    localStorage.setItem('access', response.data.access);
                    axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return axiosInstance(originalRequest); // Retry the original request
                } else {
                    // No refresh token available
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    window.location.href = '/login';
                }
            } catch (err) {
                // Refresh token is invalid or expired
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;



