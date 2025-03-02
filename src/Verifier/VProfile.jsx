/** @format */

import { useContext } from "react";
import AuthContext from "../Context/Context";
import { useNavigate } from "react-router";

const VProfile = () => {
  const { logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logOutUser();
    navigate("/", { replace: true });
  };
  return (
    <div>
      <p>this is profile page</p>
      <button onClick={handleLogout} className='btn btn-primary'>
        Log Out
      </button>
    </div>
  );
};

export default VProfile;
