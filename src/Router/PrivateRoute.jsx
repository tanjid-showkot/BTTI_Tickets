/** @format */

import { useContext } from "react";

import AuthContext from "../Context/Context";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  const location = useLocation();

  // Only return the children if the token exists
  if (loading) return <p>Loading......</p>;
  if (user) {
    return children;
  }

  return <Navigate to='/' state={location.pathname} replace={true} />;
};

export default PrivateRoute;
