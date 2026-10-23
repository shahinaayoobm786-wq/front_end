import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Request Interceptor: Attach JWT Bearer token to all outgoing requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (
            token &&
            typeof token === "string" &&
            token.trim() &&
            token !== "null" &&
            token !== "undefined"
        ) {
            config.headers.Authorization = `Bearer ${token.trim()}`;
        } else {
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized & 403 Forbidden
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const token = localStorage.getItem("token");
            if (token) {
                console.warn("Session expired or unauthorized. Clearing stored token.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
