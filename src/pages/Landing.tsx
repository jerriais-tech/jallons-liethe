import React from "react";
import H1 from "../components/H1";
import Header from "../components/Header";
import Main from "../components/Main";
import Nav from "../components/Nav";
import NavItem from "../components/NavItem";
import Logo from "@/components/Logo";
import P from "@/components/P";
import { useAllCards } from "@/store/deck/selectors";

const LandingPage: React.FC = () => {
  const cards = useAllCards();
  return (
    <>
      <Header>
        <H1>J'allons liéthe</H1>
      </Header>

      <Nav>
        {cards.length > 0 ? <NavItem to="/study">Study now</NavItem> : null}
        <NavItem to="/courses">Browse courses</NavItem>
      </Nav>

      <Main>
        <h2>Learn the vocabulary you need to read Jèrriais literature</h2>
        <Logo className="mx-12" />
        <P>
          Choose a <strong>course</strong> for the book you want to read, or a{" "}
          <strong>lesson</strong> for an individual chapter.
        </P>
        <P>
          Flashcards for all the words you need will be added to your personal{" "}
          <strong>deck</strong>, which you can <strong>study</strong> a little
          each day.
        </P>
      </Main>
    </>
  );
};

export default LandingPage;
