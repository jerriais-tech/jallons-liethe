import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";

import PWABadge from "./PWABadge.tsx";
import store from "./store";

import MainRouter from "./MainRouter.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <MainRouter />
    </Provider>
    <PWABadge />
  </StrictMode>
);
