import axiosInstance from "../config/axiosInstance";
import { API_ROUTES } from "../config/config";

export const getAllBooking = async () => {
    try {
        const response = await axiosInstance.get(API_ROUTES.GET_ALL_BOOKINGS);
        console.log("getAllBooking() reponse: ", response);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at getAllBooking()", error);
        return {
            success: false,
            message: error.response?.message || "Internal Server Error",
            error
        }
    }
}

export const updateBooking = async (id, payload) => {
    try {
        const response = await axiosInstance.patch(`${API_ROUTES.UPDATE_BOOKING}/${id}`, payload);
        console.log("updateBooking() response: ", response);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at updateBooking()", error);
        return {
            success: false,
            message: error.response?.message || "Internal Server Error",
            error
        }
    }    
}

export const deleteBooking = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_ROUTES.DELETE_BOOKING}/${id}`);
        console.log("deleteBooking() response: ", response);
        return response.data;
    } catch (error) {
        console.log("An Error Occurred at deleteBooking()", error);
        return {
            success: false,
            message: error.response?.message || "Internal Server Error",
            error
        }
    }
}