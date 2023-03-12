import { StyleSheet } from "react-native";

const global = StyleSheet.create({
  LoginLowercontainer: {
    alignItems: "center",
    // justifyContent: "center",
    maxHeight: 100,
  },
  LoginMiddlecontainer: {
    alignItems: "center",
  },
  LoginTopcontainer: {
    alignItems: "center",
    maxHeight: 100,
    borderBottomWidth: 2,
    borderBottomColor: "#ffe4e6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  LoginText: {
    color: "#ff1717",
    fontSize: 30,
    fontFamily: "sans-serif-light",
    position: "absolute",
    top: 70,
  },
  LoginInput: {
    borderColor: "black",
  },
});

export default global;
