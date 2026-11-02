import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../api";

const PageLayout = styled.div`
  display: flex;
  gap: 30px;
  padding: 30px;
`;

const SidebarList = styled.div`
  width: 350px;
  flex-shrink: 0;
`;

const DetailPanel = styled.div`
  flex: 1;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 30px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  margin: 0 0 15px;
  font-size: 24px;
`;

const DescriptionBlock = styled.div`
  background: #e1bee7;
  padding: 30px;
  border-radius: 4px;
  margin: 20px 0;
  min-height: 200px;
`;

const DescriptionTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const ContactsSection = styled.div`
  margin: 30px 0;
`;

const ContactsTitle = styled.h3`
  margin: 0 0 15px;
  font-size: 18px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  padding: 6px 14px;
  border: 1px solid #4fc3f7;
  border-radius: 4px;
  font-size: 13px;
  color: #2563eb;
  background: white;
`;

const CloseButton = styled.button`
  padding: 12px 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 14px;
`;

const Message = styled.p`
  color: #666;
  font-size: 16px;
`;

const ActiveVacancyPage = () => {
  const { id } = useParams();
  const history = useHistory();

  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");

  const [allVacancies, setAllVacancies] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vacancyRes, listRes] = await Promise.all([
          api.get(`/active-vacancies/${id}`),
          api.get("/active-vacancies"),
        ]);
        setVacancy(vacancyRes.data);
        setAllVacancies(listRes.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load vacancy");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleClose = async () => {
    setClosing(true);
    setError("");

    try {
      await api.put(`/vacancies/${id}`, { isActive: 0 });
      history.push("/active-vacancies");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to close vacancy");
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return <Message>Loading...</Message>;
  }

  if (error && !vacancy) {
    return (
      <div>
        <ErrorText>{error}</ErrorText>
        <Link to="/active-vacancies">Back to my vacancies</Link>
      </div>
    );
  }

  const tags = vacancy.tags ? vacancy.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <PageLayout>
      <SidebarList>
        <BackLink to="/active-vacancies">← Back to my vacancies</BackLink>
        {allVacancies.map((v) => (
          <div key={v.id} style={{ marginBottom: "15px" }}>
            <Link to={`/active-vacancies/${v.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                padding: "15px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{v.title}</div>
                  <div style={{ color: "#666", fontSize: "13px", marginTop: "5px" }}>
                    {v.description.substring(0, 50)}...
                  </div>
                </div>
                <span>👤 {v.responsesCount || 0}</span>
              </div>
            </Link>
          </div>
        ))}
      </SidebarList>

      <DetailPanel>
        <Title>{vacancy.title}</Title>
        <div style={{ fontSize: "14px", color: "#666" }}>
          Company: {vacancy.company}
        </div>

        <DescriptionBlock>
          <DescriptionTitle>Vacancy description</DescriptionTitle>
        </DescriptionBlock>

        <ContactsSection>
          <ContactsTitle>Contacts</ContactsTitle>
          <TagsContainer>
            {tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsContainer>
        </ContactsSection>

        {vacancy.isActive === 1 && (
          <CloseButton onClick={handleClose} disabled={closing}>
            {closing ? "Closing..." : "Close vacancy"}
          </CloseButton>
        )}

        {error && <ErrorText>{error}</ErrorText>}
      </DetailPanel>
    </PageLayout>
  );
};

export default ActiveVacancyPage;
