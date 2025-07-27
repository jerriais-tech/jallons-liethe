/* eslint @typescript-eslint/no-explicit-any: 0 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getNewCards,
  getTodaysNewCardsInternal,
  getScheduledCards,
  getTodaysScheduledCards,
  getTodaysCardsInternal,
  getCourseStates,
  getNextLessonSuggestions,
} from "./helpers";
import type { State } from "@austinshelby/simple-ts-fsrs";
import type { CardData, CourseStates, LessonData, Stats } from "./types";
import { Course, Lesson } from "@/data/types";

describe("getNewCards", () => {
  // A card that has been assessed
  const assessedCard: CardData = {
    front: "Assessed Front",
    back: "Assessed Back",
    lessons: [{ course: "Math", lesson: "Algebra" }],
    assessment: {
      assessedAt: 1677628800000, // Some fixed date
      nextScheduledAssessment: 1677715200000,
      stability: 10,
      difficulty: 0.5,
      state: "Review",
    },
  };

  // A brand new card that has never been seen
  const newCard: CardData = {
    front: "New Front",
    back: "New Back",
    lessons: [{ course: "History", lesson: "The Romans" }],
  };

  it("should return only the cards without an assessment property", () => {
    const allCards = [assessedCard, newCard];
    const result = getNewCards(allCards);
    expect(result).toEqual([newCard]);
    expect(result.length).toBe(1);
  });

  it("should return all cards if none have been assessed", () => {
    const allCards = [newCard, { ...newCard, front: "Another New Card" }];
    const result = getNewCards(allCards);
    expect(result).toEqual(allCards);
    expect(result.length).toBe(2);
  });

  it("should return an empty array if all cards have been assessed", () => {
    const allCards = [
      assessedCard,
      { ...assessedCard, front: "Another Assessed Card" },
    ];
    const result = getNewCards(allCards);
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it("should return an empty array when given an empty array", () => {
    const allCards: CardData[] = [];
    const result = getNewCards(allCards);
    expect(result).toEqual([]);
  });
});

describe("getTodaysNewCardsInternal", () => {
  // A mock fuzzer that provides a predictable, stable sort for testing.
  // It will sort cards alphabetically by their 'front' text.
  class MockStableFuzzer {
    // The `sort` method in the production code doesn't use a/b, but for
    // a stable test, our mock will. This is a standard way to test
    // such functionality. The JS sort mechanism will pass a and b to it.
    sort(a: CardData, b: CardData) {
      if (a.front < b.front) return -1;
      if (a.front > b.front) return 1;
      return 0;
    }
    // We need a constructor to be instantiated with `new Fuzzer()`
    constructor() {}
  }

  // Create the function to be tested, injecting our mock fuzzer
  const getTodaysNewCards = getTodaysNewCardsInternal(MockStableFuzzer as any);

  // Define a pool of new cards to use in the tests
  const cardA: CardData = { front: "A", back: "a", lessons: [] };
  const cardB: CardData = { front: "B", back: "b", lessons: [] };
  const cardC: CardData = { front: "C", back: "c", lessons: [] };
  const cardD: CardData = { front: "D", back: "d", lessons: [] };
  const cardE: CardData = { front: "E", back: "e", lessons: [] };

  let newCards: CardData[];

  // Because the function mutates the array with `splice`, we reset it before each test
  beforeEach(() => {
    newCards = [cardC, cardA, cardE, cardB, cardD]; // Intentionally unsorted
  });

  it("should return the correct number of new cards for the day", () => {
    const stats: Stats = {
      today: 0,
      newCardsPerDay: 3,
      newCardsToday: 1,
      reviewsPerDay: 0,
      reviewsToday: 0,
    };
    // Should return 3 - 1 = 2 cards.
    // Because of our mock sorter, these should be cards A and B.
    const result = getTodaysNewCards(newCards, stats);
    expect(result.length).toBe(2);
    expect(result.map((c) => c.front)).toEqual(["A", "B"]);
  });

  it("should return all available cards if more are needed than exist", () => {
    const stats: Stats = {
      today: 0,
      newCardsPerDay: 10,
      newCardsToday: 0,
      reviewsPerDay: 0,
      reviewsToday: 0,
    };
    // Needs 10, but only 5 are available.
    const result = getTodaysNewCards(newCards, stats);
    expect(result.length).toBe(5);
    expect(result.map((c) => c.front)).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("should return an empty array if the daily new card limit has been met", () => {
    const stats: Stats = {
      today: 0,
      newCardsPerDay: 20,
      newCardsToday: 20,
      reviewsPerDay: 0,
      reviewsToday: 0,
    };
    const result = getTodaysNewCards(newCards, stats);
    expect(result).toEqual([]);
  });

  // This test is expected to fail with the current implementation.
  // The goal is to fix the code until this test passes.
  it("should return an empty array if more new cards have been studied today than the daily limit", () => {
    const stats: Stats = {
      today: 0,
      newCardsPerDay: 10,
      newCardsToday: 12, // Exceeded the limit
      reviewsPerDay: 0,
      reviewsToday: 0,
    };
    // The current implementation with splice(-2) would incorrectly return 3 cards.
    // The correct behavior is to return an empty array.
    const result = getTodaysNewCards(newCards, stats);
    expect(result).toEqual([]);
  });
});

describe("getScheduledCards", () => {
  // A new card without an assessment
  const newCard: CardData = {
    front: "New",
    back: "new",
    lessons: [],
  };

  // Three scheduled cards with different assessment times
  const cardScheduledToday: CardData = {
    front: "Today",
    back: "today",
    lessons: [],
    assessment: {
      nextScheduledAssessment: 100, // Earliest
      assessedAt: 1,
      stability: 1,
      difficulty: 1,
      state: "Review",
    },
  };

  const cardScheduledTomorrow: CardData = {
    front: "Tomorrow",
    back: "tomorrow",
    lessons: [],
    assessment: {
      nextScheduledAssessment: 200, // Middle
      assessedAt: 1,
      stability: 1,
      difficulty: 1,
      state: "Review",
    },
  };

  const cardScheduledNextWeek: CardData = {
    front: "Next Week",
    back: "next week",
    lessons: [],
    assessment: {
      nextScheduledAssessment: 300, // Last
      assessedAt: 1,
      stability: 1,
      difficulty: 1,
      state: "Review",
    },
  };

  it("should filter out new cards and sort scheduled cards by next assessment time", () => {
    // Input is intentionally unsorted and mixed
    const allCards = [
      cardScheduledTomorrow,
      newCard,
      cardScheduledNextWeek,
      cardScheduledToday,
    ];
    const result = getScheduledCards(allCards);

    // Expecting only the scheduled cards, sorted by nextScheduledAssessment
    expect(result).toEqual([
      cardScheduledToday,
      cardScheduledTomorrow,
      cardScheduledNextWeek,
    ]);
    expect(result.length).toBe(3);
  });

  it("should return a sorted array even if input is already sorted", () => {
    const allCards = [
      cardScheduledToday,
      cardScheduledTomorrow,
      cardScheduledNextWeek,
    ];
    const result = getScheduledCards(allCards);
    expect(result).toEqual([
      cardScheduledToday,
      cardScheduledTomorrow,
      cardScheduledNextWeek,
    ]);
  });

  it("should return an empty array if only new cards are provided", () => {
    const allCards = [newCard, { ...newCard, front: "Another New Card" }];
    const result = getScheduledCards(allCards);
    expect(result).toEqual([]);
  });

  it("should return an empty array for an empty input array", () => {
    const allCards: CardData[] = [];
    const result = getScheduledCards(allCards);
    expect(result).toEqual([]);
  });
});

describe("getTodaysScheduledCards", () => {
  // We will set a fixed "current" time for our tests
  const MOCK_DATE = new Date("2023-10-27T10:00:00.000");

  // This is the timestamp for midnight at the end of our mock day
  const MIDNIGHT_TONIGHT = new Date("2023-10-28T00:00:00.000").getTime();

  beforeEach(() => {
    // Tell Vitest to use fake timers
    vi.useFakeTimers();
    // Set the "current" date to our MOCK_DATE
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    // Restore the real timers after each test
    vi.useRealTimers();
  });

  // Helper to create a base assessed card
  const createAssessedCard = (
    front: string,
    nextScheduledAssessment: number
  ): CardData => ({
    front,
    back: "...",
    lessons: [],
    assessment: {
      nextScheduledAssessment,
      assessedAt: 1,
      stability: 1,
      difficulty: 1,
      state: "Review",
    },
  });

  const cardDueYesterday = createAssessedCard(
    "Past Due",
    MIDNIGHT_TONIGHT - 86400 * 1000
  ); // Due 24 hours ago
  const cardDueThisMorning = createAssessedCard(
    "Due Today",
    MOCK_DATE.getTime() - 60000
  ); // Due one minute ago
  const cardDueTonight = createAssessedCard(
    "Due Tonight",
    MIDNIGHT_TONIGHT - 1
  ); // Due 1ms before midnight
  const cardDueExactlyAtMidnight = createAssessedCard(
    "Due at Midnight",
    MIDNIGHT_TONIGHT
  );
  const cardDueTomorrow = createAssessedCard(
    "Due Tomorrow",
    MIDNIGHT_TONIGHT + 86400 * 1000
  ); // Due 24 hours from midnight

  it("should return cards scheduled for today or in the past", () => {
    const scheduledCards = [
      cardDueYesterday,
      cardDueThisMorning,
      cardDueTonight,
      cardDueTomorrow,
    ];
    const result = getTodaysScheduledCards(scheduledCards);
    expect(result).toEqual([
      cardDueYesterday,
      cardDueThisMorning,
      cardDueTonight,
    ]);
    expect(result.length).toBe(3);
  });

  it("should NOT include a card scheduled for exactly midnight tonight", () => {
    const scheduledCards = [cardDueExactlyAtMidnight, cardDueTonight];
    const result = getTodaysScheduledCards(scheduledCards);
    expect(result).toEqual([cardDueTonight]);
    expect(result.length).toBe(1);
  });

  it("should return an empty array if no cards are due today", () => {
    const scheduledCards = [cardDueTomorrow, cardDueExactlyAtMidnight];
    const result = getTodaysScheduledCards(scheduledCards);
    expect(result).toEqual([]);
  });

  it("should filter out a card that might not have an assessment", () => {
    const newCard: CardData = { front: "New", back: "new", lessons: [] };
    const scheduledCards = [cardDueThisMorning, newCard as any]; // Using `as any` to bypass TS for the test
    const result = getTodaysScheduledCards(scheduledCards);
    expect(result).toEqual([cardDueThisMorning]);
  });

  it("should return an empty array for an empty input array", () => {
    const result = getTodaysScheduledCards([]);
    expect(result).toEqual([]);
  });
});

describe("getTodaysCardsInternal", () => {
  // A mock fuzzer for predictable sorting (alphabetical by card front)
  class MockStableFuzzer {
    sort(a: CardData, b: CardData) {
      if (a.front < b.front) return -1;
      if (a.front > b.front) return 1;
      return 0;
    }
    constructor() {}
  }

  // Create the function to be tested, injecting our mock fuzzer
  const getTodaysCards = getTodaysCardsInternal(MockStableFuzzer as any);

  // Time-mocking setup
  const MOCK_DATE = new Date("2023-10-27T12:00:00.000Z"); // Mock "now"
  // Per your request, making the urgent window easy to configure for tests
  const URGENT_WINDOW_MS = 5 * 60 * 1000;
  const URGENCY_BOUNDARY = MOCK_DATE.getTime() - URGENT_WINDOW_MS;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Helper to create a base assessed card
  const createAssessedCard = (
    front: string,
    nextScheduledAssessment: number
  ): CardData => ({
    front,
    back: "...",
    lessons: [],
    assessment: {
      nextScheduledAssessment,
      assessedAt: 1,
      stability: 1,
      difficulty: 1,
      state: "Relearning",
    },
  });

  // --- Test Data ---
  // Urgent cards: scheduled *after* the urgency boundary (i.e., in the last 5 mins)
  const urgentCardB = createAssessedCard("Urgent B", URGENCY_BOUNDARY + 20000); // Scheduled ~20s ago
  const urgentCardA = createAssessedCard("Urgent A", URGENCY_BOUNDARY + 10000); // Scheduled ~10s ago

  // Other scheduled cards: scheduled *before* the urgency boundary
  const otherCardD = createAssessedCard("Other D", URGENCY_BOUNDARY - 10000); // Scheduled ~5m 10s ago
  const otherCardC = createAssessedCard("Other C", URGENCY_BOUNDARY - 20000); // Scheduled ~5m 20s ago

  // New cards (no assessment)
  const newCardE = { front: "New E", back: "e", lessons: [] };
  const newCardF = { front: "New F", back: "f", lessons: [] };

  it("should return cards in the correct order: urgent, new, then other scheduled", () => {
    const todaysScheduledCards = [
      otherCardD,
      urgentCardB,
      otherCardC,
      urgentCardA,
    ]; // Unsorted mix
    const newCards = [newCardF, newCardE]; // Unsorted
    const stats: Stats = {
      reviewsPerDay: 100,
      reviewsToday: 0,
      today: 0,
      newCardsPerDay: 0,
      newCardsToday: 0,
    };

    const result = getTodaysCards(todaysScheduledCards, newCards, stats);

    // Expected order:
    // 1. Sorted urgent cards: [urgentCardA, urgentCardB]
    // 2. New cards (passed in as-is): [newCardF, newCardE]
    // 3. Sorted other cards: [otherCardC, otherCardD]
    const expectedOrder = [
      "Urgent A",
      "Urgent B",
      "New F",
      "New E",
      "Other C",
      "Other D",
    ];

    expect(result.map((c) => c.front)).toEqual(expectedOrder);
    expect(result.length).toBe(6);
  });

  it("should limit the number of cards based on stats.reviewsPerDay", () => {
    const todaysScheduledCards = [otherCardC, urgentCardA];
    const newCards = [newCardE];
    // Daily limit of 5, 3 already done -> should return 2 cards
    const stats: Stats = {
      reviewsPerDay: 5,
      reviewsToday: 3,
      today: 0,
      newCardsPerDay: 0,
      newCardsToday: 0,
    };

    const result = getTodaysCards(todaysScheduledCards, newCards, stats);

    // The full combined list would be [urgentCardA, newCardE, otherCardC]
    // We expect only the first 2.
    expect(result.length).toBe(2);
    expect(result.map((c) => c.front)).toEqual(["Urgent A", "New E"]);
  });

  it("should return an empty array if the review limit for the day is met", () => {
    const todaysScheduledCards = [urgentCardA];
    const newCards = [newCardE];
    const stats: Stats = {
      reviewsPerDay: 10,
      reviewsToday: 10,
      today: 0,
      newCardsPerDay: 0,
      newCardsToday: 0,
    };

    const result = getTodaysCards(todaysScheduledCards, newCards, stats);
    expect(result).toEqual([]);
  });

  // This test is expected to fail with the current implementation.
  // The goal is to fix the code until this test passes.
  it("should return an empty array if more reviews have been done than the daily limit", () => {
    const todaysScheduledCards = [urgentCardA];
    const newCards = [newCardE];
    // 12 reviews done, but limit is 10. `splice` would get a negative index.
    const stats: Stats = {
      reviewsPerDay: 10,
      reviewsToday: 12,
      today: 0,
      newCardsPerDay: 0,
      newCardsToday: 0,
    };

    const result = getTodaysCards(todaysScheduledCards, newCards, stats);
    expect(result).toEqual([]);
  });

  it("should handle cases with no urgent cards correctly", () => {
    const todaysScheduledCards = [otherCardD, otherCardC];
    const newCards = [newCardE];
    const stats: Stats = {
      reviewsPerDay: 100,
      reviewsToday: 0,
      today: 0,
      newCardsPerDay: 0,
      newCardsToday: 0,
    };

    const result = getTodaysCards(todaysScheduledCards, newCards, stats);
    expect(result.map((c) => c.front)).toEqual(["New E", "Other C", "Other D"]);
  });
});

describe("getCourseStates", () => {
  // Helper to create cards for tests concisely
  const createCard = (lessons: LessonData[], state?: State): CardData => {
    const card: CardData = {
      front: `Card for ${lessons[0].lesson}`,
      back: "...",
      lessons,
    };
    if (state) {
      card.assessment = {
        state,
        assessedAt: 1,
        nextScheduledAssessment: 1,
        stability: 1,
        difficulty: 1,
      };
    }
    return card;
  };

  it("should return an empty object for an empty card array", () => {
    const cards: CardData[] = [];
    expect(getCourseStates(cards)).toEqual({});
  });

  it("should mark lessons and courses as 'Learning' for new cards", () => {
    const cards: CardData[] = [
      createCard([{ course: "JS", lesson: "Variables" }]), // New card
      createCard([{ course: "JS", lesson: "Functions" }]), // New card
    ];
    const states = getCourseStates(cards);
    expect(states).toEqual({
      JS: {
        state: "Learning",
        lessons: {
          Variables: "Learning",
          Functions: "Learning",
        },
      },
    });
  });

  it("should mark lessons and courses as 'Review' if all cards are reviewed", () => {
    const cards: CardData[] = [
      createCard([{ course: "CSS", lesson: "Selectors" }], "Review"),
      createCard([{ course: "CSS", lesson: "Flexbox" }], "Review"),
    ];
    const states = getCourseStates(cards);
    expect(states).toEqual({
      CSS: {
        state: "Review",
        lessons: {
          Selectors: "Review",
          Flexbox: "Review",
        },
      },
    });
  });

  it("should correctly calculate mixed states within a single course", () => {
    const cards: CardData[] = [
      // Lesson 1: Has one card in "Review" state
      createCard([{ course: "TS", lesson: "Generics" }], "Review"),
      // Lesson 2: Has cards in "Review" and "Relearning", should resolve to "Relearning"
      createCard([{ course: "TS", lesson: "Interfaces" }], "Review"),
      createCard([{ course: "TS", lesson: "Interfaces" }], "Relearning"),
      // Lesson 3: Has one card, it's a new card, should resolve to "Learning"
      createCard([{ course: "TS", lesson: "Modules" }]),
    ];

    const states = getCourseStates(cards);

    // The overall course state should be "Learning" because it's the lowest state present.
    expect(states).toEqual({
      TS: {
        state: "Learning",
        lessons: {
          Generics: "Review",
          Interfaces: "Relearning", // Correctly determined by getLowestState
          Modules: "Learning",
        },
      },
    });
  });

  it("should handle multiple courses independently", () => {
    const cards: CardData[] = [
      // A fully reviewed CSS course
      createCard([{ course: "CSS", lesson: "Selectors" }], "Review"),
      // A JS course that is still being learned
      createCard([{ course: "JS", lesson: "Variables" }], "Review"),
      createCard([{ course: "JS", lesson: "Scope" }]), // New card makes the course "Learning"
    ];

    const states = getCourseStates(cards);
    expect(states).toEqual({
      CSS: {
        state: "Review",
        lessons: {
          Selectors: "Review",
        },
      },
      JS: {
        state: "Learning",
        lessons: {
          Variables: "Review",
          Scope: "Learning",
        },
      },
    });
  });
  describe("getNextLessonSuggestions", () => {
    // --- Test Data Setup ---
    // This data represents the canonical structure and order of courses/lessons.
    const jsLessons: Lesson[] = [
      {
        id: "js-l1",
        courseId: "JS",
        title: "Variables",
        image: "",
        vocabulary: [],
      },
      {
        id: "js-l2",
        courseId: "JS",
        title: "Functions",
        image: "",
        vocabulary: [],
      },
      {
        id: "js-l3",
        courseId: "JS",
        title: "Arrays",
        image: "",
        vocabulary: [],
      },
      {
        id: "js-l4",
        courseId: "JS",
        title: "Objects",
        image: "",
        vocabulary: [],
      },
    ];
    const cssLessons: Lesson[] = [
      {
        id: "css-l1",
        courseId: "CSS",
        title: "Selectors",
        image: "",
        vocabulary: [],
      },
      {
        id: "css-l2",
        courseId: "CSS",
        title: "Flexbox",
        image: "",
        vocabulary: [],
      },
    ];
    const mockCourses: Course[] = [
      { id: "JS", title: "JavaScript", image: "", lessons: jsLessons },
      { id: "CSS", title: "CSS Basics", image: "", lessons: cssLessons },
    ];

    it("should suggest the next untouched lesson after the most recently reviewed one", () => {
      const states: CourseStates = {
        JS: {
          state: "Learning",
          // L3 was reviewed most recently, L2 is in progress, L1 was reviewed earlier.
          // The order here simulates the `reduceRight` logic from getCourseStates.
          lessons: {
            "js-l3": "Review",
            "js-l2": "Learning",
            "js-l1": "Review",
          },
        },
      };
      // Expected: Find L3 as last finished. Look at lessons after it ([L4]).
      // Find L4 as the first untouched lesson. Suggest L4.
      const result = getNextLessonSuggestions(mockCourses, states);
      expect(result).toEqual([{ course: "JS", lesson: "js-l4" }]);
    });

    it("should return no suggestion if a course has no reviewed lessons yet", () => {
      const states: CourseStates = {
        JS: {
          state: "Learning",
          lessons: { "js-l1": "Learning" }, // Only in-progress lessons
        },
      };
      // Expected: No lesson is "Review", so `lastFinishedLesson` is undefined.
      const result = getNextLessonSuggestions(mockCourses, states);
      expect(result).toEqual([]);
    });

    it("should return no suggestion if all subsequent lessons have already been started", () => {
      const states: CourseStates = {
        JS: {
          state: "Learning",
          lessons: {
            "js-l1": "Review", // Last (and only) finished lesson
            "js-l2": "Learning", // Started
            "js-l3": "Relearning", // Also started
            "js-l4": "Learning", // Also started
          },
        },
      };
      // Expected: Find L1. Look at L2, L3, L4. None are untouched. No suggestion.
      const result = getNextLessonSuggestions(mockCourses, states);
      expect(result).toEqual([]);
    });

    it("should ignore courses that are fully reviewed", () => {
      const states: CourseStates = {
        JS: {
          state: "Learning",
          lessons: { "js-l1": "Review" },
        },
        CSS: {
          state: "Review", // This entire course should be filtered out first.
          lessons: { "css-l1": "Review", "css-l2": "Review" },
        },
      };
      // Expected: Only a suggestion for the JS course.
      const result = getNextLessonSuggestions(mockCourses, states);
      expect(result).toEqual([{ course: "JS", lesson: "js-l2" }]);
    });

    it("should handle multiple unfinished courses and safely ignore invalid course IDs", () => {
      const states: CourseStates = {
        JS: {
          // Should suggest js-l2
          state: "Learning",
          lessons: { "js-l1": "Review" },
        },
        CSS: {
          // Should suggest css-l1 as it has no reviewed lessons
          state: "Learning",
          lessons: { "css-l2": "Learning" },
        },
        GHOST_COURSE: {
          // Should be safely ignored
          state: "Learning",
          lessons: {},
        },
      };
      // Expected: A suggestion for JS, but none for CSS or the ghost course.
      const result = getNextLessonSuggestions(mockCourses, states);
      expect(result).toEqual([{ course: "JS", lesson: "js-l2" }]);
    });

    it("should return an empty array if given empty inputs", () => {
      expect(getNextLessonSuggestions([], {})).toEqual([]);
      expect(getNextLessonSuggestions(mockCourses, {})).toEqual([]);
    });
  });
});
