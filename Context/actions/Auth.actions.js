import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import baseURL from "../../assets/common/baseUrl";
import { ToastAndroid } from "react-native";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

const gravityToast = () => {
  ToastAndroid.showWithGravity(
    "login Successfully",
    ToastAndroid.LONG,
    ToastAndroid.CENTER
  );
};

export const loginUser = (user, dispatch) => { 
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
        const token = data.token;
        AsyncStorage.setItem("jwt", token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded, user));
        gravityToast();
        const loading = false;
        dispatch(setLoadingspinner(loading));
      } else {
        logoutUser(dispatch);
      }
    })
    .catch((err) => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please fill correct email and password",
        text2: "",
      });
      const loading = false;
      dispatch(setLoadingspinner(loading));
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
export const setLoadingspinner = (loading) => {
  return {
    type: "res",
    isLoading: loading,
  };
};
