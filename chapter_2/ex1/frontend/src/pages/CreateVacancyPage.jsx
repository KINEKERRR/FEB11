import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import api from "../api";

const Container = styled.div`
  padding: 30px;
`;

const Form = styled.form`
  background: white;
  border: 1px solid #4fc3f7;
  border-radius: 4px;
  padding: 30px;
  max-width: 700px;
`;



const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #4fc3f7;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #4fc3f7;
  border-radius: 4px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 10px;
  border: 1px solid #4fc3f7;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
`;

const CloseButton = styled.button`
  padding: 10px 24px;
  border: 1px solid #dc2626;
  border-radius: 4px;
  background: white;
  color: #dc2626;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #fef2f2;
  }
`;

const SaveButton = styled.button`
  padding: 10px 24px;
  border: 1px solid #16a34a;
  border-radius: 4px;
  background: white;
  color: #16a34a;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #f0fdf4;
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

const englishLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const grades = ["Junior", "Middle", "Senior", "Lead"];
const availableTags = ["React", "TypeScript", "Node.js", "Python", "Java", "Go", "AWS", "Docker", "PostgreSQL", "MongoDB"];

const CreateVacancyPage = () => {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [englishLevel, setEnglishLevel] = useState("A1");
  const [grade, setGrade] = useState("Junior");
  const [tags, setTags] = useState([]);
  const [salary, setSalary] = useState("");
  const [company, setCompany] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !salary.trim() || !company.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      await api.post("/vacancies", {
        title: title.trim(),
        description: description.trim(),
        salary: salary.trim(),
        company: company.trim(),
        englishLevel,
        grade,
        tags: tags.length > 0 ? tags.join(", ") : "",
      });

      history.push("/active-vacancies");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create vacancy");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    history.push("/active-vacancies");
  };

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Container>
      <h1 style={{ margin: "0 0 25px", fontSize: "24px" }}>Create Vacancy</h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Vacancy title</Label>
          <Input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Vacancy description</Label>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Salary</Label>
          <Input
            type="text"
            placeholder="e.g. 150000"
            value={salary}
            onChange={(event) => setSalary(event.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Company</Label>
          <Input
            type="text"
            placeholder="Company name"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>English lvl</Label>
          <Select value={englishLevel} onChange={(event) => setEnglishLevel(event.target.value)}>
            {englishLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Grade</Label>
          <Select value={grade} onChange={(event) => setGrade(event.target.value)}>
            {grades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Tags</Label>
          <Select onChange={(event) => toggleTag(event.target.value)} value="">
            <option value="" disabled>Select tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </Select>
          {tags.length > 0 && (
            <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {tags.map((tag) => (
                <span key={tag} style={{
                  padding: "4px 10px",
                  border: "1px solid #4fc3f7",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                }} onClick={() => toggleTag(tag)}>
                  {tag} ×
                </span>
              ))}
            </div>
          )}
        </FormGroup>

        {error && <ErrorText>{error}</ErrorText>}

        <ButtonGroup>
          <CloseButton type="button" onClick={handleClose}>Close</CloseButton>
          <SaveButton type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </SaveButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default CreateVacancyPage;
