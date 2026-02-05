import React, { useEffect, useMemo } from 'react'
import { ToastContainer } from 'react-toastify'
import { routes as baseRoutes } from './config/Routes'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
//import { getItemFromLocalStorage } from './helpers/helper'

const AdminProtectedRoute = ({ children }) => {
  const { userData, loading } = useUser();

  if(loading) return null;

  if(!userData) return <Navigate to="/login" replace />

  return children;
}

const AppContent = () => {
  const { userData, loading = false } = useUser();

  const router = useMemo(() => {
    const updatedRoutes = baseRoutes.map((route) => ({ ...route}));

    const mainIndex = updatedRoutes.findIndex((route) => route.path === "/");
    if(mainIndex !== -1) {
      const mainRoute = updatedRoutes[mainIndex];

      updatedRoutes[mainIndex] = {
        ...mainRoute,
        element: (
          <AdminProtectedRoute>
            {mainRoute.element}
          </AdminProtectedRoute>
        ),
      };
    }

    //handle unknown routes

    updatedRoutes.push({
      path: "*",
      element: loading ? null : userData ? <Navigate to= "/dashboard" replace /> : <Navigate to="/login" replace/>
    });

    return createBrowserRouter(updatedRoutes);
  }, [userData, loading]);

  return <RouterProvider router={router}/>
}

const App = () => {
  return (
    <UserProvider>
      <ToastContainer/>
      <AppContent/>
    </UserProvider>
  );
};

export default App