import React, { useCallback, useContext, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Container, Input } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Spinner from "react-native-loading-spinner-overlay";

// Color
import Colors from "../../../Shared/Color";

// Fething Data
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";

// Checking Auth User
import AuthGlobal from "../../../Context/store/AuthGlobal";

// Shared
import FormContainerProfile from "../../../Shared/Form/FormContainerProfile";
import InputProfile from "../../../Shared/Form/InputProfile";

// Dimensions
const windowWidth = Dimensions.get("window").width;

function Credentials(props) {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [token, setToken] = useState();

  const [user_name, setUsername] = useState("");
  const [phone, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("User");
      }

      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(
              `${baseURL}users/profile/edit/${context.stateUser.user.userId}`,
              {
                headers: { Authorization: `Bearer ${res}` },
              }
            )
            .then(
              (user) => setUserProfile(user.data),
              setUsername(context.stateUser.user.username),
              setEmail(context.stateUser.user.email),
              setContactNumber(context.stateUser.user.phone),
              setToken(res)
            );
        })
        .catch((error) => console.log(error));

      return () => {
        setUserProfile();
        // setUsername();
      };
    }, [context.stateUser.isAuthenticated])
  );

  const UpdateProfile = () => {
    setLoading(true);
    if (newPassword !== confirmPassword) {
      setLoading(false);
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Password Not Match",
        text2: "Please try again",
      });
    } else if (phone === undefined) {
      setLoading(false);
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Kindly add you Contact Number",
        text2: "Please try again",
      });
    } else {
      let formData = new FormData();
      formData.append("user_name", user_name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);

      // console.log(formData);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      // if (item !== null) {
      axios
        .put(
          `${baseURL}users/profile/updateCredential/${context.stateUser.user.userId}`,
          formData,
          config
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            setLoading(false);
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Profile successfuly updated",
              text2: "Great!",
            });
            setTimeout(() => {
              props.navigation.navigate("Personal");
            }, 500);
          }
        })
        .catch((error) => {
          setLoading(false);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
      // }
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={"Loading..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
      <Container style={styles.ImageContainer}>
        <View style={styles.ImageCircle}>
          <Image
            source={{
              uri: userProfile
                ? userProfile.user.profile_picture.url
                : "https://th.bing.com/th/id/OIP.NVgDAkBBANO4lnKq3Xqg1wHaHa?w=194&h=195&c=7&r=0&o=5&dpr=1.3&pid=1.7",
            }}
            resizeMode="cover"
            style={styles.image}
          />
        </View>
      </Container>

      <FormContainerProfile
        title={userProfile ? userProfile.user.user_name : ""}
      >
        <InputProfile
          placeholder={"Username"}
          name={"user_name"}
          id={"user_name"}
          value={user_name}
          onChangeText={(text) => setUsername(text.toLowerCase())}
        />

        {context.stateUser.user.phone === undefined ? (
          <InputProfile
            placeholder={"Contact Number"}
            name={"phone"}
            id={"phone"}
            // value={phone}
            onChangeText={(text) => setContactNumber(text.toLowerCase())}
          />
        ) : (
          <InputProfile
            placeholder={"Contact Number"}
            name={"phone"}
            id={"phone"}
            value={phone.toString()}
            onChangeText={(text) => setContactNumber(text.toLowerCase())}
          />
        )}

        <InputProfile
          placeholder={"Email Address"}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />

        <InputProfile
          placeholder={"oldPassword"}
          name={"oldPassword"}
          id={"oldPassword"}
          value={oldPassword}
          secureTextEntry={true}
          onChangeText={(text) => setOldPassword(text.toLowerCase())}
        />

        <InputProfile
          placeholder={"New Password"}
          name={"newPassword"}
          id={"newPassword"}
          value={newPassword}
          secureTextEntry={true}
          onChangeText={(text) => setNewPassword(text.toLowerCase())}
        />

        <InputProfile
          placeholder={"Confirm Password"}
          name={"confirmPassword"}
          id={"confirmPassword"}
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text.toLowerCase())}
        />
        <View style={[styles.Lowercontainer, { flex: 3 }]}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.appButtonContainerLogin}
              onPress={() => props.navigation.navigate("Personal")}
            >
              <Text style={styles.appButtonTextLogin}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.appButtonContainerRegister}
              onPress={() => [UpdateProfile()]}
            >
              <Text style={styles.appButtonTextRegister}>Update</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.Line}></View>
        </View>
      </FormContainerProfile>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main,
  },

  ImageContainer: {
    maxWidth: windowWidth,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  ImageCircle: {
    backgroundColor: Colors.light,
    alignItems: "center",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
  image: {
    height: 100,
    maxWidth: 100,
    minWidth: 100,
    borderRadius: 50,
  },

  info: {
    margin: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  infoContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  Lowercontainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 80,
    padding: 15,
  },
  buttonContainer: {
    flex: 1,
  },
  appButtonContainerLogin: {
    backgroundColor: "#fff",
    borderWidth: 2,
    height: 50,
    width: windowWidth / 2.3,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: "absolute",
    bottom: 10,
    margin: 10,
  },
  appButtonTextLogin: {
    fontSize: 14,
    color: "#ff1717",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  appButtonContainerRegister: {
    backgroundColor: "#ff1717",
    borderWidth: 2,
    height: 50,
    width: windowWidth / 2.3,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: "absolute",
    bottom: 10,
    margin: 10,
  },
  appButtonTextRegister: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  spinnerTextStyle: {
    color: "red",
  }
});

export default Credentials;
