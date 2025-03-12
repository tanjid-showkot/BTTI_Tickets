/** @format */

// OnlineStatus.jsx
import { useState, useEffect } from "react";
import isOnline from "is-online";
import { Navigate } from "react-router";

const OnlineStatus = ({ children }) => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      const online = await isOnline();
      setIsConnected(online);
      if (!online) {
        <Navigate
          to='/no-internet'
          state={{ from: location.pathname }}
          replace
        />; // Redirect to 'No Internet' page if offline
      }
    };

    checkConnection();

    // Optionally, you could set up an interval to check periodically.
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return isConnected ? children : null; // Render children if connected, otherwise nothing
};

export default OnlineStatus;
