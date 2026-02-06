const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8100/api/v1";
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8100/";

export const API_ROUTES = {
    LOCAL_BASE_URL: API_BASE_URL,
    LOCAL_SERVER_URL: SERVER_URL,

    //user auth
    ADMIN_LOGIN: "/user/auth/admin/login",
    GET_AUTH_USER: "/user/auth/me",
    GET_ALL_USER: "/user",
    UPDATE_USER: "/user",
    POST_NEW_USER: "/user",

    //cars
    GET_ALL_CARS: "/cars",
    POST_NEW_CAR: "/cars",
    UPDATE_CAR: "/cars/id",
    DELETE_CAR: "/cars/id",

    //bookings
    GET_ALL_BOOKINGS: "/bookings",
    UPDATE_BOOKING: "/bookings/id",
    DELETE_BOOKING: "/bookings/id"
}
