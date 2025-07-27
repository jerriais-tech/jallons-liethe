import React from "react";

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const H2: React.FC<Props> = ({ children, className, ...rest }) => (
  <h2
    className={`text-left text-xl font-bold mt-8 mb-4 ${className ?? ""}`}
    {...rest}
  >
    {children}
  </h2>
);

export default H2;
