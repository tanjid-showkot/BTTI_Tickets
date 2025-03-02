/** @format */

import { Outlet } from "react-router";
import VNavbar from "./vNavbar";
import BottomTabBar from "../Components/BottomTabBar";

const VLayout = () => {
  return (
    <div>
      <VNavbar></VNavbar>
      <Outlet></Outlet>
      <BottomTabBar></BottomTabBar>
    </div>
  );
};

export default VLayout;
