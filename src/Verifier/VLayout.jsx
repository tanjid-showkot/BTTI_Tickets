/** @format */

import { Outlet, useLocation } from "react-router";
import BottomTabBar from "../Components/BottomTabBar";
import VNavbar from "./VNavbar";
import Footer from "./Footer";

const VLayout = () => {
  const location = useLocation();
  const isQueuePage = location.pathname === "/verifier/queue";
  const isMasterQueuePage = location.pathname === "/verifier/master-queue";
  const hideNavbar = isQueuePage || isMasterQueuePage;

  return (
    <div
      className={
        isMasterQueuePage
          ? "flex h-screen flex-col overflow-hidden"
          : "flex min-h-screen flex-col"
      }>
      {!hideNavbar && <VNavbar />}
      <main className={isMasterQueuePage ? "min-h-0 flex-1" : ""}>
        <Outlet></Outlet>
      </main>
      <Footer />
      <BottomTabBar></BottomTabBar>
    </div>
  );
};

export default VLayout;
