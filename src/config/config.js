const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8100/api/v1";
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "https://car-rental-backend-h2sh.onrender.com";

export const API_ROUTES = {
    LOCAL_BASE_URL: API_BASE_URL,
    SERVER_URL,

    //user auth
    ADMIN_LOGIN: "/user/auth/admin/login",
    GET_CURRENT_ADMIN: "/user/auth/admin/me",
    GET_ALL_USER: "/user",
    UPDATE_USER: "/user",
    POST_NEW_USER: "/user/user-create-by-admin",
    DELETE_USER: "/user",

    //cars
    GET_ALL_CARS: "/cars",
    POST_NEW_CAR: "/cars/create-car",
    UPDATE_CAR: "/cars",
    DELETE_CAR: "/cars",

    //bookings
    GET_ALL_BOOKINGS: "/bookings",
    UPDATE_BOOKING: "/bookings",
    DELETE_BOOKING: "/bookings"
}
