import React from "react";
import {
  Dimensions,
  StyleSheet,
  View, 
  ScrollView,
  SafeAreaView,
} from "react-native"; 
 
import Header from "../../Shared/Header"; 
import Notification from "./Notification";
 
// Dimension
const windowHeight = Dimensions.get("window").height;

const HomeContainer = () => {
   
 
  return (
    <SafeAreaView style={styles.homecontainer}>
      <Header />
      <View> 
        <ScrollView>
          <Notification />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homecontainer: {
    flex: 1,
  },
 
});

export default HomeContainer;
