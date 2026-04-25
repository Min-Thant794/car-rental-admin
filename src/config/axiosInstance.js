import axios from "axios";
import {API_ROUTES} from './config';

const axiosInstance = axios.create({
    baseURL: API_ROUTES.SERVER_URL,
    withCredentials: true,
    //timeout: 10000
});

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error?.response?.status;

        if(status === 401) {
            if(window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        if(status === 403) {
            console.log("Forbidden: you don't have permission!");
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;