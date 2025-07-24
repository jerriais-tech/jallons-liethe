import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import PWABadge from "./PWABadge.tsx";
import "./index.css";
import LandingPage from "./pages/Landing.tsx";
import Layout from "./components/Layout.tsx";
import Study from "./pages/Study.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/study" element={<Study />} />
        </Routes>
        <PWABadge />
      </BrowserRouter>
    </Layout>
  </StrictMode>
);
