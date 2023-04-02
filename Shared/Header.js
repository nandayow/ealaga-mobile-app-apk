import React from "react";
import { StyleSheet, Image, View } from "react-native";
import Colors from "./Color";

const Header = () => {
  return (
    <View style={styles.header}> 
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
    alignSelf: "center",
  },
});
export default Header;
