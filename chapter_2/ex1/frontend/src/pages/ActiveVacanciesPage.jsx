import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api';

const MdPerson = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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

const ResponseCount = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
  font-size: 16px;
  white-space: nowrap;
`;

const Message = styled.p`
  color: #666;
  font-size: 16px;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 16px;
`;

const ActiveVacanciesPage = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const response = await api.get('/active-vacancies');
        setVacancies(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load vacancies');
      } finally {
        setLoading(false);
      }
    };

    loadVacancies();
  }, []);

  return (
    <Container>
      <Title>Active vacancies</Title>
      {loading && <Message>Loading...</Message>}
      {error && <ErrorText>{error}</ErrorText>}
      {!loading && !error && vacancies.length === 0 && (
        <Message>You have no vacancies yet.</Message>
      )}
      <List>
        {vacancies.map((vacancy) => (
          <Card key={vacancy.id}>
            <Content>
              <Link
                to={`/active-vacancies/${vacancy.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <CardTitle>{vacancy.title}</CardTitle>
                <Description>{vacancy.description.substring(0, 50)}...</Description>
              </Link>
            </Content>
            <ResponseCount>
              <MdPerson />
              {vacancy.responsesCount || 0}
            </ResponseCount>
          </Card>
        ))}
      </List>
    </Container>
  );
};

export default ActiveVacanciesPage;
