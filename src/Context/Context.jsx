/** @format */

import { createContext, useEffect, useState } from "react";
import { signIn, VerifyToken } from "../Api/Api";

const AuthContext = createContext();
export const Context = ({ children }) => {
  const [token, setToken] = useState(() => {
    localStorage.getItem("token") || null;
  });

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const userVerify = async (token) => {
    try {
      await VerifyToken(token)
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
          setError(null);
        });
    } catch (error) {
      setError(error.message);
      logOutUser();
    }
  };
  const UserLogin = async (data) => {
    try {
      await signIn(data)
        .then((res) => res.json())
        .then(async (data) => {
          await userVerify(data.token);
          setToken(data.token);
          localStorage.setItem("token", data.token);
          setError(null);
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
    try {
      const storeToken = localStorage.getItem("token");
      if (storeToken) {
        await VerifyToken(storeToken)
          .then((res) => res.json())
          .then((data) => {
            console.log(data.user);
            setUser(data.user);
          });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      setUser(null);
    }
    setLoading(false);
  };

  // 🔥 Run this when the app loads to check if user is already logged in
  useEffect(() => {
    checkAuthState();
  }, []);

  const contextInfo = {
    token,
    user,
    error,
    loading,
    UserLogin,
    logOutUser,
    userVerify,
  };
  return (
    <AuthContext.Provider value={contextInfo}>{children}</AuthContext.Provider>
  );
};
export default AuthContext;
