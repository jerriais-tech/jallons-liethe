import React from "react";

import { Lesson } from "@/data/types";
import { useClickableCard } from "@/hooks";
import pluralize from "pluralize";
import styles from "./styles";
import CardElement from "./CardElement";

interface Props {
  lesson: Lesson;
  learning?: boolean;
  onClick: () => void;
}

const LessonCard: React.FC<Props> = ({ lesson, learning, onClick }) => {
  const [buttonRef, handleCardClick] = useClickableCard<HTMLButtonElement>();

  return (
    <CardElement onClick={handleCardClick}>
      <img src={lesson.image} className="w-auto h-[110px] outline-black/5" />
      <div className="m-2 ml-4 w-full flex flex-col justify-between">
        <header>
          <h2 className="text-lg">{lesson.title}</h2>
        </header>
        <div className="flex items-end justify-between">
          <p className="text-sm">
            {lesson.vocabulary.length}{" "}
            {pluralize("word", lesson.vocabulary.length)}
          </p>
          {learning ? (
            <span
              className={`bg-gray-300 text-center text-sm rounded-lg px-3 py-2`}
            >
              Learning
            </span>
          ) : (
            <button
              ref={buttonRef}
              onClick={onClick}
              className={`${styles.primary} text-white text-center text-sm rounded-lg px-3 py-2`}
            >
              Learn
            </button>
          )}
        </div>
      </div>
    </CardElement>
  );
};

export default LessonCard;
