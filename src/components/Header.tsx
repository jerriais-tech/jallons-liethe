import React from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const Header: React.FC<Props> = ({ children, className, ...rest }) => (
  <header className={`text-center ${className ?? ""}`} {...rest}>
    {children}
  </header>
);

export default Header;
