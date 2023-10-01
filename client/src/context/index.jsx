import { createContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubcribed = auth.onIdTokenChanged((user) => {
      console.log("[From AuthProvider]", user);
      if (user != null && user?.uid) {
        setUser(user);
        setIsLoading(false);
        navigate("/");
        console.log("get out");
        return;
      }

      console.log("here");

      setIsLoading(false);
      setUser({});
      localStorage.clear();
      <Navigate to="/login" />;
    });

    return () => {
      unsubcribed();
    };
  }, [auth]);

  // Move the localStorage.setItem() call outside of the onIdTokenChanged listener
  console.log("c", user.accessToken);
  useEffect(() => {
    if (user?.accessToken !== localStorage.getItem("accessToken")) {
      localStorage.setItem("accessToken", user.accessToken);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? <CircularProgress /> : children}
    </AuthContext.Provider>
  );
}
