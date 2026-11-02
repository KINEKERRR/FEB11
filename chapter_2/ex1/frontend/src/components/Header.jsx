import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components";
import { logout } from "../redux/actions/authActions";

const MdListAlt = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H8v-2h2V9h2v2h2v2h-2v4zm7-7H5V5h14v5z"/>
  </svg>
);

const MdWork = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
  </svg>
);

const MdAddBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  </svg>
);

const MdExitToApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
  </svg>
);

const Sidebar = styled.div`
  width: 200px;
  min-height: 100vh;
  background: #1a1a2e;
  color: white;
  padding: 20px 0;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.h2`
  padding: 0 20px 20px;
  margin: 0;
  font-size: 18px;
  border-bottom: 1px solid #333;
  color: white;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    color: #4fc3f7;
  }
`;

const NavIcon = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: #ccc;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    history.push("/login");
  };

  return (
    <Sidebar>
      <Logo>BestVacancies</Logo>
      <NavItem to="/vacancies" exact>
        <MdListAlt />
        Vacancies
      </NavItem>

      {user.role === "applicant" && (
        <NavItem to="/my-vacancies">
          <MdWork />
          My vacancies
        </NavItem>
      )}

      {user.role === "employer" && (
        <>
          <NavItem to="/active-vacancies">
            <MdWork />
            Active vacancies
          </NavItem>
          <NavItem to="/create-vacancy">
            <MdAddBox />
            Create vacancy
          </NavItem>
        </>
      )}

      <Spacer />
      <NavIcon onClick={handleLogout}>
        <MdExitToApp />
        Logout
      </NavIcon>
    </Sidebar>
  );
};

export default Header;
