import React from "react";
import H1 from "../components/H1";
import Header from "../components/Header";
import Main from "../components/Main";
import Nav from "../components/Nav";
import NavItem from "../components/NavItem";

const LandingPage: React.FC = () => {
  return (
    <>
      <Header>
        <H1>J'allons liéthe</H1>
      </Header>

      <Nav>
        <NavItem to="/study">Study now</NavItem>
        <NavItem to="/courses">Browse courses</NavItem>
      </Nav>

      <Main>
        <h2>Learn the vocabulary you need to read Jèrriais literature</h2>
      </Main>
    </>
  );
};

export default LandingPage;
