import axiosInstance from "../config/axiosInstance";
import { API_ROUTES } from "../config/config";

export const createUser = async (payload) => {
    try {
        const response = await axiosInstance.post(API_ROUTES.POST_NEW_USER, payload);
        console.log("createUser() reposne: ", response.data);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at createUser()", error);
        
        return {
            success: false,
            message: error.response?.data.message || "Internal Server Error",
            error
    }
    }
}

export const getAllUser = async() => {
    try {
        const response = await axiosInstance.get(API_ROUTES.GET_ALL_USER);
        console.log("getAllUser() resposne: ", response);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at getAllUser()", error);

        return {
            success: false,
            message: error.response?.data.message || "Internal Server Error!",
            error
        }
    }
}

export const getCurrentAdmin = async (params) => {
    try {
        const response = await axiosInstance.get(API_ROUTES.GET_CURRENT_ADMIN);
        console.log("getCurrentAdmin() response: ", response);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at getCurrentAdmin()", error);
        return {
            success: false,
            message: error.response?.data.message || "Internal Server Error!",
            error
        }
    }
}

export const updateUserData = async (id, payload) => {
    try {
        const response = await axiosInstance.put(`${API_ROUTES.UPDATE_USER}/${id}`, payload);
        console.log("updateUserData() response: ", response);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at updateUserData()", error);

        return {
            success: false,
            message: error.response?.data.message || "Internal Server Error!",
            error
        }
    }
}