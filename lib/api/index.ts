import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/api',
    withCredentials: true, // your Laravel API
});

export default api;
