/** @format */

import { createBrowserRouter } from "react-router";
import Login from "../Login/Login";
// import Home from "../Accounts/Home";
// import Layout from "../Accounts/Layout";
// import SettleRefund from "../Accounts/SettleRefund";
// import AccountsDashboard from "../Accounts/AccountsDashboard";
// import Profile from "../Accounts/Profile";
import AdminLayout from "../Admin/AdminLayout";
import AdminDashboard from "../Admin/AdminDashboard";
import RefundApproval from "../Admin/RefundApproval";
import ManageTicket from "../Admin/ManageTicket";
import ManageUser from "../Admin/ManageUser";
import PrivateRoute from "./PrivateRoute";
import Sales from "../Admin/Sales";
import VLayout from "../Verifier/VLayout";
import Verifier from "../Verifier/Verifier";
import VProfile from "../Verifier/VProfile";
import PendingList from "../Verifier/PendingList";

let webRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login></Login>,
  },
  {
    path: "/verifier",
    element: (
      <PrivateRoute>
        <VLayout></VLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Verifier></Verifier>,
      },
      {
        path: "vProfile",
        element: <VProfile></VProfile>,
      },
      {
        path: "vPendingList",
        element: <PendingList></PendingList>,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
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
      {
        path: "tickets",
        element: <Sales></Sales>,
      },
    ],
  },
  // {
  //   path: "/accounts",
  //   element: (
  //     <PrivateRoute>
  //       <Layout />
  //     </PrivateRoute>
  //   ),
  //   children: [
  //     {
  //       path: "",
  //       element: <Home></Home>,
  //     },
  //     {
  //       path: "accountsDashboard",
  //       element: <AccountsDashboard></AccountsDashboard>,
  //     },
  //     {
  //       path: "settleRefund",
  //       element: <SettleRefund></SettleRefund>,
  //     },
  //     {
  //       path: "accountsProfile",
  //       element: <Profile></Profile>,
  //     },
  //   ],
  // },
]);
export default webRouter;
