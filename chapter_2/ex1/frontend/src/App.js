import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import styled from "styled-components";

import LoginPage from "./pages/LoginPage";
import ApplicantSignupPage from "./pages/ApplicantSignupPage";
import EmployerSignupPage from "./pages/EmployerSignupPage";

import VacanciesPage from "./pages/VacanciesPage";
import VacancyPage from "./pages/VacancyPage";
import MyVacanciesPage from "./pages/MyVacanciesPage";

import ActiveVacanciesPage from "./pages/ActiveVacanciesPage";
import ActiveVacancyPage from "./pages/ActiveVacancyPage";
import CreateVacancyPage from "./pages/CreateVacancyPage";

const MainContent = styled.div`
  margin-left: 200px;
  min-height: 100vh;
  background: #f5f5f5;
`;

const App = () => {
  return (
    <>
      <Header />
      <MainContent>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={ApplicantSignupPage} />
          <Route exact path="/signup/company" component={EmployerSignupPage} />

          <PrivateRoute exact path="/vacancies/:id" component={VacancyPage} />
          <PrivateRoute exact path="/vacancies" component={VacanciesPage} />

          <PrivateRoute exact path="/my-vacancies" role="applicant" component={MyVacanciesPage} />

          <PrivateRoute exact path="/active-vacancies/:id" role="employer" component={ActiveVacancyPage} />
          <PrivateRoute exact path="/active-vacancies" role="employer" component={ActiveVacanciesPage} />
          <PrivateRoute exact path="/create-vacancy" role="employer" component={CreateVacancyPage} />

          <Redirect exact from="/" to="/vacancies" />
          <Redirect to="/vacancies" />
        </Switch>
      </MainContent>
    </>
  );
};

export default App;
