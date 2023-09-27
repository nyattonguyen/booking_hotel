import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import ErrorPage from "../pages/Error404";
import Home from "../pages/Home";
import AuthProvider from "../context";

const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default createBrowserRouter([
  {
    element: <AuthProvider />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Login />,
        path: "/login",
      },
      {
        element: <Home />,
        path: "/",
        // element: <ProtectedRoute />,
        // children: [
        //   {
        //     element: <Home />,
        //     path: "/",
        //     loader: folderLoader,
        //     children: [

        //     ],
        //   },
        // ],
      },
    ],
  },
]);
