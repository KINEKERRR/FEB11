import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const MdCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
  </svg>
);

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

const Title = styled.h3`
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

const VacancyCard = ({ vacancy }) => {
  const shortDescription = vacancy.description.substring(0, 50) + "...";

  return (
    <Card>
      <Content>
        <Link to={`/vacancies/${vacancy.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <Title>{vacancy.title}</Title>
          <Description>{shortDescription}</Description>
        </Link>
      </Content>
      {vacancy.responded === 1 && (
        <RespondedBadge>
          <MdCheck />
          You responded
        </RespondedBadge>
      )}
    </Card>
  );
};

export default VacancyCard;
