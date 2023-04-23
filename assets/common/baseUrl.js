import { Platform } from "react-native";

let baseURL = "";

{
  Platform.OS == "android"
    ? (baseURL = "https://server-ealaga-production.up.railway.app/api/v1/")
    : (baseURL = "http://localhost:4000/api/v1/");
}

export default baseURL;
