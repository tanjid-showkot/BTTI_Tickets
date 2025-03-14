/** @format */

import { Outlet } from "react-router";
import BottomTabBar from "../Components/BottomTabBar";
import VNavbar from "./VNavbar";
import Footer from "./Footer";

const VLayout = () => {
  return (
    <div>
      <VNavbar></VNavbar>
      <Outlet></Outlet>
      <Footer />
      <BottomTabBar></BottomTabBar>
    </div>
  );
};

export default VLayout;
