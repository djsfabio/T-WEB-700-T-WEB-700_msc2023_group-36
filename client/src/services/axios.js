//a deplacer dans un fichier config
import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: process.env.SERVER_URL || 'http://localhost:9000/',
    withCredentials: true,
});

export default axiosInstance;