import React from "react";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

const CardElement: React.FC<Props> = ({ children, onClick }) => {
  return (
    <article
      onClick={onClick}
      className="my-4 shadow outline outline-black/5 rounded-lg flex text-left"
    >
      {children}
    </article>
  );
};

export default CardElement;
