import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";
import { API_ROUTES } from "../config/config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [ userData, setUserData ] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_ROUTES.GET_AUTH_USER);
                const payload = response?.data;
                const user = payload?.data?.user ?? payload?.user ?? null;
                
                setUserData(user && !Array.isArray(user) ? user : null);
            } catch (error) {
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await axiosInstance.post("/user/auth/logout");
        } catch (error) {
            console.error("Logout failed!");
        }

        setUserData(null);
    };

    const changeUserData = (data) => {
        setUserData(data);
    }

    return <UserContext.Provider value={{userData, setUserData, changeUserData, logout, loading}}>
        {children}
    </UserContext.Provider>
}

export const useUser = () => useContext(UserContext);