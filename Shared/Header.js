import React, { useContext } from "react";
import {
  StyleSheet,
  Image, 
  View,
} from "react-native";
import Colors from "./Color";

const Header = () => {
  return (
    <View style={styles.header}> 
      <Image
        source={require("../assets/ealaga.png")}
        resizeMode="contain"
        style={styles.image }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    width: "100%",
    height:70,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center", 
    borderBottomWidth: 3.5,
    backgroundColor: Colors.main,
    borderBottomColor: Colors.rose_200,
    shadowOpacity: 2,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  image: {
    height: 70,
    width: "100%",  
  },
  touchableOpacity: {
    position: "absolute",
    left: 10,
    bottom: 1,
  },
});
export default Header;
