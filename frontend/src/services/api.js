import axios from "axios";

const api = axios.create({
    baseURL: "https://college-placement-system-q3ay.onrender.com/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;