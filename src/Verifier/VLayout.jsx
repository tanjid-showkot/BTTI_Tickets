/** @format */

import { Outlet } from "react-router";
import BottomTabBar from "../Components/BottomTabBar";
import VNavbar from "./VNavbar";
import Footer from "./Footer";

const VLayout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <VNavbar></VNavbar>
      <main className=''>
        <Outlet></Outlet>
      </main>
      <Footer />
      <BottomTabBar></BottomTabBar>
    </div>
  );
};

export default VLayout;
