import {
  SET_CURRENT_USER,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
} from "../actions/Auth.actions";
import isEmpty from "../../assets/common/is-empty";

const initialState = {
  isLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        userProfile: action.userProfile,
      };

    case AUTH_LOGIN_REQUEST:
      return {
         ...state, 
         isLoading: true ,
         error: null};

    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        // token: action.payload.token,
      };
    case AUTH_LOGIN_FAILURE:
      return {
         ...state, 
         isLoading: false, 
         error: action.payload};

    default:
      return state;
  }
}
