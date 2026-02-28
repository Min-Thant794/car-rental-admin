import axiosInstance from "../config/axiosInstance";
import { API_ROUTES } from "../config/config";

export const createCar = async (payload) => {
    try {
        const response = await axiosInstance.post(API_ROUTES.POST_NEW_CAR, payload);
        console.log("createCar() response: ", response);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at createCar()", error);
        return {
            success: false,
            message: error.response?.data.message || "Internal Server Error",
            error,
        }
    }
}

export const getAllCar = async (page = 1, limit = 10, q = "", mode = "contains") => {
    try {
        const response = await axiosInstance.get(API_ROUTES.GET_ALL_CARS, {
            params: { page, limit, q, mode }
        });
        console.log("Response all car: ", response.data);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at getAllCar()", error);
        return {
            success: false,
            message: error.response?.data.message || "Internal Server Error",
            error
        }
    }
}

export const updateCar = async(id, payload) => {
    try {
        const response = await axiosInstance.put(`${API_ROUTES.UPDATE_CAR}/${id}`, payload, {
            headers: payload instanceof FormData ? {"Content-Type" : "multipart/form-data"} : {}
        });
        console.log("updateCar() response: ", response);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at updateCar()", error);
        return {
            success: false,
            message: error.response?.data.message || "Internal Server Error",
            error
        }
    }
}

export const deleteCar = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_ROUTES.DELETE_CAR}/${id}`);
        console.log("deleteCar() response: ", response);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at deleteCar()", error);
        return {
            success: false,
            message: error.response?.data.message || "Internal Server Error",
            error
        }
    }
}