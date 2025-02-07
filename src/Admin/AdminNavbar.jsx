/** @format */

import { NavLink } from "react-router";

const AdminNavbar = () => {
  return (
    <div>
      <div className='navbar bg-base-100 shadow-sm'>
        <div className='navbar-start'>
          <a className='btn btn-ghost text-xl'>BTTI</a>
        </div>
        <div className='navbar-center hidden lg:flex'></div>
        <div className='navbar-end'>
          <ul className='menu menu-horizontal px-1 font-bold lg:flex hidden '>
            <li>
              <NavLink to='/admin'>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to='/admin/refundApproval'>Refund</NavLink>
            </li>
            <li>
              <NavLink to='/admin/manageTicket'>Tickets</NavLink>
            </li>
            <li>
              <NavLink to='/admin/manageUser'>Users</NavLink>
            </li>
            <li>
              <a>Logout</a>
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
                <NavLink to='/admin'>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to='/admin/refundApproval'>Refund</NavLink>
              </li>
              <li>
                <NavLink to='/admin/manageTicket'>Tickets</NavLink>
              </li>
              <li>
                <NavLink to='/admin/manageUser'>Users</NavLink>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
