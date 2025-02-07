/** @format */

import { NavLink, useNavigate } from "react-router";
import logo from "/BRTC Logo.png";
import { useContext } from "react";
import AuthContext from "../Context/Context";
const AccountsNavbar = () => {
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
        <div className='navbar-center hidden lg:flex'>
          <NavLink className='btn btn-ghost' to='/accounts'>
            Home
          </NavLink>
        </div>
        <div className='navbar-end'>
          <ul className='menu menu-horizontal px-1 font-bold lg:flex hidden '>
            <li>
              <NavLink to='/accounts/accountsDashboard'>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to='/accounts/settleRefund'>Refund</NavLink>
            </li>
            <li>
              <NavLink to='/accounts/accountsProfile'>Profile</NavLink>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>

          <div className='dropdown dropdown-end'>
            <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                {" "}
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h8m-8 6h16'
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[-10]  mt-3 w-52 p-2 shadow'>
              <li>
                <NavLink to='/accounts'>Home</NavLink>
              </li>
              <li>
                <NavLink to='/accounts/accountsDashboard'>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to='/accounts/settleRefund'>Refund</NavLink>
              </li>
              <li>
                <NavLink to='/accounts/accountsProfile'>Profile</NavLink>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsNavbar;
