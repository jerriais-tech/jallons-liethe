import { State } from "@austinshelby/simple-ts-fsrs";

import { CardData, CourseStates, LessonData, Stats } from "./types";
import { Course } from "@/data/types";

class StableFuzzer {
  private seed: number;
  constructor() {
    this.seed = 1;
  }
  fuzz() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  sort() {
    return this.fuzz() - 0.5;
  }
}

export function getNewCards(allCards: CardData[]): CardData[] {
  return allCards.filter((card) => !card.assessment);
}

export function getTodaysNewCardsInternal(Fuzzer: typeof StableFuzzer) {
  return function getTodaysNewCards(
    newCards: CardData[],
    stats: Stats
  ): CardData[] {
    const fuzzer = new Fuzzer();
    newCards.sort(fuzzer.sort.bind(fuzzer));
    newCards.splice(Math.max(0, stats.newCardsPerDay - stats.newCardsToday));
    return newCards;
  };
}

export const getTodaysNewCards = getTodaysNewCardsInternal(StableFuzzer);

export function getScheduledCards(allCards: CardData[]): CardData[] {
  const scheduledCards = allCards.filter((card) => card.assessment);
  scheduledCards.sort(
    (a, b) =>
      a.assessment!.nextScheduledAssessment -
      b.assessment!.nextScheduledAssessment
  );
  return scheduledCards;
}

export function getTodaysScheduledCards(
  scheduledCards: CardData[]
): CardData[] {
  const date = new Date();
  date.setHours(24, 0, 0, 0);
  const midnight = date.getTime();
  return scheduledCards.filter(
    (card) =>
      card.assessment && card.assessment.nextScheduledAssessment < midnight
  );
}

export function getTodaysCardsInternal(Fuzzer: typeof StableFuzzer) {
  return function getTodaysCards(
    todaysScheduledCards: CardData[],
    newCards: CardData[],
    stats: Stats
  ): CardData[] {
    // Cards scheduled in the last 5 minues are probably ones the user
    // just Forgot and wants to practice, we should show them first,
    // then new cards, the the rest.
    const five_minutes_ago = Date.now() - 5 * 60 * 1000;

    const urgentCards: CardData[] = [];
    const otherCards: CardData[] = [];

    todaysScheduledCards.forEach((card) => {
      if (
        card.assessment &&
        card.assessment.nextScheduledAssessment > five_minutes_ago
      ) {
        urgentCards.push(card);
      } else {
        otherCards.push(card);
      }
    });

    const fuzzer = new Fuzzer();
    const fuzz = fuzzer.sort.bind(fuzzer);
    urgentCards.sort(fuzz);
    otherCards.sort(fuzz);

    // Combine decks
    const cards = [...urgentCards, ...newCards, ...otherCards];

    // Limit to reviewsPerDay
    cards.splice(Math.max(0, stats.reviewsPerDay - stats.reviewsToday));

    return cards;
  };
}

export const getTodaysCards = getTodaysCardsInternal(StableFuzzer);

function getLowestState(a: State, b: State): State {
  const states: State[] = ["Learning", "Relearning", "Review"];
  return states[Math.min(states.indexOf(a), states.indexOf(b))];
}

export function getCourseStates(cards: CardData[]): CourseStates {
  // Reduce right so the most recently added lessons are first
  const states = cards.reduceRight((statuses, card) => {
    card.lessons.forEach(({ course, lesson }) => {
      statuses[course] = statuses[course] ?? { state: "Review", lessons: {} };
      if (!card.assessment) {
        statuses[course].lessons[lesson] = "Learning";
      } else if (statuses[course].lessons[lesson]) {
        statuses[course].lessons[lesson] = getLowestState(
          card.assessment.state,
          statuses[course].lessons[lesson]
        );
      } else {
        statuses[course].lessons[lesson] = card.assessment.state;
      }
    });
    return statuses;
  }, {} as CourseStates);

  Object.entries(states).forEach(([key, value]) => {
    states[key].state = Object.values(value.lessons).reduce(
      getLowestState,
      "Review"
    );
  });

  return states;
}

export function getNextLessonSuggestions(
  courses: Course[],
  states: CourseStates
): LessonData[] {
  const unfinishedCourses = Object.entries(states).filter(
    ([, state]) => state.state !== "Review"
  );

  const nextLessons = unfinishedCourses.reduce(
    (nextLessons: LessonData[], [courseId, { lessons }]) => {
      // Find the course listing for this course state
      const course = courses.find((course) => course.id === courseId);

      if (course) {
        // Get the lesson listing (in recommended learning order)
        const lessonsArray = Object.values(course.lessons);
        // Get the users learning states (most recently chosen first)
        const lessonStatesArray = Object.entries(lessons);

        // Find the first lesson in the "Review" state
        // This will be the most recently chosen lesson that is complete
        const lastFinishedLesson = lessonStatesArray.find(
          ([, state]) => state === "Review"
        );

        if (lastFinishedLesson) {
          // Find the lesson in the course/lesson listing
          const lastFinishedLessonIndex = lessonsArray.findIndex(
            (lesson) => lesson.id === lastFinishedLesson[0]
          );
          if (lastFinishedLessonIndex > -1) {
            // Get all following lessons in the course
            const lessonsAfterFinished = lessonsArray.slice(
              lastFinishedLessonIndex + 1
            );

            // Find the first of the remaining lessons which has never been attempted
            const nextLesson = lessonsAfterFinished.find(
              (lesson) => !lessons[lesson.id]
            );

            if (nextLesson) {
              nextLessons.push({
                course: nextLesson.courseId,
                lesson: nextLesson.id,
              });
            }
          }
        }
      }

      return nextLessons;
    },
    []
  );

  return nextLessons;
}
