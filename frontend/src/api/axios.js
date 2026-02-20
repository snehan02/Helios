import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle retries for 500 errors (cold starts)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        // If it's a 500 error and we haven't retried too many times
        if (response?.status === 500 && !config._retryCount) {
            config._retryCount = (config._retryCount || 0) + 1;

            if (config._retryCount <= 2) {
                console.log(`Retrying request due to server error (cold start?): ${config.url}`);
                // Backoff delay
                await new Promise(resolve => setTimeout(resolve, 1000 * config._retryCount));
                return api(config);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
