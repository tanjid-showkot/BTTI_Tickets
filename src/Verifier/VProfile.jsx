/** @format */

import { useContext } from "react";
import AuthContext from "../Context/Context";
import { useNavigate } from "react-router";
import avatar from "/account.png";
import logOut from "/logout.png";

const VProfile = () => {
  const { logOutUser, user } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();
  const handleLogout = () => {
    logOutUser();
    navigate("/", { replace: true });
  };
  return (
    <div>
      <div className='bg-blue-100 m-4 p-2 rounded-2xl flex  items-center'>
        <img src={avatar} alt='' />
        <div className='ms-4'>
          <p className=' capitalize font-medium text-xl'>{user.name}</p>
          <p className=' capitalize font-medium text-md'>{user.user_type}</p>
        </div>
      </div>
      <div
        onClick={handleLogout}
        className='bg-blue-100 btn m-4 p-4 rounded-2xl flex  gap-4 items-center'>
        <img src={logOut} alt='' />

        <p className=' capitalize font-medium text-xl'>Log Out</p>
      </div>
    </div>
  );
};

export default VProfile;
