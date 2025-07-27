import React from "react";
import { Outlet } from "react-router";

const Layout: React.FC = () => (
  <div className="m-8 mx-auto max-w-2xl relative h-100vh">
    <Outlet />
  </div>
);

export default Layout;
