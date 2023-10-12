import { createContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import clientAxios from "../api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  let idCurrentUser = localStorage.getItem("userId");
  const auth = getAuth();
  useEffect(() => {
    const unsubcribed = auth.onIdTokenChanged((user) => {
      if (user != null && user?.uid) {
        setUser(user);
        setIsLoading(false);
        navigate("/");
        return;
      } else {
        if (!user?.uid) {
          clientAxios
            .get(`/user/me/${idCurrentUser}`)
            .then((res) => {
              const user = res.data.user;
              if (user != null && user?._id) {
                setUser(user);
              }
            })
            .catch((err) => console.log(err));
        }
      }

      setIsLoading(false);
      setUser({});
      localStorage.clear();
      navigate("/login");
    });

    return () => {
      unsubcribed();
    };
  }, [auth]);

  // Move the localStorage.setItem() call outside of the onIdTokenChanged listener
  useEffect(() => {
    if (user?.accessToken !== localStorage.getItem("accessToken")) {
      localStorage.setItem("accessToken", user.accessToken);
    }
  }, [user, idCurrentUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, idCurrentUser }}>
      {isLoading ? <CircularProgress /> : children}
    </AuthContext.Provider>
  );
}
