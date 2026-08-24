/** @format */

import { Outlet } from "react-router";
import AccountsNavbar from "./AccountsNavbar";

const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <AccountsNavbar></AccountsNavbar>
      <main className='flex-1'>
        <Outlet></Outlet>
      </main>
    </div>
  );
};

export default Layout;
