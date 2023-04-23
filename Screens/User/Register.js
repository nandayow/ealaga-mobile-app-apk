import { View } from "native-base";
import { Dimensions, Modal, StyleSheet, Text } from "react-native";
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
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

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
  const [ismodalVisible, setModalVisible] = useState(false);
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
        status: "active",
      };

      setLoading(true);
      setError();
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
      console.log(user);
    }
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
          placeholder={"Firstname *"}
          name={"first_name"}
          id={"first_name"}
          value={first_name}
          onChangeText={(text) => setFirstname(text)}
        />
        <Input
          placeholder={"Middlename *"}
          name={"middle_name"}
          id={"middle_name"}
          value={middle_name}
          onChangeText={(text) => setMiddlename(text)}
        />
        <Input
          placeholder={"Lastname *"}
          name={"last_name"}
          id={"last_name"}
          value={last_name}
          onChangeText={(text) => setLastname(text)}
        />
        <Input
          placeholder={"Email address *"}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder={"Username *"}
          name={"user_name"}
          id={"user_name"}
          value={user_name}
          onChangeText={(text) => setUsername(text)}
        />

        <TextInput
          style={[styles.input]}
          placeholder={"Password *"}
          name={"password"}
          id={"password"}
          secureTextEntry={passwordVisible}
          value={password}
          theme={{ colors: { primary: Colors.main } }}
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
          placeholder={"Confirm password *"}
          name={"confirmPassword"}
          id={"confirmPassword"}
          secureTextEntry={passwordVisibleConfirm}
          theme={{ colors: { primary: Colors.main } }}
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
          <TouchableOpacity onPress={() => [setModalVisible(true)]}>
            <Text style={styles.label}>
              By registering, you are indicating your agreement to our
              <Text style={styles.Clickhere}>
                {" "}
                Privacy policy and Terms & Conditions.
              </Text>
            </Text>
          </TouchableOpacity>
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

      {/* Remidner Modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={ismodalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text style={styles.headerModal}>Terms and Conditions</Text>
              <Text style={styles.subheaderModal}>
                As a user of our web and mobile application, it is important
                that you agree to the following terms and conditions before
                using our services.
              </Text>
              <Text style={styles.headingsTitle}>
                Acceptance of Terms and Conditions
              </Text>
              <Text style={styles.description}>
                {"  "}By accessing and using the eAlaga application, you agree
                to be bound by these terms and conditions. If you do not agree
                to these terms and conditions, you must not use the eAlaga
                application.
              </Text>
              <Text style={styles.headingsTitle}>
                Registration and Account Information
              </Text>
              <Text style={styles.description}>
                {"  "}In order to use the eAlaga application, you must register
                and create an account with a valid email address. Upon
                registration, an email confirmation will be sent to activate
                your account. If you are an existing user, you can log in using
                your registered email and password.
              </Text>
              <Text style={styles.headingsTitle}>
                Services Offered by eAlaga
              </Text>
              <Text style={styles.description}>
                {"  "}Our platform offers a range of services including
                recreational activities, dialysis, and a multipurpose hall. You
                can select a service from the options available, pick a date and
                time, and confirm your schedule with ease. We generate a proof
                of booking in the form of QR codes and text to ensure the
                security of your information.
              </Text>
              <Text style={styles.headingsTitle}>User Responsibilities</Text>
              <Text style={styles.description}>
                {"  "}As a user of eAlaga, it is your responsibility to provide
                accurate and up-to-date information about yourself and your
                health condition. You must upload the required documents and
                complete your profile account before scheduling any services.
                You are also responsible for keeping your account information
                confidential and secure.
              </Text>
              <Text style={styles.headingsTitle}>Feedback and Reviews</Text>
              <Text style={styles.description}>
                {"  "}We value your feedback and reviews on our services. We
                have provided a review platform to collect user feedback and to
                help us improve our services. We reserve the right to use your
                feedback for marketing purposes and to improve our application
                and services.
              </Text>
              <Text style={styles.headingsTitle}>Donations</Text>
              <Text style={styles.description}>
                {"  "}We appreciate your donations to support the center's
                services. We have provided a donation platform through our web
                and mobile applications for your convenience.
              </Text>
              <Text style={styles.headingsTitle}>
                User Restrictions and Agreement Violations
              </Text>
              <Text style={styles.description}>
                {"  "}We reserve the right to restrict or terminate your account
                if you violate any of the terms and conditions outlined in this
                agreement. This includes any fraudulent or illegal activity,
                misuse of our application, and violation of our user policies.
              </Text>
              <Text style={styles.headingsTitle}>
                Availability and Security
              </Text>
              <Text style={styles.description}>
                {"  "}We make every effort to ensure that our application is
                available to you at all times. However, we cannot guarantee
                uninterrupted or error-free access. We also take the security of
                your information seriously and have implemented measures to
                protect your personal and health information.
              </Text>
              <Text style={styles.headingsTitle}>Limitation of Liability</Text>
              <Text style={styles.description}>
                {"  "}In no event shall eAlaga or its affiliates be liable for
                any damages arising out of the use or inability to use our
                application or services, including but not limited to damages
                for loss of data, loss of profits, or other intangible losses.
              </Text>
              <Text style={styles.headingsTitle}>
                Changes to Terms and Conditions
              </Text>
              <Text style={styles.description}>
                {"  "}We reserve the right to modify or update these terms and
                conditions at any time without prior notice. Your continued use
                of our application after any changes indicates your acceptance
                of the updated terms and conditions.
              </Text>
              <Text style={styles.description}>
                {"  "}In conclusion, we at eAlaga are committed to providing a
                user-friendly and convenient platform for the elderly community
                in Taguig City to book health care services. We appreciate your
                agreement to our terms and conditions and hope that you find our
                application helpful and beneficial.
              </Text>
              <Text style={styles.headerModal}>Privacy Policy</Text>
              <Text style={styles.subheaderModal}>
                This Privacy Policy explains how eAlaga collects, uses, and
                protects the personal information you provide us when you use
                our mobile and web application. We take your privacy seriously
                and are committed to ensuring that your personal information is
                secure and protected.
              </Text>
              <Text style={styles.headingsTitle}>
                Collection and Use of Personal Information
              </Text>
              <Text style={styles.description}>
                {"  "}We collect personal information when you register for an
                account, book a service, or message us through our chat feature.
                Personal information may include your name, email address, phone
                number, date of birth, and other identifying information. We may
                also collect information about your health condition, as
                necessary to provide you with the appropriate services.
              </Text>
              <Text style={styles.headingsTitle}>
                Use of Personal Information
              </Text>
              <Text style={styles.description}>
                {"  "}We use personal information to provide and improve our
                services, to communicate with you, and to comply with legal
                obligations. We may use your information to schedule services,
                to send confirmation and reminder notifications. We may also use
                your information to improve our platform and to conduct research
                and analysis.
              </Text>
              <Text style={styles.headingsTitle}>
                Disclosure of Personal Information
              </Text>
              <Text style={styles.description}>
                {"  "}We may disclose personal information to our personnel and
                service providers, as necessary to provide our services. We may
                also disclose information as required by law or in response to
                legal process, or to protect our rights, property, or safety. We
                do not sell or rent personal information to third parties for
                marketing purposes.
              </Text>
              <Text style={styles.headingsTitle}>Data Security</Text>
              <Text style={styles.description}>
                {"  "}We take reasonable measures to protect personal
                information against unauthorized access, alteration, disclosure,
                or destruction. We use encryption and secure server technology
                to protect your information during transmission. However, no
                method of transmission or storage is completely secure, and we
                cannot guarantee absolute security.
              </Text>
              <Text style={styles.headingsTitle}>Access and Correction</Text>
              <Text style={styles.description}>
                {"  "}You may access and update your personal information by
                logging into your account. You may also request that we correct
                or delete inaccurate information. We will respond to requests
                within a reasonable time frame.
              </Text>
              <Text style={styles.headingsTitle}>Retention</Text>
              <Text style={styles.description}>
                {"  "}We retain personal information for as long as necessary to
                provide our services and to comply with legal obligations. We
                may also retain information for research or analysis purposes,
                in which case we will anonymize or de-identify the information.
              </Text>
              <Text style={styles.headingsTitle}>
                Changes to this Privacy Policy
              </Text>
              <Text style={styles.description}>
                {"  "}We may update this Privacy Policy from time to time, in
                response to changing legal, technical, or business developments.
                We will post the updated policy on our website and notify you of
                any material changes.
              </Text>
              <Text style={styles.headingsTitle}>Contact Us</Text>
              <Text style={styles.description}>
                {"  "}If you have any questions or concerns about this Privacy
                Policy, or about our collection, use, or disclosure of personal
                information, please contact us at ealaga.taguig@gmail.com.
              </Text>
              <Text style={styles.description}>
                {"  "}By using our web and mobile application, you agree to the
                terms of this Privacy Policy. If you do not agree with any part
                of this Policy, please do not use our platform.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closebuttonReminder}
              onPress={() => [setModalVisible(false), setSelection(true)]}
            >
              <Text style={styles.closebuttonText}>I understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: Colors.main,
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
    marginTop: 20,
    width: "80%",
    justifyContent: "center",
  },
  checkbox: {
    // alignSelf: "center",
    marginTop: 5,
  },
  label: {
    marginTop: 8,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 50,
  },

  modalView: {
    backgroundColor: Colors.main,
    borderRadius: 10,
    width: windowWidth / 1.09,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.rose_200,
    height: windowHeight / 1.1,
  },
  headerModal: {
    textAlign: "center",
    color: Colors.TextColor,
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.disabled,
  },
  subheaderModal: {
    textAlign: "center",
    color: Colors.gray,
    fontSize: 14,
    fontWeight: "bold",
    padding: 10,
  },
  headingsTitle: {
    textAlign: "left",
    color: Colors.gray,
    fontSize: 14,
    fontWeight: "bold",
    padding: 10,
  },
  description: {
    textAlign: "justify",
    color: Colors.gray,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  closebuttonReminder: {
    backgroundColor: "#EF3A47",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    padding: 10,
    // width: 70,
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  closebuttonText: {
    color: Colors.TextWhite,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Register;
