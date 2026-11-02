import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../api";
import { Link } from "react-router-dom";

const MdCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
  </svg>
);

const Container = styled.div`
  padding: 30px;
`;

const Title = styled.h1`
  margin: 0 0 25px;
  font-size: 24px;
`;

const List = styled.div`
  display: grid;
  gap: 15px;
`;

const Card = styled.div`
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  &:hover {
    border-color: #4fc3f7;
  }
`;

const Content = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
`;

const Description = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const RespondedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4caf50;
  font-size: 13px;
  white-space: nowrap;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #dc2626;
  border-radius: 4px;
  background: white;
  color: #dc2626;
  font-size: 13px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #fef2f2;
  }
`;

const Message = styled.p`
  color: #666;
  font-size: 16px;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 16px;
`;

const MyVacanciesPage = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const response = await api.get("/my-vacancies");
        setVacancies(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load vacancies");
      } finally {
        setLoading(false);
      }
    };

    loadVacancies();
  }, []);

  const handleCancel = async (vacancyId) => {
    try {
      await api.delete(`/vacancies/${vacancyId}/apply`);
      setVacancies((prev) => prev.filter((v) => v.id !== vacancyId));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to cancel response");
    }
  };

  return (
    <Container>
      <Title>My vacancies</Title>
      {loading && <Message>Loading...</Message>}
      {error && <ErrorText>{error}</ErrorText>}
      {!loading && !error && vacancies.length === 0 && (
        <Message>You have not responded to any vacancies yet.</Message>
      )}
      <List>
        {vacancies.map((vacancy) => (
          <Card key={vacancy.id}>
            <Content>
              <Link to={`/vacancies/${vacancy.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <CardTitle>{vacancy.title}</CardTitle>
                <Description>{vacancy.description.substring(0, 50)}...</Description>
              </Link>
              <CancelButton onClick={() => handleCancel(vacancy.id)}>
                Cancel response
              </CancelButton>
            </Content>
            <RespondedBadge>
              <MdCheck />
              You responded
            </RespondedBadge>
          </Card>
        ))}
      </List>
    </Container>
  );
};

export default MyVacanciesPage;
