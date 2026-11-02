import api from "../../api";

export const getVacancies = () => async (dispatch) => {
  dispatch({ type: "VACANCIES_START" });

  try {
    const response = await api.get("/vacancies");

    dispatch({
      type: "VACANCIES_SUCCESS",
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: "VACANCIES_ERROR",
      payload: error.response?.data?.message || "Ошибка загрузки вакансий",
    });
  }
};

export const applyToVacancy = (id) => async (dispatch) => {
  await api.post(`/vacancies/${id}/apply`);
};

export const cancelApplication = (id) => async (dispatch) => {
  await api.delete(`/vacancies/${id}/apply`);
};

export const closeVacancy = (id) => async (dispatch) => {
  await api.put(`/vacancies/${id}`, { isActive: 0 });
};
