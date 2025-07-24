import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children, className, ...rest }) => (
  <div
    className={`my-8 mx-auto max-w-2xl relative h-100vh ${className ?? ""}`}
    {...rest}
  >
    {children}
  </div>
);

export default Layout;
