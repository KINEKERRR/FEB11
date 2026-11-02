import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import vacancyReducer from "./reducers/vacancyReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  vacancies: vacancyReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
