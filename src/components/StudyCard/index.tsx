import React, { useState, useCallback, useEffect } from "react";
import { Rating } from "@austinshelby/simple-ts-fsrs";

import { CardData } from "@/store/deck/types";
import Main from "@/components/Main";
import Nav from "@/components/Nav";
import Card from "@/components/Card";
import NavButton from "@/components/NavButton";

import "./index.css";
import Stats from "@/components/Stats";

interface Props {
  card: CardData;
  onRating: (rating: Rating) => void;
}

const StudyCard: React.FC<Props> = ({ card, onRating }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const handleClickReveal = useCallback(() => setIsRevealed(true), []);

  useEffect(() => {
    setIsRevealed(false);
  }, [card]);

  return (
    <>
      <Nav>
        {isRevealed ? (
          <>
            <NavButton onClick={() => onRating("Forgot")} color="rose">
              Forgot
            </NavButton>
            <NavButton onClick={() => onRating("Struggled")} color="orange">
              Struggled
            </NavButton>
            <NavButton
              onClick={() => onRating("Remembered")}
              color="green"
              autoFocus
            >
              Remembered
            </NavButton>
            <NavButton onClick={() => onRating("Mastered")}>Mastered</NavButton>
          </>
        ) : (
          <NavButton onClick={handleClickReveal} autoFocus>
            Reveal
          </NavButton>
        )}
      </Nav>

      <Main>
        <Card
          front={card.front}
          back={card.back}
          revealed={isRevealed}
          onClick={handleClickReveal}
        />
        <Stats />
      </Main>
    </>
  );
};

export default StudyCard;
