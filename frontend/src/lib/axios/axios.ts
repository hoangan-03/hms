import axios from 'axios';

const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    // 'ngrok-skip-browser-warning': '69420',
};

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: defaultHeaders,
});

export {axiosInstance, defaultHeaders};
