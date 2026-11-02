import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, role, ...rest }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          return <Redirect to="/login" />;
        }

        if (role && user.role !== role) {
          return <Redirect to="/vacancies" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
