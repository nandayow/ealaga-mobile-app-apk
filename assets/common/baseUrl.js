import { Platform } from "react-native";

let baseURL = "";

{
  Platform.OS == "android"
    ? (baseURL = "https://server-ealaga.onrender.com/api/v1/")
    : (baseURL = "http://localhost:4000/api/v1/");
}

export default baseURL;
