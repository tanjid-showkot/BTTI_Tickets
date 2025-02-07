/** @format */

import { Outlet } from "react-router";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar></AdminNavbar>
      <Outlet></Outlet>
    </div>
  );
};

export default AdminLayout;
