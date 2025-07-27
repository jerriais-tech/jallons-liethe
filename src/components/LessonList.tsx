import React from "react";
import { Lesson } from "@/data/types";
import LessonCard from "./LessonCard";
import { useUserLessons } from "@/store/deck/selectors";

interface Props {
  lessons: Lesson[];
  onClick?: (lesson: Lesson) => void;
}

const LessonList: React.FC<Props> = ({ lessons, onClick }) => {
  const userLessons = useUserLessons();

  return lessons.map((lesson, index) => (
    <LessonCard
      key={index}
      lesson={lesson}
      learning={Boolean(
        userLessons.find(
          (value) =>
            value.course === lesson.courseId && value.lesson === lesson.id
        )
      )}
      onClick={() => onClick?.(lesson)}
    />
  ));
};

export default LessonList;
