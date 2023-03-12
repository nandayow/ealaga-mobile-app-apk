import { View } from "native-base";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Spinner from "react-native-loading-spinner-overlay/lib";

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
import {
  loginUser,
  setLoadingspinner,
} from "../../Context/actions/Auth.actions";
import { Platform } from "react-native";
import { StatusBar } from "react-native";

function LoginContainer(props) {
  const context = useContext(AuthGlobal);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate("Home");
      setLoading(false);
    }
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    const user = {
      email,
      password,
    };
    if (email === "" || password === "") {
      setError("Please fill correct email and password");
      setTimeout(() => {
        setError("");
        setLoading(false);
      }, 1000);
    } else {
      try {
        loginUser(user, context.dispatch);
        let isloading = setLoadingspinner(loading);
        let loadingstatus = isloading.isLoading;
        setTimeout(() => { 
          setLoading(loadingstatus);
        }, 1500);
       
      } catch (error) {
        setLoading(loadingstatus);
      }
    }
  };

  return (
    <SafeAreaProvider style={[styles.safeprovider]}>
      <Header navigation={props.navigation} />

      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={"Loading..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
      <View style={styles.headerbottom}>
        <FormContainer title={"Login"}>
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
          <TextInput
            style={[styles.input]}
            left={
              <TextInput.Icon
                icon="lock"
                color={Colors.TextColor}
                style={[styles.loginicon]}
              />
            }
            secureTextEntry={passwordVisible}
            placeholder={"Enter Password"}
            name={"password"}
            id={"password"}
            value={password}
            onChangeText={(text) => [setPassword(text)]}
            // Icon eye
            right={
              password !== "" ? (
                <TextInput.Icon
                  id="passwordVisible"
                  color={Colors.TextColor}
                  style={[styles.loginicon]}
                  name={passwordVisible ? "eye" : "eye-off"}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              ) : null
            }
          />
          <TouchableOpacity
            style={styles.appButtonContainerLogin}
            onPress={() => props.navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.Newuser}>
              Forgot password?
              <Text style={styles.Clickhere}> Click here</Text>
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonGroup}>
            {error ? <Error message={error} /> : null}
            <EasyButton
              large
              style={styles.ButtonBorder}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.ButtonText}>LOG IN</Text>
            </EasyButton>

            <Text style={styles.Newuser}>
              Not a member?
              <Text
                style={styles.signup}
                onPress={() => props.navigation.navigate("Register")}
              >
                {" "}
                Signup
              </Text>
            </Text>
          </View>
        </FormContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeprovider: {
    flex: 1,
    height: windowHeight,
    width: windowWidth,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: Colors.main,
  },

  headerbottom: {
    marginTop: 80,
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
    fontStyle: "italic",
    fontSize: 18,
  },
  signup: {
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
    borderColor: Colors.rose,
  },
  loginicon: {
    position: "absolute",
    bottom: -20,
  },
  logincontainer: {
    marginTop: 20,
  },
  spinnerTextStyle: {
    color: "red",
  },
});

export default LoginContainer;
