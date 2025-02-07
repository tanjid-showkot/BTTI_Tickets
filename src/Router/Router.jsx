/** @format */

import { createBrowserRouter } from "react-router";
import Login from "../Login/Login";
import Home from "../Accounts/Home";
import Layout from "../Accounts/Layout";
import SettleRefund from "../Accounts/SettleRefund";
import AccountsDashboard from "../Accounts/AccountsDashboard";
import Profile from "../Accounts/Profile";
import AdminLayout from "../Admin/AdminLayout";
import AdminDashboard from "../Admin/AdminDashboard";
import RefundApproval from "../Admin/RefundApproval";
import ManageTicket from "../Admin/ManageTicket";
import ManageUser from "../Admin/ManageUser";

let webRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login></Login>,
  },
  {
    path: "/admin",
    element: <AdminLayout></AdminLayout>,
    children: [
      {
        path: "",
        element: <AdminDashboard></AdminDashboard>,
      },
      {
        path: "refundApproval",
        element: <RefundApproval></RefundApproval>,
      },
      {
        path: "manageTicket",
        element: <ManageTicket></ManageTicket>,
      },
      {
        path: "manageUser",
        element: <ManageUser></ManageUser>,
      },
    ],
  },
  {
    path: "/accounts",
    element: <Layout></Layout>,
    children: [
      {
        path: "",
        element: <Home></Home>,
      },
      {
        path: "accountsDashboard",
        element: <AccountsDashboard></AccountsDashboard>,
      },
      {
        path: "settleRefund",
        element: <SettleRefund></SettleRefund>,
      },
      {
        path: "accountsProfile",
        element: <Profile></Profile>,
      },
    ],
  },
]);
export default webRouter;
