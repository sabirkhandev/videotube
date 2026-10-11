import axios from "axios"

const api = axios.create({
    baseURL: "/api/v1",//import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1",
    withCredentials: true
})

export default api