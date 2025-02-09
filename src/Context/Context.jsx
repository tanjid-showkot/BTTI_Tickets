/** @format */

import { createContext, useEffect, useState } from "react";
import { signIn, VerifyToken } from "../Api/Api";

const AuthContext = createContext();
export const Context = ({ children }) => {
  const [token, setToken] = useState(() => {
    localStorage.getItem("token") || "";
  });
  console.log(localStorage.getItem("token"));
  console.log(token);
  const [server, setServer] = useState(null);
  const [btConnected, setbtConnected] = useState(false);
  const [characteristics, setCharacteristics] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455";

  useEffect(() => {
    if (btConnected) {
      const savedServer = localStorage.getItem("printerServer");
      if (savedServer) {
        setServer(savedServer); // Set the saved server to state
        setbtConnected(true); // Assume we are connected
        getCharacteristics(savedServer); // Retrieve characteristics after reconnecting
      }
    }
  }, [btConnected]);

  const connectToPrinter = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [UUID],
      });

      console.log("Printer device selected:", device.name);

      const gattServer = await device.gatt.connect();
      setServer(gattServer);
      localStorage.setItem("printerServer", JSON.stringify(gattServer));
      console.log("Connected to GATT server:", gattServer);
      await getCharacteristics(gattServer);
    } catch (error) {
      console.error("Error connecting to printer:", error);
    }
  };

  const getCharacteristics = async (gattServer) => {
    try {
      if (!gattServer || !gattServer.connected) {
        console.error("GATT server is not connected yet.");
        return;
      }
      console.log("Attempting to get primary service");
      const service = await gattServer.getPrimaryService(UUID);
      console.log("Service found:", service);
      const characs = await service.getCharacteristics();
      console.log("Characteristics found:", characs);
      setCharacteristics(characs);
      setbtConnected(true);
    } catch (error) {
      console.error("Error finding characteristics:", error);
    }
  };

  const disconnectPrinter = () => {
    if (server && server.connected) {
      server.disconnect();
      setbtConnected(false);
      localStorage.removeItem("printerServer");
      console.log("Disconnected from printer");
    }
  };

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
        setToken(storeToken);
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
    disconnectPrinter,
    connectToPrinter,
    btConnected,
    server,
    characteristics,
  };
  return (
    <AuthContext.Provider value={contextInfo}>{children}</AuthContext.Provider>
  );
};
export default AuthContext;
