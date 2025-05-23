import axios from 'axios';

const apis = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
});

apis.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apis;

