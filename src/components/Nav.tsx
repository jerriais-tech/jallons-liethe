import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Nav: React.FC<Props> = ({ children, className, ...rest }) => (
  <nav
    className={`m-8 fixed bottom-0 left-0 right-0 ${className ?? ""}`}
    {...rest}
  >
    <ul className="m-auto w-full max-w-2xl flex flex-col gap-2">{children}</ul>
  </nav>
);

export default Nav;
