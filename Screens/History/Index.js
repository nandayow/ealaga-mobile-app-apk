import React, { useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Shared
import Header from "../../Shared/Header";
import HistoryCard from "./HistoryCard";
import Colors from "../../Shared/Color";
import { SafeAreaView } from "react-native";
import { Platform } from "react-native";
import { StatusBar } from "react-native";

// Dimensions
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HistoryContainer = (props) => {
  return (
    <SafeAreaView style ={ styles.homecontainer}>
      <Header navigation={props.navigation} />
      <Text style={styles.title}>My History</Text>
      <View style={styles.container}>
        <HistoryCard navigation={props.navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homecontainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: Colors.main,
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
    backgroundColor: Colors.main,
  },

  refreshColor: {
    tintColor: Colors.red,
    backgroundColor: "green",
  },
});

export default HistoryContainer;
