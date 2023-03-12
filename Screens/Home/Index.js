import { useCallback, useContext, useState } from "react";
import { Dimensions, StyleSheet, View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";  

import Colors from "../../Shared/Color";
import Header from "../../Shared/Header";
import Features from "./Features";

import AuthGlobal from "../../Context/store/AuthGlobal";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { Platform } from "react-native"; 
 
// Dimension
const windowHeight = Dimensions.get("window").height;

const HomeContainer = (props,) => {
  const context = useContext(AuthGlobal);
  const [hours, setHours] = useState("");
  const [greeting, setGreeting] = useState("Good Morning!");
  const [username, setUserame] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const oras = moment().hours(); //Current Hours

  

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("User");
      }
      // props.navigation.navigate.popToTop();
      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(
              `${baseURL}users/profile/edit/${context.stateUser.user.userId}`,
              {
                headers: { Authorization: `Bearer ${res}` },
              }
            )
            .then((userData) => [
              setUserame(userData.data.user.user_name),
              setFirstname(userData.data.user.first_name),
              setLastname(userData.data.user.last_name),
            ]);
        })
        .catch((error) => console.log(error));

      setHours(oras);
      if (hours < 12) {
        setGreeting("Good Morning!");
      } else if (hours > 12 && hours < 18) {
        setGreeting("Good Afternoon!");
      } else {
        setGreeting("Good Evening!");
      } 
  
    }, [])
  );

  return (
    <SafeAreaView style = {styles.homecontainer}> 
      <Header/> 
      <View style={styles.container}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.username}>
          {firstname} {lastname}
        </Text>
        <ScrollView>
          <Features navigation={props.navigation} />
        </ScrollView>
      </View> 
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  homecontainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor:Colors.main
  },
  container: {
    // width: windowWidth,
    height: windowHeight,
    backgroundColor: Colors.main,
  },
  greeting: {
    fontSize: 34,
    color: Colors.TextColor,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10, 
  },
  username: {
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "500",
    marginLeft: 20,
    color: Colors.gray,
  },
});

export default HomeContainer;
