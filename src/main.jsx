/** @format */

import { createRoot } from "react-dom/client";
import "./index.css";
import webRouter from "./Router/Router.jsx";
import { RouterProvider } from "react-router";
import { registerSW } from "virtual:pwa-register";
import { Context } from "./Context/Context.jsx";
import "react-day-picker/style.css";
import OnlineStatus from "./Components/OnlineStatus.jsx";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Reload?")) {
      updateSW();
    }
  },
});

createRoot(document.getElementById("root")).render(
  <Context>
    <OnlineStatus>
      <RouterProvider router={webRouter} />
    </OnlineStatus>
  </Context>
);
