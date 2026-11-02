import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../api";
import { applyToVacancy, cancelApplication } from "../redux/actions/vacancyActions";

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

const MetaRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const MetaLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 500;
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

const ActionButton = styled.button`
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

const VacancyPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items: allVacancies, loading: listLoading } = useSelector((state) => state.vacancies);

  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadVacancy = useCallback(async () => {
    try {
      const response = await api.get(`/vacancies/${id}`);
      setVacancy(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load vacancy");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVacancy();
  }, [id, loadVacancy]);

  useEffect(() => {
    if (allVacancies.length === 0 && user?.role === "applicant") {
      dispatch({ type: "VACANCIES_START" });
      api.get("/vacancies").then((response) => {
        dispatch({ type: "VACANCIES_SUCCESS", payload: response.data });
      }).catch(() => {});
    }
  }, [allVacancies.length, dispatch, user?.role]);

  const handleApplication = async () => {
    setActionLoading(true);
    setError("");
    try {
      if (vacancy.responded) {
        await dispatch(cancelApplication(id));
      } else {
        await dispatch(applyToVacancy(id));
      }
      await loadVacancy();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to perform action");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Message>Loading...</Message>;
  }

  if (error && !vacancy) {
    return (
      <div>
        <ErrorText>{error}</ErrorText>
        <Link to="/vacancies">Back to vacancies</Link>
      </div>
    );
  }

  const tags = vacancy.tags ? vacancy.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <PageLayout>
      <SidebarList>
        <BackLink to="/vacancies">← Back to vacancies</BackLink>
        {listLoading && <Message>Loading...</Message>}
        {allVacancies.map((v) => (
          <div key={v.id} style={{ marginBottom: "15px" }}>
            <Link to={`/vacancies/${v.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                padding: "15px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}>
                <div style={{ fontWeight: 500 }}>{v.title}</div>
                <div style={{ color: "#666", fontSize: "13px", marginTop: "5px" }}>
                  {v.description.substring(0, 50)}...
                </div>
                {v.responded === 1 && (
                  <div style={{ color: "#4caf50", fontSize: "12px", marginTop: "5px" }}>
                    ✓ You responded
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </SidebarList>

      <DetailPanel>
        <Title>{vacancy.title}</Title>
        <MetaRow>
          <MetaLabel>English lvl</MetaLabel>
          <MetaValue>{vacancy.englishLevel || "A1"}</MetaValue>
          <MetaLabel>Grade</MetaLabel>
          <MetaValue>{vacancy.grade || "Junior"}</MetaValue>
        </MetaRow>

        <DescriptionBlock>
          <DescriptionTitle>Vacancy description</DescriptionTitle>
          <p style={{ marginTop: "15px", lineHeight: 1.6 }}>{vacancy.description}</p>
        </DescriptionBlock>

        <ContactsSection>
          <ContactsTitle>Contacts</ContactsTitle>
          <TagsContainer>
            {tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsContainer>
        </ContactsSection>

        {user.role === "applicant" && (
          <ActionButton
            onClick={handleApplication}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : vacancy.responded ? "Cancel response" : "Response"}
          </ActionButton>
        )}

        {user.role === "employer" && (
          <Message>Responses: {vacancy.responsesCount || 0}</Message>
        )}

        {error && <ErrorText>{error}</ErrorText>}
      </DetailPanel>
    </PageLayout>
  );
};

export default VacancyPage;
