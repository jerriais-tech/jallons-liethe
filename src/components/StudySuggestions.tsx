import React from "react";

import Main from "@/components/Main";
import Nav from "@/components/Nav";
import NavItem from "@/components/NavItem";
import H2 from "@/components/H2";
import P from "@/components/P";
import CourseList from "@/components/CourseList";
import FinishedStudying from "@/components/FinishedStudying";

import {
  useAllCards,
  useNextCourseSuggestions,
  useNextLessonSuggestions,
} from "@/store/deck/selectors";

const StudySuggestions: React.FC = () => {
  const cards = useAllCards();
  const nextLessonSuggestions = useNextLessonSuggestions();
  const nextCourseSuggestions = useNextCourseSuggestions();

  if (cards.length === 0) {
    return (
      <>
        <Nav>
          <NavItem to="/courses">Browse courses</NavItem>
        </Nav>

        <Main>
          <P>
            There are no cards in your study deck. Choose a course and lesson to
            add to your deck.
          </P>
        </Main>
      </>
    );
  }

  if (
    nextLessonSuggestions.length === 0 &&
    nextCourseSuggestions.length === 0
  ) {
    return <FinishedStudying />;
  }

  return nextLessonSuggestions.length === 0 ? (
    <>
      <Nav>
        <NavItem to="/courses">Browse courses</NavItem>
      </Nav>

      <Main>
        <P>
          You've studied all the cards in your deck, but you haven't hit your
          daily review limit. Why not start another course?
        </P>
        <H2>Courses</H2>
        <CourseList courses={nextCourseSuggestions} />
      </Main>
    </>
  ) : (
    <>
      <Nav>
        <NavItem to="/courses">Browse courses</NavItem>
      </Nav>
      <Main>
        <P>
          You've studied all the cards in your deck, but you haven't hit your
          daily review limit. Why not study the next lesson in one of your
          courses?
        </P>
      </Main>
    </>
  );
};

export default StudySuggestions;
