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
      <div className='navbar sticky top-0 z-40 border-b border-sky-100 bg-white/90 backdrop-blur-md shadow-[0_16px_35px_-30px_rgba(37,99,235,0.45)]'>
        <div className='navbar-start w-[90%] lg:w-[50%]'>
          <p className='font-black flex items-center gap-3 text-lg text-slate-800 lg:text-xl'>
            <span className='flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100'>
              <img src={logo} className='h-7 w-7 object-contain' alt='' />
            </span>
            <span className='truncate overflow-hidden w-[80%] lg:w-full text-ellipsis'>
              বিআরটিসি তেজগাঁও ট্রেনিং ইন্সটিটিউট
            </span>
          </p>
        </div>
        <div className='navbar-end w-[20%] lg:w-[50%]'>
          <ul className='menu menu-horizontal gap-2 px-1 font-semibold lg:flex hidden'>
            <li>
              <NavLink
                to='/verifier'
                className={({ isActive }) =>
                  isActive
                    ? "nav-link-active px-3 py-2"
                    : "nav-link-base px-3 py-2"
                }>
                Verify
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/verifier/vPendingList'
                className={({ isActive }) =>
                  isActive
                    ? "nav-link-active px-3 py-2"
                    : "nav-link-base px-3 py-2"
                }>
                Pending List
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/verifier/queue'
                className={({ isActive }) =>
                  isActive
                    ? "nav-link-active px-3 py-2"
                    : "nav-link-base px-3 py-2"
                }>
                Queue
              </NavLink>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className='nav-link-base px-3 py-2 border-0 bg-transparent'>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VNavbar;
