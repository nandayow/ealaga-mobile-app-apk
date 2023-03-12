import React, { useContext } from "react";
import {
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Colors from "./Color";
// Auth
import AuthGlobal from "../Context/store/AuthGlobal";
const Auth = false;
console.log(Auth)
const NormalHeader = (props) => {

  const context = useContext(AuthGlobal);

  return (
    <SafeAreaView style={styles.header}>
      <TouchableOpacity onPress={() => props.navigation.navigate("home")}>
        <Image
          source={require("../assets/ealaga.png")}
          resizeMode="contain"
          style={{ height: 60 }}
        />
      </TouchableOpacity>

    
          {context.stateUser.isAuthenticated === true ? (
            
            <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={() => props.navigation.navigate("Profile")}
          >
            <Image
              source={require("../assets/avatar.png")}
              resizeMode="contain"
              style={styles.image}
            />
            </TouchableOpacity>
           ) : null} 


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    paddingTop: 20,
    borderBottomWidth: 3,
    backgroundColor: Colors.rose_200,
    borderBottomColor: Colors.rose_300,
    shadowOpacity: 2,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  image: {
    height: 30,
    width: 30,
    position: "absolute",
    right: 10,
    bottom: 15,
    backgroundColor: Colors.rose_300,
    borderRadius: 20,
  },
  touchableOpacity: {
    position: "absolute",
    right: 10,
    bottom: 1,
  },
});


export default NormalHeader;
