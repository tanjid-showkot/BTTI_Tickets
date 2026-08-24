/** @format */

import { Outlet } from "react-router";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";

const AdminLayout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <AdminNavbar></AdminNavbar>
      <main className='flex-1'>
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default AdminLayout;
