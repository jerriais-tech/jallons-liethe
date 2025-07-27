import React from "react";

import { useScheduledCards } from "@/store/deck/selectors";

import Main from "@/components/Main";
import P from "@/components/P";

const FinishedStudying: React.FC = () => {
  const [nextScheduledCard] = useScheduledCards();

  return (
    <>
      <Main>
        <P>You've finished studying for today!</P>
        {nextScheduledCard && (
          <P className="text-sm text-gray-600">
            The next card is scheduled for review on{" "}
            {new Date(
              nextScheduledCard.assessment!.nextScheduledAssessment
            ).toDateString()}
            .
          </P>
        )}
      </Main>
    </>
  );
};

export default FinishedStudying;
