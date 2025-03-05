/** @format */

import { useContext } from "react";

import AuthContext from "../Context/Context";
import { Navigate, useLocation } from "react-router";
import Loading from "../Components/Loading";

const PrivateRoute = ({ children }) => {
  const { user, token, loading } = useContext(AuthContext);

  const location = useLocation();

  if (loading) return <Loading></Loading>;
  if (user.user_type === "superadmin" && token) {
    return children;
  }

  return <Navigate to='/' state={{ from: location.pathname }} replace />;
};

export default PrivateRoute;
