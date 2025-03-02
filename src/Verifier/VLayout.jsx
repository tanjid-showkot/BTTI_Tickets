/** @format */

import { Outlet } from "react-router";
import BottomTabBar from "../Components/BottomTabBar";
import VNavbar from "./VNavbar";

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
