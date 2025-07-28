import React, { useCallback } from "react";
import { Rating } from "@austinshelby/simple-ts-fsrs";

import { useDeckActions } from "@/store/deck";
import { useDailyStats, useTodaysCards } from "@/store/deck/selectors";

import H1 from "@/components/H1";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import StudyCard from "@/components/StudyCard";
import StudySuggestions from "@/components/StudySuggestions";
import FinishedStudying from "@/components/FinishedStudying";

const Study: React.FC = () => {
  const actions = useDeckActions();
  const stats = useDailyStats();
  const canStudyMore =
    stats.newCardsToday < stats.newCardsPerDay &&
    stats.reviewsToday < stats.reviewsPerDay;

  const [card] = useTodaysCards();

  const handleRating = useCallback(
    (rating: Rating) => {
      actions.rateCard({ card, rating, time: Date.now() });
    },
    [card, actions]
  );

  return (
    <>
      <Header back={<BackButton to="/" />}>
        <H1>Study</H1>
      </Header>

      {card ? (
        <StudyCard card={card} onRating={handleRating} />
      ) : (
        <>{canStudyMore ? <StudySuggestions /> : <FinishedStudying />}</>
      )}
    </>
  );
};

export default Study;
