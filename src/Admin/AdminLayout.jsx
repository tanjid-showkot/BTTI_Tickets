/** @format */

import { Outlet } from "react-router";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar></AdminNavbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default AdminLayout;
