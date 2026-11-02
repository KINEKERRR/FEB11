const initialState = {
  items: [],
  loading: false,
  error: null,
};

const vacancyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "VACANCIES_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "VACANCIES_SUCCESS":
      return {
        ...state,
        loading: false,
        items: action.payload,
      };

    case "VACANCIES_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default vacancyReducer;
