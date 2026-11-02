import api from "../../api";

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });

  try {
    const response = await api.post("/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    dispatch({
      type: "AUTH_SUCCESS",
      payload: response.data.user,
    });
  } catch (error) {
    dispatch({
      type: "AUTH_ERROR",
      payload: error.response?.data?.message || "Ошибка авторизации",
    });
  }
};

export const signup =
  (name, email, password, role) => async (dispatch) => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await api.post("/signup", {
        name,
        email,
        password,
        role,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: response.data.user,
      });
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.response?.data?.message || "Ошибка регистрации",
      });
    }
  };

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  dispatch({
    type: "LOGOUT",
  });
};
