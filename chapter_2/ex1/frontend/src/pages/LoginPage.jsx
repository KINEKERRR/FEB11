import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import styled from "styled-components";
import { login } from "../redux/actions/authActions";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
`;

const Form = styled.form`
  width: 400px;
  padding: 30px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Title = styled.h1`
  margin: 0 0 25px;
  font-size: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  float: right;

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LinkText = styled.p`
  margin: 15px 0;
  font-size: 14px;
  text-align: center;

  a {
    color: #2563eb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 14px;
`;

const ClearFix = styled.div`
  clear: both;
`;

const LoginPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return <Redirect to="/vacancies" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    await dispatch(login(email, password));

    if (localStorage.getItem("token")) {
      history.push("/vacancies");
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>login</Title>

        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <ErrorText>{error}</ErrorText>}

        <LinkText>
          New to BestVacancies? <Link to="/signup">Create an account</Link>
        </LinkText>

        <ClearFix />

        <Button type="submit" disabled={loading}>
          Sign in
        </Button>
      </Form>
    </Wrapper>
  );
};

export default LoginPage;
