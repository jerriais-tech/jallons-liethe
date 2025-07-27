import React from "react";
import { Link } from "react-router";

interface Props {
  to: string;
}

const BackButton: React.FC<Props> = ({ to }) => {
  return (
    <Link to={to} title="Back">
      <svg
        role="img"
        aria-label="Back"
        className="w-6 h-6 text-gray-800"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 10"
      >
        <title>Back</title>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 5H1m0 0 4 4M1 5l4-4"
        ></path>
      </svg>
    </Link>
  );
};

export default BackButton;
