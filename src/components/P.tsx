import React from "react";

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const P: React.FC<Props> = ({ children, className, ...rest }) => (
  <p className={`my-6 ${className ?? ""}`} {...rest}>
    {children}
  </p>
);

export default P;
