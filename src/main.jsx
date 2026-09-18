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
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
  },
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;

    window.setInterval(() => {
      if (navigator.onLine) {
        registration.update();
      }
    }, 60 * 1000);
  },
});

createRoot(document.getElementById("root")).render(
  <Context>
    <OnlineStatus>
      <RouterProvider router={webRouter} />
    </OnlineStatus>
  </Context>
);
