import { View } from "native-base";
import { Dimensions, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Shared
import Colors from "../../Shared/Color";
import Input from "../../Shared/Form/Input";
import FormContainer from "../../Shared/Form/FormContainer";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Error from "../../Shared/Error";
import Header from "../../Shared/Header";

// Dimensions
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { Checkbox, TextInput } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { Platform } from "react-native";
import { StatusBar } from "react-native";

function Register(props) {
  const [error, setError] = useState("");
  const [first_name, setFirstname] = useState("");
  const [middle_name, setMiddlename] = useState("");
  const [last_name, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [role, setRole] = useState(" ");

  const [isSelected, setSelection] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [passwordVisibleConfirm, setPasswordVisibleConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const register = () => {
    setRole("client");
    if (
      email === "" ||
      first_name === "" ||
      middle_name === "" ||
      last_name === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setError("Please fill in the form correctly");
    } else if (password != confirmPassword) {
      setError("The password confirmation is not match");
    } else if (isSelected == false) {
      setError("Read Terms and Condtions");
    } else {
      let user = {
        email: email,
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        user_name: user_name,
        password: password,
        confirmPassword: confirmPassword,
        role: role,
        status:"active"
      };

      setLoading(true);
      axios
        .post(`${baseURL}users/register`, user)
        .then((res) => {
          if (res.status !== 400) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Registration Succeeded",
              text2: "Please Login into your account",
            });
            setLoading(false);
            props.navigation.navigate("Login");
          }
        })

        .catch((error) => {
          setLoading(false);
          const errResponse = error.response.data.email;
          if (errResponse === "Not Available") {
            Toast.show({
              topOffset: 60,
              type: "error",
              text1: "Something went wrong",
              text2: "Email not Available",
            });
          }
        });

      setError();
      console.log(user);
    }
  };

  const handleChange = (event) => {
    setSelection((current) => !current);
  };

  return (
    <SafeAreaProvider style={[{ flex: 1 }, styles.container]}>
      <Header navigation={props.navigation} />

      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={"Loading..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />

      <FormContainer title={"Register"}>
        <Input
          placeholder={"Firstname"}
          name={"first_name"}
          id={"first_name"}
          value={first_name}
          onChangeText={(text) => setFirstname(text)}
        />
        <Input
          placeholder={"Middlename"}
          name={"middle_name"}
          id={"middle_name"}
          value={middle_name}
          onChangeText={(text) => setMiddlename(text)}
        />
        <Input
          placeholder={"Lastname"}
          name={"last_name"}
          id={"last_name"}
          value={last_name}
          onChangeText={(text) => setLastname(text)}
        />
        <Input
          placeholder={"Email address"}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder={"Username"}
          name={"user_name"}
          id={"user_name"}
          value={user_name}
          onChangeText={(text) => setUsername(text)}
        />

        <TextInput
          style={[styles.input]}
          placeholder={"Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={passwordVisible}
          value={password}
          onChangeText={(text) => setPassword(text)}
          // Icon eye
          right={
            password !== "" ? (
              <TextInput.Icon
                color={Colors.TextColor}
                style={[styles.loginicon]}
                name={passwordVisible ? "eye" : "eye-off"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            ) : null
          }
        />
        <TextInput
          style={[styles.input]}
          placeholder={"Confirm password"}
          name={"confirmPassword"}
          id={"confirmPassword"}
          secureTextEntry={passwordVisibleConfirm}
          value={confirmPassword}
          onChangeText={(text) => setConfirmpassword(text)}
          // Icon eye
          right={
            confirmPassword !== "" ? (
              <TextInput.Icon
                color={Colors.TextColor}
                style={[styles.loginicon]}
                name={passwordVisibleConfirm ? "eye" : "eye-off"}
                onPress={() =>
                  setPasswordVisibleConfirm(!passwordVisibleConfirm)
                }
              />
            ) : null
          }
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isSelected ? "checked" : "unchecked"}
            // colorScheme ="danger"
            color="red"
            onPress={() => {
              setSelection(!isSelected);
            }}
            style={styles.checkbox}
          />
          <Text style={styles.label}>
            I agree to the
            <Text style={styles.Clickhere}> Terms & Conditions</Text>
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
          <EasyButton
            large
            style={styles.ButtonBorder}
            onPress={() => register()}
          >
            <Text style={styles.ButtonText}>REGISTER</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    alignContent: "center",
    height: windowHeight,
    maxWidth: windowWidth, 
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor:Colors.main
  },
  buttonGroup: {
    width: "80%",
    alignItems: "center",
    marginTop: 30,
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
  },
  Newuser: {
    fontSize: 12,
  },

  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop:20
  },
  checkbox: {
    alignSelf: "center",
    marginTop: 5,
  },
  label: {
    margin: 8,
  },
  input: {
    width: "80%",
    height: 40,
    backgroundColor: "white",
    margin: 2,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: Colors.underline,
    fontSize: 16,
    fontFamily: "sans-serif",
  },
  loginicon: {
    position: "absolute",
    bottom: -15,
  },
  spinnerTextStyle: {
    color: "red",
  },
});

export default Register;
