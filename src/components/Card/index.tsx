import React, { useEffect, useState } from "react";
import "./index.css";

interface Props {
  front: string;
  back: string;
  revealed?: boolean;
  onClick?: () => void;
}

const CARD_FLIP_DURATION = 0.25;

const Card: React.FC<Props> = ({ front, back, revealed, onClick }) => {
  const [previousRevealed, setPreviousRevealed] = useState(revealed);
  const [backState, setBackState] = useState({ front, back });

  useEffect(() => {
    if (revealed !== previousRevealed) {
      if (revealed) {
        setBackState({ front, back });
      } else {
        const timeout = setTimeout(() => {
          setBackState({ front, back });
        }, CARD_FLIP_DURATION * 1000);
        return () => clearTimeout(timeout);
      }
    }
    setPreviousRevealed(revealed);
  }, [revealed, previousRevealed, front, back]);

  return (
    <div
      className={`card relative aspect-3/2 ${revealed ? "revealed" : ""}`}
      onClick={onClick}
      style={
        {
          "--card-flip-duration": `${CARD_FLIP_DURATION}s`,
        } as React.CSSProperties
      }
    >
      <div className="front shadow-lg ring w-full h-full absolute flex items-center justify-center">
        {front}
      </div>
      <div className="back shadow-lg ring w-full h-full absolute flex flex-col">
        <div className="flex-grow flex flex-col justify-center">
          {backState.front}
        </div>
        <hr className="h-px w-full flex-shrink bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="flex-grow flex flex-col justify-center">
          {backState.back}
        </div>
      </div>
    </div>
  );
};

export default Card;
