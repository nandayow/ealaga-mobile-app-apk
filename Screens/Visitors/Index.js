import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";

// Shared
import Colors from "../../Shared/Color";

// Dimensions
const windowWidth = Dimensions.get("window").width;

const VisitorViewContainer = (props) => {
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "column",
        },
      ]}
    >
       <StatusBar
        backgroundColor= {Colors.main}
        barStyle="dark-content"
        translucent={false}
        hidden={false}
      />
      <View style={{ flex: 1, backgroundColor: "white" }} />
      <View style={[styles.Middlecontainer, { flex: 2 }]}>
        <Image
          source={require("../../assets/favicon.png")}
          style={{ width: 90, height: 90 }}
        />
        <Image
          source={require("../../assets/ealaga.png")}
          style={{ width: 200, height: 100 }}
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
});
export default VisitorViewContainer;
