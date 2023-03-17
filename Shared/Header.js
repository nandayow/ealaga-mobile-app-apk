import React, { useContext } from "react";
import { StyleSheet, Image, View, StatusBar } from "react-native";
import Colors from "./Color";

const Header = () => {
  return (
    <View style={styles.header}>
      <StatusBar
        backgroundColor= {Colors.main}
        barStyle="dark-content"
        translucent={false}
        hidden={false}
      />

      <Image
        source={require("../assets/ealaga.png")}
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    width: "100%", 
    alignContent: "center",
    justifyContent: "center",
    borderBottomWidth: 3.5,
    backgroundColor: Colors.main,
    borderBottomColor: Colors.rose_200,
  },
  image: {
    height: 70,
    width: "100%",
    // marginTop:15,
    alignSelf: "center",
  },
  touchableOpacity: {
    position: "absolute",
    left: 10,
    bottom: 1,
  },
});
export default Header;
