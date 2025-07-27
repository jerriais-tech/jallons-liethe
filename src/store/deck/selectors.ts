import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../index";
import { useAppSelector } from "../hooks";
import {
  getCourseStates,
  getNewCards,
  getNextLessonSuggestions,
  getScheduledCards,
  getTodaysCards,
  getTodaysNewCards,
  getTodaysScheduledCards,
} from "./helpers";
import { selectCourses } from "../courses/selectors";

export const selectAllCards = (state: RootState) => state.deck.cards;
export const useAllCards = () => useAppSelector(selectAllCards);

export const selectDailyStats = (state: RootState) => state.deck.stats;
export const useDailyStats = () => useAppSelector(selectDailyStats);

export const selectUserLessons = (state: RootState) => state.deck.lessons;
export const useUserLessons = () => useAppSelector(selectUserLessons);

export const selectNewCards = createSelector(selectAllCards, getNewCards);
export const useNewCards = () => useAppSelector(selectNewCards);

export const selectTodaysNewCards = createSelector(
  selectNewCards,
  selectDailyStats,
  getTodaysNewCards
);
export const useTodaysNewCards = () => useAppSelector(selectTodaysNewCards);

export const selectScheduledCards = createSelector(
  selectAllCards,
  getScheduledCards
);
export const useScheduledCards = () => useAppSelector(selectScheduledCards);

export const selectTodaysScheduledCards = createSelector(
  selectScheduledCards,
  getTodaysScheduledCards
);
export const useTodaysScheduledCards = () =>
  useAppSelector(selectTodaysScheduledCards);

export const selectTodaysCards = createSelector(
  selectTodaysScheduledCards,
  selectTodaysNewCards,
  selectDailyStats,
  getTodaysCards
);
export const useTodaysCards = () => useAppSelector(selectTodaysCards);

export const selectCourseStates = createSelector(
  selectAllCards,
  getCourseStates
);
export const useCourseStates = () => useAppSelector(selectCourseStates);

export const selectNextLessonSuggestions = createSelector(
  selectCourses,
  selectCourseStates,
  getNextLessonSuggestions
);
export const useNextLessonSuggestions = () =>
  useAppSelector(selectNextLessonSuggestions);

export const selectNextCourseSuggestions = createSelector(
  selectCourseStates,
  selectCourses,
  (states, courses) => {
    return courses.filter(({ id }) => !states[id]);
  }
);
export const useNextCourseSuggestions = () =>
  useAppSelector(selectNextCourseSuggestions);
