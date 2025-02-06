/** @format */

import { createBrowserRouter } from "react-router";
import Login from "../Login/Login";
import Home from "../Accounts/Home";
import Layout from "../Accounts/Layout";
import SettleRefund from "../Accounts/SettleRefund";
import AccountsDashboard from "../Accounts/AccountsDashboard";
import Profile from "../Accounts/Profile";

let webRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login></Login>,
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
