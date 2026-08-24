/** @format */

import { NavLink, useNavigate } from "react-router";
import logo from "/BRTC Logo.png";
import React, { useContext } from "react";
import AuthContext from "../Context/Context";

const AdminNavbar = () => {
  const { logOutUser, user } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();
  const handleLogout = () => {
    logOutUser();
    navigate("/", { replace: true });
  };
  const menuItems = (
    <React.Fragment>
      <li>
        <NavLink
          to='/admin'
          className={({ isActive }) =>
            isActive ? "nav-link-active px-3 py-2" : "nav-link-base px-3 py-2"
          }>
          Dashboard
        </NavLink>
      </li>

      <li>
        <NavLink
          to='/admin/tickets'
          className={({ isActive }) =>
            isActive ? "nav-link-active px-3 py-2" : "nav-link-base px-3 py-2"
          }>
          Sales
        </NavLink>
      </li>
      <li>
        <NavLink
          to='/admin/refundApproval'
          className={({ isActive }) =>
            isActive ? "nav-link-active px-3 py-2" : "nav-link-base px-3 py-2"
          }>
          Refund
        </NavLink>
      </li>
      {user.user_type === "superadmin" && (
        <li>
          <NavLink
            to='/admin/bulkDelete'
            className={({ isActive }) =>
              isActive ? "nav-link-active px-3 py-2" : "nav-link-base px-3 py-2"
            }>
            Bulk Remove
          </NavLink>
        </li>
      )}
      <li>
        <NavLink
          to='/admin/manageTicket'
          className={({ isActive }) =>
            isActive ? "nav-link-active px-3 py-2" : "nav-link-base px-3 py-2"
          }>
          Tickets
        </NavLink>
      </li>
      {user.user_type === "superadmin" && (
        <li>
          <NavLink
            to='/admin/manageUser'
            className={({ isActive }) =>
              isActive ? "nav-link-active px-3 py-2" : "nav-link-base px-3 py-2"
            }>
            Users
          </NavLink>
        </li>
      )}

      <li>
        <button
          onClick={handleLogout}
          className='nav-link-base px-3 py-2 border-0 bg-transparent'>
          Logout
        </button>
      </li>
    </React.Fragment>
  );
  return (
    <div>
      <div className='navbar sticky top-0 z-40 border-b border-sky-100 bg-white/90 backdrop-blur-md shadow-[0_16px_35px_-30px_rgba(37,99,235,0.45)]'>
        <div className='navbar-start w-[90%] lg:w-[50%]'>
          <p className='font-black flex items-center gap-3 text-lg text-slate-800 lg:text-xl'>
            <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100'>
              <img src={logo} className='h-8 w-8 object-contain' alt='' />
            </span>
            <span className='truncate overflow-hidden w-[80%] lg:w-full text-ellipsis'>
              বিআরটিসি তেজগাঁও ট্রেনিং ইন্সটিটিউট
            </span>
          </p>
        </div>

        <div className='navbar-end w-[20%] lg:w-[60%]'>
          <ul className='menu menu-horizontal gap-2 px-1 font-semibold lg:flex hidden md:me-30'>
            {menuItems}
          </ul>

          <div className='dropdown dropdown-end'>
            <div
              tabIndex={0}
              role='button'
              className='btn btn-outline rounded-xl border border-sky-100 bg-white text-sky-700 shadow-sm lg:hidden'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h8m-8 6h16'
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content mt-3 w-56 rounded-2xl border border-sky-100 bg-white p-2 shadow-lg'>
              {menuItems}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
