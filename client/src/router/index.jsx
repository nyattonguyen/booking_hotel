import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import ErrorPage from "../pages/Error404";
import Home from "../pages/Home";
import AuthProvider from "../context";
import { CardDetail } from "../components/card/CardDetail";
import ProtectedRouter from "./ProtectedRouter";
import { Order } from "../components/order/Order";
import Profile from "../components/user/Profile";
const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Login />,
        path: "/login",
      },
      {
        element: <Home />,
        path: "/",
      },
      {
        element: <CardDetail />,
        path: `/hotel/:hotelId`,
      },
      {
        element: <Order />,
        path: "/order",
      },
      {
        element: <Profile />,
        path: "/profile/iduser",
      },
    ],
  },
]);
