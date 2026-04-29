import React from 'react'
import { ToastContainer } from 'react-toastify'
import { routes as baseRoutes } from './config/Routes'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
//import { getItemFromLocalStorage } from './helpers/helper'

const AdminProtectedRoute = () => {
  const { userData, loading } = useUser();

  if(loading) return null;

  if(!userData) return <Navigate to="/login" replace />

  return <Outlet/>;
}

const PublicOnlyRoute = () => {
  const { userData, loading } = useUser();

  if(loading) return null;

  if(userData) return <Navigate to="/dashboard" replace/>

  return <Outlet/>;
}

const AuthRedirect = () => {
  const { userData, loading } = useUser();

  if(loading) return null;

  return <Navigate to={userData ? "/dashboard" : "/login"} replace/>;
}

const loginRoute = baseRoutes.find((route) => route.path === "/login");
const mainRoute = baseRoutes.find((route) => route.path === "/");
const protectedMainRoute = mainRoute ? {
  ...mainRoute,
  children: mainRoute.children?.map((child) => {
    if(child.index || !child.path) return { ...child };

    return {
      ...child,
      path: child.path.replace(/^\/+/, ""),
    };
  }),
} : null;

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute/>,
    children: loginRoute ? [{ ...loginRoute }] : [],
  },
  {
    element: <AdminProtectedRoute/>,
    children: protectedMainRoute ? [protectedMainRoute] : [],
  },
  {
    path: "*",
    element: <AuthRedirect/>,
  },
]);

const AppContent = () => {
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
