import React from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
  back?: React.ReactNode;
  children: React.ReactNode;
}

const Header: React.FC<Props> = ({ back, children, className, ...rest }) => (
  <header
    className={`text-center m-8 flex items-center ${className ?? ""}`}
    {...rest}
  >
    {back}
    <div className="flex-grow">{children}</div>
  </header>
);

export default Header;
