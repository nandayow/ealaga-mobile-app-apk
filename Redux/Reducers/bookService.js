import {
  BOOK_A_SERVICE,
  REMOVE_FROM_SERVICE,
  CLEAR_SERVICE,
} from "../constants";

const bookServices = (state = [], action) => {
  switch (action.type) {
    case BOOK_A_SERVICE:
      return [...state, action.payload];
    case REMOVE_FROM_SERVICE:
      return state.filter((bookService) => bookService !== action.payload);
    case CLEAR_SERVICE:
      return (state = []);
  }
  return state;
};
export default bookServices;
