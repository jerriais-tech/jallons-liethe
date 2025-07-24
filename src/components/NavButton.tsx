import React from "react";
import styles from "./styles";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  color?: keyof typeof styles;
}

const NavButton: React.FC<Props> = ({
  color = "primary",
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`${styles[color]} text-white text-center font-medium rounded-lg px-5 py-2.5 block w-full ${className ?? ""}`}
    />
  );
};

export default NavButton;
