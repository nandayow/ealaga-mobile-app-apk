import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import baseURL from "../../assets/common/baseUrl";
import { ToastAndroid } from "react-native";

export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const AUTH_LOGIN_REQUEST = "AUTH_LOGIN_REQUEST";
export const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
export const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";

const gravityToast = () => {
  ToastAndroid.showWithGravity(
    "login Successfully",
    ToastAndroid.LONG,
    ToastAndroid.CENTER
  );
};

export const loginUser = (user, dispatch) => {
  dispatch({
    type: AUTH_LOGIN_REQUEST,
  });

  fetch(`${baseURL}users/login`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        dispatch({
          type: AUTH_LOGIN_SUCCESS,
          payload: { token: decoded },
        });
        const token = data.token;
        AsyncStorage.setItem("jwt", token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded, user));
        gravityToast();
      } else {
        logoutUser(dispatch);
      }
    })
    .catch((err) => {
      dispatch({ type: AUTH_LOGIN_FAILURE, payload: err });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please fill correct email and password",
        text2: "",
      });
      logoutUser(dispatch);
    });
};

export const getUserProfile = (id) => {
  fetch(`${baseURL}users/${id}`, {
    method: "GET",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

export const logoutUser = (dispatch) => {
  AsyncStorage.removeItem("jwt");
  dispatch(setCurrentUser({}));
};

export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user,
  };
};
