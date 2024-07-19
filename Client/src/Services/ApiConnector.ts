import axios from 'axios';
import { BASE_URL } from './Api';

axios.defaults.withCredentials = true;

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers : {'Access-Control-Allow-Origin' : '*','Content-Type':'application/json'}
});

export default apiClient;
