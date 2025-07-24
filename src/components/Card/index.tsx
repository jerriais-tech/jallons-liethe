import React from "react";
import "./index.css";

interface Props {
  front: React.ReactNode;
  back: React.ReactNode;
  revealed?: boolean;
  onClick?: () => void;
}

const Card: React.FC<Props> = ({ front, back, revealed, onClick }) => {
  return (
    <div
      className={`card relative m-8 aspect-3/2 ${revealed ? "revealed" : ""}`}
      onClick={onClick}
    >
      <div className="front shadow-lg ring w-full h-full absolute flex items-center justify-center">
        {front}
      </div>
      <div className="back shadow-lg ring w-full h-full absolute flex flex-col">
        <div className="flex-grow flex flex-col justify-center">{front}</div>
        <hr className="h-px w-full flex-shrink bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="flex-grow flex flex-col justify-center">{back}</div>
      </div>
    </div>
  );
};

export default Card;
