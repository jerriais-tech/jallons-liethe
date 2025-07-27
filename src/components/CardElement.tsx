import React from "react";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

const CardElement: React.FC<Props> = ({ children, onClick }) => {
  return (
    <article
      onClick={onClick}
      className="shadow outline outline-black/5 rounded-lg flex text-left"
    >
      {children}
    </article>
  );
};

export default CardElement;
