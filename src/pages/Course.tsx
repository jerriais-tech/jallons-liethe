import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import H1 from "@/components/H1";
import Header from "@/components/Header";
import Main from "@/components/Main";
import { useCourses } from "@/store/courses/selectors";
import LessonCard from "@/components/LessonCard";
import { useUserLessons } from "@/store/deck/selectors";
import { Lesson } from "@/data/types";
import Modal from "@/components/Modal";
import { useDeckActions } from "@/store/deck";
import BackButton from "@/components/BackButton";
import H2 from "@/components/H2";

const Course: React.FC = () => {
  const params = useParams();
  const courses = useCourses();
  const actions = useDeckActions();

  const courseSlug = params.slug;
  const course = courses.find((course) => course.id === courseSlug);

  const userLessons = useUserLessons();

  const [addingLesson, setAddingLesson] = useState<Lesson>();
  const handleAddingClose = useCallback(() => setAddingLesson(undefined), []);

  const [addedLesson, setAddedLesson] = useState<Lesson>();
  const handleAddedClose = useCallback(() => setAddedLesson(undefined), []);

  useEffect(() => {
    if (addingLesson) {
      setAddedLesson(undefined);
    }
  }, [addingLesson]);

  const handleAddLesson = useCallback(() => {
    if (addingLesson) {
      actions.addLesson(addingLesson);
    }
    setAddingLesson(undefined);
    setAddedLesson(addingLesson);
  }, [addingLesson]);

  return course ? (
    <>
      <Header back={<BackButton to="/courses" />}>
        <H1>{course.title}</H1>
      </Header>

      <Main>
        <span className="italic text-gray-600">{course.subtitle}</span>
        <H2>Lessons</H2>
        {course.lessons.map((lesson, index) => (
          <LessonCard
            key={index}
            lesson={lesson}
            learning={Boolean(
              userLessons.find(
                (value) =>
                  value.course === lesson.courseId && value.lesson === lesson.id
              )
            )}
            onClick={() => setAddingLesson(lesson)}
          />
        ))}
      </Main>

      {addingLesson && (
        <Modal
          onClose={handleAddingClose}
          actions={{
            "Add to deck": { color: "primary", onClick: handleAddLesson },
            Cancel: { color: "secondary", onClick: handleAddingClose },
          }}
        >
          Add <em className="inline-block">"{addingLesson.title}"</em> from{" "}
          <em className="inline-block">"{course.title}"</em> to your study deck?
        </Modal>
      )}

      {addedLesson && (
        <Modal
          onClose={handleAddedClose}
          actions={{
            "Study now": { color: "primary", link: "/study" },
            Cancel: { color: "secondary", onClick: handleAddedClose },
          }}
        >
          <em className="inline-block">"{addedLesson.title}"</em> has been added
          to your deck. Would you like to study now?
        </Modal>
      )}
    </>
  ) : (
    <>
      <Header>
        <H1>Course not found</H1>
      </Header>

      <Main>There is no course at this address.</Main>
    </>
  );
};

export default Course;
