import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Main: React.FC<Props> = ({ children, className, ...rest }) => (
  <main className={`m-8 text-center ${className ?? ""}`} {...rest}>
    {children}
  </main>
);

export default Main;
