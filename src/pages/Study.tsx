import React, { useCallback, useState } from "react";
import H1 from "../components/H1";
import Header from "../components/Header";
import Main from "../components/Main";
import Nav from "../components/Nav";
import Card from "../components/Card";
import NavButton from "../components/NavButton";

const Study: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClickReveal = useCallback(() => setIsRevealed(true), []);

  return (
    <>
      <Header>
        <H1>Study</H1>
      </Header>

      <Nav>
        {isRevealed ? (
          <>
            <NavButton color="rose">Forgot</NavButton>
            <NavButton color="orange">Struggled</NavButton>
            <NavButton color="green" autoFocus>
              Remembered
            </NavButton>
            <NavButton>Mastered</NavButton>
          </>
        ) : (
          <NavButton onClick={handleClickReveal} autoFocus>
            Reveal
          </NavButton>
        )}
      </Nav>

      <Main>
        <Card
          front="Bouônjour"
          back="Hello"
          revealed={isRevealed}
          onClick={handleClickReveal}
        />
      </Main>
    </>
  );
};

export default Study;
