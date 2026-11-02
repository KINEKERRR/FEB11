import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getVacancies } from "../redux/actions/vacancyActions";
import VacancyCard from "../components/VacancyCard";

const Container = styled.div`
  padding: 30px;
  max-width: 1000px;
`;

const Title = styled.h1`
  margin: 0 0 25px;
  font-size: 24px;
`;

const List = styled.div`
  display: grid;
  gap: 15px;
`;

const Message = styled.p`
  color: #666;
  font-size: 16px;
`;

const Error = styled.p`
  color: #dc2626;
  font-size: 16px;
`;

const VacanciesPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.vacancies);

  useEffect(() => {
    dispatch(getVacancies());
  }, [dispatch]);

  return (
    <Container>
      <Title>Vacancies</Title>
      {loading && <Message>Loading...</Message>}
      {error && <Error>{error}</Error>}
      {!loading && !error && items.length === 0 && (
        <Message>No vacancies available.</Message>
      )}
      <List>
        {items.map((vacancy) => (
          <VacancyCard key={vacancy.id} vacancy={vacancy} />
        ))}
      </List>
    </Container>
  );
};

export default VacanciesPage;
