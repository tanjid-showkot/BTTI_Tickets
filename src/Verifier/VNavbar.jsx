/** @format */
import { NavLink, useNavigate } from "react-router";
import logo from "/BRTC Logo.png";
import { useContext } from "react";
import AuthContext from "../Context/Context";

const VNavbar = () => {
  const { logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logOutUser();
    navigate("/", { replace: true });
  };

  return (
    <div>
      <div className='navbar bg-base-100 shadow-sm'>
        <div className='navbar-start w-[90%] lg:w-[50%]    '>
          <p className=' font-black flex gap-2 items-center text-xl '>
            <span>
              <img src={logo} className='w-8' alt='' />
            </span>{" "}
            <span className='truncate overflow-hidden w-[80%] lg:w-full  text-ellipsis'>
              বিআরটিসি তেজগাঁও ট্রেনিং ইন্সটিটিউট
            </span>
          </p>
        </div>
        <div className='navbar-end w-[20%] lg:w-[50%]'>
          <ul className='menu menu-horizontal px-1 font-bold lg:flex hidden '>
            <li>
              <NavLink to='/verifier'>Verify</NavLink>
            </li>
            <li>
              <NavLink to='/verifier/vPendingList'>Pending List</NavLink>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VNavbar;
