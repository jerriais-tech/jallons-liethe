import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FSRS, Rating, Assessment } from "@austinshelby/simple-ts-fsrs";

import { Lesson } from "@/data/types";

import { useActions } from "../hooks";
import { CardData, LessonData, Stats } from "./types";

const fsrs = new FSRS();

function lessonDataEquals(a: LessonData, b: LessonData): boolean {
  return a.course === b.course && a.lesson === b.lesson;
}

function cardEquals(a: CardData, b: CardData): boolean {
  return a.front === b.front && a.back === b.back;
}

export interface DeckState {
  stats: Stats;
  cards: CardData[];
  lessons: LessonData[];
}

const initialState: DeckState = {
  stats: {
    today: 0,
    reviewsPerDay: 100,
    newCardsPerDay: 20,
    reviewsToday: 0,
    newCardsToday: 0,
  },
  cards: [],
  lessons: [],
};

export const deckSlice = createSlice({
  name: "deck",
  initialState,
  reducers: {
    updateStatsForTime: (state, action: PayloadAction<number>) => {
      const time = action.payload;
      if (time - state.stats.today > 24 * 60 * 60 * 1000) {
        state.stats = {
          today: time,
          reviewsPerDay: 100,
          newCardsPerDay: 20,
          reviewsToday: 0,
          newCardsToday: 0,
        };
      }
    },
    addLesson: (state, action: PayloadAction<Lesson>) => {
      // Add lesson to top of lessons deck
      const lesson = action.payload;
      const lessonData = { course: lesson.courseId, lesson: lesson.id };

      state.lessons = state.lessons.filter(
        (value) => !lessonDataEquals(value, lessonData)
      );
      state.lessons.unshift(lessonData);

      // Add card to deck
      lesson.vocabulary.forEach(({ front, back }) => {
        const existingCard = state.cards.find(
          (value) => value.front === front && value.back === back
        );
        if (existingCard) {
          const alreadyExists = existingCard.lessons.find((value) =>
            lessonDataEquals(value, lessonData)
          );
          if (!alreadyExists) {
            existingCard.lessons.push(lessonData);
          }
        } else {
          state.cards.push({ front, back, lessons: [lessonData] });
        }
      });
    },
    rateCard: (
      state,
      action: PayloadAction<{ card: CardData; rating: Rating; time: number }>
    ) => {
      const { card, rating, time } = action.payload;

      // Assess according to FSRS algorithm
      const previousAssessment = card.assessment
        ? new Assessment({
            ...card.assessment,
            assessedAt: new Date(card.assessment.assessedAt),
            nextScheduledAssessment: new Date(
              card.assessment.nextScheduledAssessment
            ),
          })
        : undefined;

      const newAssessment = fsrs.assessRecall({
        rating,
        date: new Date(time),
        previousAssessment,
      });

      // Update deck
      const cardInState = state.cards.find((value) => cardEquals(value, card));
      if (cardInState) {
        cardInState.assessment = {
          ...newAssessment,
          assessedAt: newAssessment.assessedAt.getTime(),
          nextScheduledAssessment:
            newAssessment.nextScheduledAssessment.getTime(),
        };
      }

      // Update stats
      state.stats.reviewsToday += 1;
      if (!card.assessment && rating !== "Mastered") {
        state.stats.newCardsToday += 1;
      }
    },
  },
});

export const deckActions = deckSlice.actions;
export const useDeckActions = () => useActions(deckSlice.actions);

export default deckSlice.reducer;
