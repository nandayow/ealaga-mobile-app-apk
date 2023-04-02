import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity, 
  Dimensions, 
  Animated,
} from "react-native";

// Shared
import Colors from "../../Shared/Color";

// Dimensions
const windowWidth = Dimensions.get("window").width;

const VisitorViewContainer = (props) => {

  const position = new Animated.Value(0);

  Animated.loop(
    Animated.sequence([
      Animated.timing(position, {
        toValue: 10,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(position, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }),
    ])
  ).start();

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "column",
        },
      ]}
    > 
      <View style={{ flex: 1, backgroundColor: "white" }} />
      <View style={[styles.Middlecontainer, { flex: 2 }]}>
        <Animated.Image
          source={require("../../assets/icon.png")}
          style={[
            styles.imahe,
            {  bottom: position },
          ]}
        />
        <Animated.Image
          source={require("../../assets/ealaga.png")}
          style={{ width: 200, height: 100 , bottom: position }}
        />
      </View>
      <View style={[styles.Lowercontainer, { flex: 3 }]}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.appButtonContainerLogin}
            onPress={() => props.navigation.navigate("Login")}
          >
            <Text style={styles.appButtonTextLogin}>LOG IN</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.appButtonContainerRegister}
            onPress={() => props.navigation.navigate("Register")}
          >
            <Text style={styles.appButtonTextRegister}>Register</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.Line}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main,
    height: "100%",
  },
  Lowercontainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: windowWidth,
  },
  buttonContainer: {
    flex: 1,
  },
  appButtonContainerLogin: {
    backgroundColor: "#fff",
    borderWidth: 2,
    height: 50,
    width: windowWidth / 2.1,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    // margin: 5,
  },
  appButtonTextLogin: {
    fontSize: 14,
    color: "#ff1717",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  appButtonContainerRegister: {
    backgroundColor: "#ff1717",
    borderWidth: 2,
    height: 50,
    width: windowWidth / 2.1,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",

    // margin: 5,
  },
  appButtonTextRegister: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  Line: {
    backgroundColor: "#ff1717",
    height: 5,
    position: "absolute",
    bottom: 10,
    width: 250,
  },
  Middlecontainer: {
    paddingTop: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  imahe:{
    width: 100,
    height: 100,
  }
});
export default VisitorViewContainer;
