import React from "react";
import { Link } from "react-router";
import pluralize from "pluralize";

import { Course } from "@/data/types";
import { useClickableCard } from "@/hooks";
import CardElement from "./CardElement";

interface Props {
  slug: string;
  course: Course;
}

const CourseCard: React.FC<Props> = ({ slug, course }) => {
  const [linkRef, handleCardClick] = useClickableCard();

  return (
    <CardElement onClick={handleCardClick}>
      <img src={course.image} className="w-auto h-[110px] outline-black/5" />
      <div className="m-2 ml-4 flex flex-col justify-between">
        <header>
          <h2 className="text-lg">
            <Link to={`/course/${slug}`} ref={linkRef}>
              {course.title}
            </Link>
          </h2>
          {course.subtitle && (
            <h3 className="text-sm text-gray-500">{course.subtitle}</h3>
          )}
        </header>
        <p className="text-sm">
          {course.lessons.length} {pluralize("lesson", course.lessons.length)}
        </p>
      </div>
    </CardElement>
  );
};

export default CourseCard;
