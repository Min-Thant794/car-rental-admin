import { FaBook, FaCar, FaHome, FaUser } from "react-icons/fa"
import { IoIosSettings } from "react-icons/io"
import { Navigate } from "react-router-dom"
import MainLayout from "../layout/MainLayout"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Car from "../pages/Car"
import Booking from "../pages/Booking"
import ManageUsers from "../pages/ManageUsers"

export const routes = [
    {
        name: "Login",
        path: "/login",
        element: <Login/>
    },
    {
        name: "Main",
        path: "/",
        element: <MainLayout/>,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard"/>
            },
            {
                name: "Dashboard",
                path: "/dashboard",
                element: <Dashboard/>,
                icon: <FaHome/>
            },
            {
                name: "Car",
                path: "/car",
                element: <Car/>,
                icon: <FaCar/>
            },
            {
                name: "Booking",
                path: "/booking",
                element: <Booking/>,
                icon: <FaBook/>
            },
            {
                name: "Manage Users",
                path: "/manage-users",
                element: <ManageUsers/>,
                icon: <FaUser/>
            },
        ]
    }
]