import React from "react";

import CourseCard from "./CourseCard";
import { Course } from "@/data/types";

interface Props {
  courses: Course[];
}

const CourseList: React.FC<Props> = ({ courses }) => {
  return courses.map((course) => (
    <CourseCard key={course.id} slug={course.id} course={course} />
  ));
};

export default CourseList;
