import axios from "axios";
import { API_BASE_URL } from "../config";

const token = localStorage.getItem('token');
console.log("toekn api = ", token);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
});

export default api;