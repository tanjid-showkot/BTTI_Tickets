/** @format */

import { createContext, useEffect, useState } from "react";
import { signIn, VerifyToken } from "../Api/Api";

const AuthContext = createContext();
export const Context = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const userVerify = async (token) => {
    setLoading(true);
    try {
      await VerifyToken(token)
        .then((res) => res.json())
        .then((data) => {
          if (data.user.user_type === "admin") {
            setUser(data.user);
            setError(null);
            setToken(token);
            localStorage.setItem("token", token);
          } else if (data.user.user_type === "verifier") {
            setUser(data.user);
            setError(null);
            setToken(token);
            localStorage.setItem("token", token);
          } else {
            console.log("arrived here");
            setError("You are not authorized to access this page");

            // logOutUser();
          }
        });
    } catch (error) {
      setError(error.message);
      logOutUser();
    }
  };

  const UserLogin = async (data) => {
    setLoading(true);
    try {
      await signIn(data)
        .then((res) => res.json())
        .then(async (data) => {
          await userVerify(data.token);
        });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logOutUser = () => {
    setToken(null);
    setUser({});
    localStorage.removeItem("token");
  };

  const checkAuthState = async () => {
    setLoading(true);
    // const storedToken = localStorage.getItem("token");
    try {
      if (token) {
        setToken(token);
        await userVerify(token);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      setUser(null);
      setLoading(false);
    }
  };

  // 🔥 Run this when the app loads to check if user is already logged in
  useEffect(() => {
    checkAuthState();
  }, [token]);

  const contextInfo = {
    token,
    user,
    error,
    setError,
    loading,
    UserLogin,
    logOutUser,
    userVerify,
    setLoading,
  };
  return (
    <AuthContext.Provider value={contextInfo}>{children}</AuthContext.Provider>
  );
};
export default AuthContext;
