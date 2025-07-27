import { State } from "@austinshelby/simple-ts-fsrs";

export interface CardData {
  front: string;
  back: string;
  lessons: LessonData[];
  assessment?: {
    assessedAt: number;
    nextScheduledAssessment: number;
    stability: number;
    difficulty: number;
    state: State;
  };
}

export interface LessonData {
  course: string;
  lesson: string;
}

export interface Stats {
  today: number;
  newCardsPerDay: number;
  newCardsToday: number;
  reviewsPerDay: number;
  reviewsToday: number;
}

export type CourseStates = Record<
  string,
  { state: State; lessons: Record<string, State> }
>;
