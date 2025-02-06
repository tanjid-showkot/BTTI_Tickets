/** @format */

import { Outlet } from "react-router";
import AccountsNavbar from "./AccountsNavbar";

const Layout = () => {
  return (
    <div>
      <AccountsNavbar></AccountsNavbar>
      <Outlet></Outlet>
    </div>
  );
};

export default Layout;
