/** @format */

import { createRoot } from "react-dom/client";
import "./index.css";
import webRouter from "./Router/Router.jsx";
import { RouterProvider } from "react-router";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Reload?")) {
      updateSW();
    }
  },
});

createRoot(document.getElementById("root")).render(
  <RouterProvider router={webRouter} />
);
