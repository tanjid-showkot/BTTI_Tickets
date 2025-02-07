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

  useEffect(() => {
    async () => {
      if (token) {
        setUser(await userVerify(token));
      }

      setLoading(false);
    };
  }, [token]);

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
