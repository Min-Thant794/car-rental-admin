import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";
import { API_ROUTES } from "../config/config";

const UserContext = createContext();
const ADMIN_LOGGED_OUT_KEY = "carRentalAdminLoggedOut";

const markAdminLoggedOut = () => {
    try {
        localStorage.setItem(ADMIN_LOGGED_OUT_KEY, "true");
    } catch (error) {
        console.error("Unable to persist logout state:", error);
    }
};

const clearAdminLoggedOut = () => {
    try {
        localStorage.removeItem(ADMIN_LOGGED_OUT_KEY);
    } catch (error) {
        console.error("Unable to clear logout state:", error);
    }
};

const isAdminLoggedOut = () => {
    try {
        return localStorage.getItem(ADMIN_LOGGED_OUT_KEY) === "true";
    } catch (error) {
        console.error("Unable to read logout state:", error);
        return false;
    }
};

export const UserProvider = ({ children }) => {
    const [ userData, setUserData ] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if(isAdminLoggedOut()) {
                setUserData(null);
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(API_ROUTES.GET_CURRENT_ADMIN);
                const payload = response?.data;
                const user = payload?.data?.user ?? payload?.user ?? null;
                
                setUserData(user && !Array.isArray(user) ? user : null);
            } catch {
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        markAdminLoggedOut();
        setUserData(null);

        try {
            await axiosInstance.post(API_ROUTES.LOGOUT_USER);
        } catch (error) {
            console.error("Logout failed!", error);
        }
    };

    const changeUserData = (data) => {
        const user = data && !Array.isArray(data) ? data : null;

        if(user) {
            clearAdminLoggedOut();
        }

        setUserData(user);
    }

    return <UserContext.Provider value={{userData, setUserData, changeUserData, logout, loading}}>
        {children}
    </UserContext.Provider>
}

export const useUser = () => useContext(UserContext);
