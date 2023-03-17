import { View } from "native-base";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
} from "react-native";
import { TextInput } from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Shared
import Colors from "../../Shared/Color";
import FormContainer from "../../Shared/Form/FormContainer";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Error from "../../Shared/Error";
import Header from "../../Shared/Header";

// Dimensions
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { Platform } from "react-native";
import { StatusBar } from "react-native";

function ForgotPassword(props) {
  const context = useContext(AuthGlobal);
  const [error, setError] = useState("");
  const [email, setEmail] = useState(""); 

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate("Home");
    }
  }, []);

  const handleSubmit = () => {
    if (email === "") {
      setError("Please input email");
    } else {
      let user = {
        email: email,
      };

      // if (item !== null) {
      axios
        .post(`${baseURL}users/password/forgot`, user)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Reset link sent to email",
              text2: "Great!",
            });
            setTimeout(() => {
              props.navigation.navigate("Visitor");
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Email not existing",
            text2: "Please try again",
          });
        });
      // }
      setError("");
    }
  };

  return (
    <SafeAreaProvider style={[styles.safeprovider]}>
      <View style={styles.headerbottom}>
        <Header navigation={props.navigation} />
      </View>

      <FormContainer title={"Forgot Password"}>
        <View style={[{ flex: 2 }]}>
          <Image
            source={require("../../assets/forgotpassword.png")}
            style={{ width: 90, height: 90 }}
          />
        </View>
        <Text style={[styles.description]}>
          Enter your e-mail address and we'll send a link to reset your password
        </Text>

        <TextInput
          style={[styles.input]}
          left={
            <TextInput.Icon
              icon={require("../../assets/avatar.png")}
              color={Colors.TextColor}
              style={[styles.loginicon]}
            />
          }
          spellCheck={false}
          autoCorrect={false}
          placeholder={"Enter Email"}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />

        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
          <EasyButton
            large
            style={styles.ButtonBorder}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.ButtonText}>Send</Text>
          </EasyButton>

          <Text style={styles.Newuser}>
            Not a Member User?
            <Text
              style={styles.Clickhere}
              onPress={() => props.navigation.navigate("Register")}
            >
              {" "}Signup
            </Text>
          </Text>
        </View>
      </FormContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeprovider: {
    flex: 1,
    height: windowHeight,
    width: windowWidth,
    backgroundColor: Colors.main,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: Colors.main,
  },

  headerbottom: {
    marginBottom: 60,
  },

  buttonGroup: {
    width: "80%",
    alignItems: "center",
    marginTop: 60,
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },

  ButtonBorder: {
    borderColor: "red",
    borderWidth: 2,
  },
  ButtonText: {
    color: Colors.TextColor,
    fontWeight: "bold",
  },
  Clickhere: {
    color: Colors.TextColor,
    fontSize: 18,
    fontWeight: "bold",
  },
  Newuser: {
    marginTop: 20,
    fontSize: 16,
  },
  input: {
    width: "80%",
    height: 40,
    backgroundColor: "white",
    margin: 10,
    // borderRadius: 8,
    padding: 10,
    borderBottomWidth: 2,
    borderColor: Colors.underline,
  },
  loginicon: {
    position: "absolute",
    bottom: -20,
  },
  logincontainer: {
    marginTop: 20,
  },
  description: {
    color: "black",
    textAlign: "center",
    fontSize: 14,
  },
});

export default ForgotPassword;
