import React from "react";
import { Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";

// Shared
import Header from "../../Shared/Header";
import Colors from "../../Shared/Color";
import ScheduleCard from "./ScheduleCard";  
import { SafeAreaView } from "react-native"; 

// Dimensions
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ScheduleContainer = (props) => {
  return (
    <SafeAreaView style= {styles.homecontainer}>
      <Header navigation={props.navigation} /> 
      <View style={styles.container}>
        <Text style={styles.title}>My Schedule</Text>
        <ScheduleCard navigation={props.navigation} />  
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homecontainer: {
    flex: 1, 
  },
  container: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: Colors.main,
    borderBottomWidth: 200,
    borderBottomColor: Colors.main,
  },
  title: {
    fontSize: 30,
    color: Colors.TextColor,
    fontWeight: "bold",
    textAlign: "center",
    height: 100,
    textAlignVertical: "center",
  },
  scrollView: {
    margin: 5,
    paddingBottom: 50,
    // backgroundColor: 'pink',
  },
  refreshColor: {
    tintColor: Colors.red,
    backgroundColor: "green",
  },
});

export default ScheduleContainer;
