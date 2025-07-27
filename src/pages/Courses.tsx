import React from "react";

import H1 from "@/components/H1";
import Header from "@/components/Header";
import Main from "@/components/Main";

import { useCourses } from "@/store/courses/selectors";
import BackButton from "@/components/BackButton";
import CourseList from "@/components/CourseList";

const Courses: React.FC = () => {
  const courses = useCourses();

  return (
    <>
      <Header back={<BackButton to="/" />}>
        <H1>Courses</H1>
      </Header>

      <Main>
        <CourseList courses={courses} />
      </Main>
    </>
  );
};

export default Courses;
