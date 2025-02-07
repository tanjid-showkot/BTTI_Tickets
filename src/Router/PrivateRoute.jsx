/** @format */

import { useContext, useEffect } from "react";

import AuthContext from "../Context/Context";
import { useNavigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  // Only return the children if the token exists
  if (token) {
    return children;
  }

  // Optionally, return null or a loader while the redirection occurs
  return null;
};

export default PrivateRoute;
