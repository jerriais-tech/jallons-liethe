import React from "react";
import { Link } from "react-router";
import styles from "./styles";

interface Props extends React.ComponentProps<typeof Link> {
  color?: keyof typeof styles;
}

const NavItem: React.FC<Props> = ({
  color = "primary",
  className,
  ...rest
}) => {
  return (
    <Link
      {...rest}
      className={`${styles[color]} text-white text-center font-medium rounded-lg text-sm px-5 py-2.5 block w-full ${className ?? ""}`}
    />
  );
};

export default NavItem;
