import React from "react";

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const H1: React.FC<Props> = ({ children, className, ...rest }) => (
  <h1 className={`text-4xl font-bold ${className ?? ""}`} {...rest}>
    {children}
  </h1>
);

export default H1;
