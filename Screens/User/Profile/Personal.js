import React, { useCallback, useContext, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Platform,
  RefreshControl,
} from "react-native";
import { Container, Input } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { Checkbox } from "react-native-paper";
import MultiSelect from "react-native-multiple-select";

import mime from "mime";
import Spinner from "react-native-loading-spinner-overlay";

import { Entypo } from "@expo/vector-icons";
// Color
import Colors from "../../../Shared/Color";

// Fething Data
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";

import AuthGlobal from "../../../Context/store/AuthGlobal";
import { logoutUser } from "../../../Context/actions/Auth.actions";

// Shared
import FormContainerProfile from "../../../Shared/Form/FormContainerProfile";
import InputModal from "../../../Shared/Form/InputModal";
import FormContainerModal from "../../../Shared/Form/FormContainerModal";
import SuperAlert from "react-native-super-alert";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

// Dimensions
const windowWidth = Dimensions.get("window").width; 
const windowHeight = Dimensions.get("window").height;
function Personal() {
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [first_name, setFirstname] = useState("");
  const [middle_name, setMiddlename] = useState("");
  const [last_name, setLastname] = useState("");
  const [birth_date, setBirthday] = useState("");
  const [age, setAge] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [mainImage, setMainImage] = useState();
  const [validId, setValidId] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [datePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState(new Date(1963, 10, 1));
  const [gender, setGender] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [barangay, setBarangay] = useState(null);
  const [options, setOptions] = useState([
    { id: "Bagumbayan", name: "Bagumbayan" },
    { id: "Bambang", name: "Bambang" },
    { id: "Calzada", name: "Calzada" },
    { id: "Central Bicutan", name: "Central Bicutan" },
    { id: "Central Signal Village", name: "Central Signal Village" },
    { id: "Fort Bonifacio", name: "Fort Bonifacio" },
    { id: "Hagonoy", name: "Hagonoy" },
    { id: "Ibayo-tipas", name: "Ibayo-tipas" },
    { id: "Katuparan", name: "Katuparan" },
    { id: "Ligid-tipas", name: "Ligid-tipas" },
    { id: "Lower Bicutan", name: "Lower Bicutan" },
    { id: "Maharlika Village", name: "Maharlika Village" },
    { id: "Napindan", name: "Napindan" },
    { id: "New Lower Bicutan", name: "New Lower Bicutan" },
    { id: "North Daang Hari", name: "North Daang Hari" },
    { id: "North Signal Village", name: "North Signal Village" },
    { id: "Palingon", name: "Palingon" },
    { id: "Pinagsama", name: "Pinagsama" },
    { id: "San Miguel", name: "San Miguel" },
    { id: "Santa Ana", name: "Santa Ana" },
    { id: "South Daang Hari", name: "South Daang Hari" },
    { id: "South Signal Village", name: "South Signal Village" },
    { id: "Tanyag", name: "Tanyag" },
    { id: "Tuktukan", name: "Tuktukan" },
    { id: "Upper Bicutan", name: "Upper Bicutan" },
    { id: "Ususan", name: "Ususan" },
    { id: "Wawa", name: "Wawa" },
    { id: "Western Bicutan", name: "Western Bicutan" },
  ]);
  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("User");
      }
      setLoading(true);
      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(
              `${baseURL}users/profile/edit/${context.stateUser.user.userId}`,
              {
                headers: { Authorization: `Bearer ${res}` },
              }
            )
            .then((user) => [
              setUserProfile(user.data),
              setFirstname(context.stateUser.user.firstname),
              setMiddlename(context.stateUser.user.middlename),
              setLastname(context.stateUser.user.lastname),
              setToken(res),
              setGender(context.stateUser.user.gender),
              setHouseNumber(context.stateUser.user.address.house_purok_no),
              setStreet(context.stateUser.user.address.street),
              setBarangay(context.stateUser.user.address.barangay),
              setLoading(false),
            ]);

          if (context.stateUser.user.gender === "male") {
            setIsChecked1(true);
            setIsChecked2(false);
          } else if (context.stateUser.user.gender === "female") {
            setIsChecked2(true);
            setIsChecked1(false);
          } else {
            setIsChecked2(false);
            setIsChecked1(false);
          }
        })
        .catch((error) => console.log(error));

      // Image Picker
      (async () => {
        if (Platform.OS !== "web") {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
          }
        }
      })();
    }, [])
  );
  function showDatePicker() {
    setDatePicker(true);
  }

  function onDateSelected(event, value) {
    setDate(value);
    setDatePicker(false);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMainImage(result.uri);
    }
  };

  const pickIValidId = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setValidId(result.uri);
    }
  };

  const pullMe = () => {
    setRefresh(true);
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
            setFirstname(context.stateUser.user.firstname),
            setMiddlename(context.stateUser.user.middlename),
            setLastname(context.stateUser.user.lastname),
            setToken(res),
            setGender(context.stateUser.user.gender),
            setHouseNumber(context.stateUser.user.address.house_purok_no),
            setStreet(context.stateUser.user.address.street),
            setBarangay(context.stateUser.user.address.barangay)
          );
        setTimeout(() => {
          setRefresh(false);
        }, 500);
      })
      .catch((error) => console.log(error));
    return () => {
      setUserProfile();
    };
  };

  const showModal = () => {
    setFirstname(userProfile ? userProfile.user.first_name : " ");
    setMiddlename(userProfile ? userProfile.user.middle_name : " ");
    setLastname(userProfile ? userProfile.user.last_name : "");
    setGender(userProfile ? userProfile.user.gender : ""),
      setHouseNumber(
        userProfile ? userProfile.user.address.house_purok_no : ""
      ),
      setStreet(userProfile ? userProfile.user.address.street : ""),
      setBarangay(userProfile ? userProfile.user.address.barangay : ""),
      setModalVisible(true);
  };

  const UpdateProfile = () => {
    var oras = new Date(); //Current Hours
    let getYearNow = moment(oras).format("YYYY");
    let getYearBirthdate = moment(date).format("YYYY");
    let edad = getYearNow - getYearBirthdate;

    let newBirtdate = moment(date).format();
    setBirthday(date);
    setAge(edad);

    if (userProfile && userProfile.user.account_verified !== "not verified") {
      let formData = new FormData();
      if (validId !== undefined && mainImage !== undefined) {
        const newValidIdUri = "file:///" + validId.split("file:/").join("");

        formData.append("valid_id", {
          uri: newValidIdUri,
          type: mime.getType(newValidIdUri),
          name: newValidIdUri.split("/").pop(),
        });

        const newImageUri = "file:///" + mainImage.split("file:/").join("");
        formData.append("profile_picture", {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split("/").pop(),
        });

        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("middle_name", middle_name);
        formData.append("birth_date", newBirtdate);
        formData.append("age", edad);
        formData.append("gender", gender);
        formData.append("house_purok_no", houseNumber);
        formData.append("street", street);
        formData.append("barangay", barangay);

        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
        axios
          .put(
            `${baseURL}users/profile/updateSubmit/${context.stateUser.user.userId}`,
            formData,
            config
          )
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Profile successfuly updated",
                text2: "Great!",
              });
              setLoading(false);
              // props.navigation.navigate("User");
              pullMe();
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
        setModalVisible(false);
      } else if (validId === undefined && mainImage === undefined) {
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("middle_name", middle_name);
        formData.append("birth_date", newBirtdate);
        formData.append("age", edad);
        formData.append("gender", gender);
        formData.append("house_purok_no", houseNumber);
        formData.append("street", street);
        formData.append("barangay", barangay);

        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
        axios
          .put(
            `${baseURL}users/profile/updateSubmit/${context.stateUser.user.userId}`,
            formData,
            config
          )
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Profile successfuly updated",
                text2: "Great!",
              });
              setLoading(false);
              // props.navigation.navigate("User");
              pullMe();
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
        setModalVisible(false);
      } else if (validId !== undefined && mainImage === undefined) {
        const newValidIdUri = "file:///" + validId.split("file:/").join("");

        formData.append("valid_id", {
          uri: newValidIdUri,
          type: mime.getType(newValidIdUri),
          name: newValidIdUri.split("/").pop(),
        });

        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("middle_name", middle_name);
        formData.append("birth_date", newBirtdate);
        formData.append("age", edad);
        formData.append("gender", gender);
        formData.append("house_purok_no", houseNumber);
        formData.append("street", street);
        formData.append("barangay", barangay);

        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
        axios
          .put(
            `${baseURL}users/profile/updateSubmit/${context.stateUser.user.userId}`,
            formData,
            config
          )
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Profile successfuly updated",
                text2: "Great!",
              });
              setLoading(false);
              // props.navigation.navigate("User");
              pullMe();
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
        setModalVisible(false);
      } else {
        const newImageUri = "file:///" + mainImage.split("file:/").join("");
        formData.append("profile_picture", {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split("/").pop(),
        });

        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("middle_name", middle_name);
        formData.append("birth_date", newBirtdate);
        formData.append("age", edad);
        formData.append("gender", gender);
        formData.append("house_purok_no", houseNumber);
        formData.append("street", street);
        formData.append("barangay", barangay);

        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
        axios
          .put(
            `${baseURL}users/profile/updateSubmit/${context.stateUser.user.userId}`,
            formData,
            config
          )
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Profile successfuly updated",
                text2: "Great!",
              });
              setLoading(false);
              // props.navigation.navigate("User");
              pullMe();
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
        setModalVisible(false);
      }
    }

    if (userProfile && userProfile.user.account_verified === "not verified") {
      let formData = new FormData();
      if (
        newBirtdate === "" ||
        barangay === "" ||
        gender === "" ||
        houseNumber === "" ||
        street == ""
      ) {
        alert("Warning!!!", "Kindly complete the required information", {
          type: "type: 'bottomsheet",
          option: "danger", // danger | warning | info | success
          timeout: 3,
        });
      } else if (validId === undefined || mainImage === undefined) {
        alert("Warning!!!", "Please upload your Profile and Senior ID photo", {
          type: "type: 'bottomsheet",
          option: "danger", // danger | warning | info | success
          timeout: 3,
        });
      } else if (age < 60) {
        alert("Warning!!!", "You must 60 years or above", {
          type: "type: 'bottomsheet",
          option: "danger", // danger | warning | info | success
          timeout: 3,
        });
      } else {
        const newValidIdUri = "file:///" + validId.split("file:/").join("");
        formData.append("valid_id", {
          uri: newValidIdUri,
          type: mime.getType(newValidIdUri),
          name: newValidIdUri.split("/").pop(),
        });

        const newImageUri = "file:///" + mainImage.split("file:/").join("");
        formData.append("profile_picture", {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split("/").pop(),
        });

        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("middle_name", middle_name);
        formData.append("birth_date", newBirtdate);
        formData.append("age", edad);
        formData.append("gender", gender);
        formData.append("house_purok_no", houseNumber);
        formData.append("street", street);
        formData.append("barangay", barangay);

        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
        axios
          .put(
            `${baseURL}users/profile/update/${context.stateUser.user.userId}`,
            formData,
            config
          )
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Profile successfuly updated",
                text2: "Great!",
              });
              setLoading(false);
              // props.navigation.navigate("User");
              pullMe();
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
        setModalVisible(false);
      }
    }
  };

  return (
    <SafeAreaProvider
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={() => pullMe()} />
      }
    >
      <StatusBar
        backgroundColor={Colors.main}
        barStyle="dark-content"
        translucent={false}
        hidden={false}
      />
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
        {userProfile && userProfile.user.account_verified === "verified" ? (
          <Text style={styles.verifiedText}>
            {userProfile ? userProfile.user.account_verified.toUpperCase() : ""}
          </Text>
        ) : userProfile && userProfile.user.account_verified === "pending" ? (
          <Text style={styles.pending}>
            {userProfile ? userProfile.user.account_verified.toUpperCase() : ""}
          </Text>
        ) : (
          <Text style={styles.NotverifiedText}>
            {userProfile ? userProfile.user.account_verified.toUpperCase() : ""}
          </Text>
        )}

        {userProfile && userProfile.user.account_verified === "not verified" ? (
          <View>
            <TouchableOpacity
              style={styles.getVerify}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.appButtonTextRegister}>Verify Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.getLogout}
              onPress={() => [
                AsyncStorage.removeItem("jwt"),
                logoutUser(context.dispatch),
              ]}
            >
              <Entypo name="log-out" size={18} color={Colors.TextColor}>
                <Text> SIGN OUT</Text>
              </Entypo>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.personalinformation}>
            <View style={styles.infoContainer}>
              <Input style={styles.info} isDisabled="true">
                {userProfile ? userProfile.user.first_name.toUpperCase() : ""}{" "}
                {userProfile ? userProfile.user.middle_name.toUpperCase() : ""}{" "}
                {userProfile ? userProfile.user.last_name.toUpperCase() : ""}
              </Input>

              {userProfile && userProfile.user.birth_date === undefined ? (
                <Input style={styles.info} isDisabled="true">
                  Update your BirthDate
                </Input>
              ) : (
                <Input style={styles.info} isDisabled="true">
                  BirthDate:{" "}
                  {moment(
                    userProfile ? userProfile.user.birth_date : ""
                  ).format("MMM DD YYYY")}
                </Input>
              )}

              {userProfile && userProfile.user.age === undefined ? (
                <Input style={styles.info} isDisabled="true">
                  Update your Age
                </Input>
              ) : (
                <Input style={styles.info} isDisabled="true">
                  {userProfile ? userProfile.user.age : ""} years old
                </Input>
              )}

              {userProfile && userProfile.user.gender === undefined ? (
                <Input style={styles.info} isDisabled="true">
                  Update your Gender
                </Input>
              ) : (
                <Input style={styles.info} isDisabled="true">
                  {userProfile ? userProfile.user.gender.toUpperCase() : ""}
                </Input>
              )}

              {userProfile && userProfile.user.address === undefined ? (
                <Input style={styles.info} isDisabled="true">
                  Update your Address
                </Input>
              ) : (
                <Input style={styles.infobrgy} isDisabled="true">
                  Purok #
                  {userProfile ? userProfile.user.address.house_purok_no : " "}{" "}
                  {userProfile ? userProfile.user.address.street : ""} St.
                  {"\n"} Brgy.
                  {userProfile ? userProfile.user.address.barangay : ""}{" "}
                </Input>
              )}
            </View>

            <View style={[styles.Lowercontainer, { flex: 3 }]}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.appButtonContainerLogin}
                  onPress={() => showModal()}
                >
                  <Text style={styles.appButtonTextLogin}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.appButtonContainerRegister}
                  onPress={() => [
                    AsyncStorage.removeItem("jwt"),
                    logoutUser(context.dispatch),
                  ]}
                >
                  <Text style={styles.appButtonTextRegister}>Sign Out</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.Line}></View>
            </View>
          </View>
        )}
      </FormContainerProfile>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Container style={styles.ImageContainerModal}>
              <View style={styles.ImageCircleModal}>
                <Image
                  source={{
                    uri: mainImage
                      ? mainImage
                      : "https://th.bing.com/th/id/OIP.NVgDAkBBANO4lnKq3Xqg1wHaHa?w=194&h=195&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                  }}
                  resizeMode="cover"
                  style={styles.image}
                />
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.imagePicker}
                >
                  <Icon style={{ color: "white" }} name="camera" />
                </TouchableOpacity>
              </View>
            </Container>
            <Container style={styles.ImageContainerModal}>
              <View style={styles.ImageCircleModal}>
                <TouchableOpacity
                  onPress={pickIValidId}
                  style={styles.ValidIdPicker}
                >
                  <Text style={styles.ValidIdText}>
                    Click to Upload Senior ID
                  </Text>
                </TouchableOpacity>
              </View>
            </Container>
            <FormContainerModal>
              <InputModal
                placeholder={"Firstname"}
                name={"firstname"}
                id={"firstname"}
                value={first_name}
                onChangeText={(text) => setFirstname(text)}
              />

              <InputModal
                placeholder={"Middlename"}
                name={"middlename"}
                id={"middlename"}
                value={middle_name}
                onChangeText={(text) => setMiddlename(text)}
              />

              <InputModal
                placeholder={"Lastname"}
                name={"lastname"}
                id={"lastname"}
                value={last_name}
                onChangeText={(text) => setLastname(text)}
              />

              <View style={styles.MainContainer}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  title={date.toISOString()}
                  // color="white"
                  onPress={showDatePicker}
                >
                  <Text>
                    BirthDate :
                    {moment(date.toISOString()).format("MMM DD YYYY")}
                  </Text>
                </TouchableOpacity>

                {datePicker && (
                  <DateTimePicker
                    value={date}
                    mode={"date"}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    is24Hour={true}
                    onChange={onDateSelected}
                    style={styles.datePicker}
                  />
                )}
              </View>

              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Checkbox
                    status={isChecked1 ? "checked" : "unchecked"}
                    color="red"
                    onPress={() => {
                      [
                        isChecked1
                          ? setGender("")
                          : // Checked
                          setGender("male")
                          ? // true
                            null
                          : // false
                            setGender("male"),

                        setIsChecked1(!isChecked1),
                      ];
                    }}
                    disabled={isChecked2 ? true : false}
                  />
                  <Text style={{ fontSize: 18, marginRight: 30 }}>Male</Text>
                  <Checkbox
                    status={isChecked2 ? "checked" : "unchecked"}
                    color="red"
                    onPress={() => {
                      [
                        isChecked2
                          ? setGender("")
                          : // Checked
                          setGender("female")
                          ? // true
                            null
                          : // false
                            setGender("female"),
                        setIsChecked2(!isChecked2),
                      ];
                    }}
                    disabled={isChecked1 ? true : false}
                  />
                  <Text style={{ fontSize: 18 }}>Female</Text>
                </View>
              </View>

              <InputModal
                placeholder={"House No/ Purok No"}
                name={"houseNumber"}
                id={"houseNumber"}
                value={houseNumber}
                onChangeText={(text) => setHouseNumber(text)}
              />

              <InputModal
                placeholder={"Street"}
                name={"street"}
                id={"street"}
                value={street}
                onChangeText={(text) => setStreet(text)}
              />
              <MultiSelect
                items={options}
                uniqueKey="id"
                onSelectedItemsChange={(items) => setBarangay(items[0])}
                selectedItems={barangay ? [barangay.id] : []}
                single={true}
                searchInputPlaceholderText="Select Barangay..."
                selectText={barangay ? barangay : "Select Barangay"}
                displayKey="name"
                styleMainWrapper={{
                  backgroundColor: Colors.rose_200,
                  width: "73%",
                  borderRadius: 10,
                }}
                styleInputGroup={{
                  borderWidth: 1,
                  borderColor: Colors.gray,
                  borderRadius: 10,
                  paddingLeft: 10,
                }}
                styleDropdownMenuSubsection={{
                  borderWidth: 1,
                  borderColor: Colors.gray,
                  borderRadius: 10,
                  paddingLeft: 10,
                }}
                searchInputStyle={{
                  fontSize: 18,
                }}
                textInputProps={{ editable: false }}
                searchIcon={false}
              />
            </FormContainerModal>

            <View style={[styles.LowerModalcontainer, { flex: 3 }]}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.appButtonContainerModalCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.appButtonTextLogin}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.appButtonContainerModalUpdate}
                  onPress={() => UpdateProfile()}
                >
                  <Text style={styles.appButtonTextRegister}>Submit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.Line}></View>
            </View>
          </View>
        </View>
      </Modal>
      <SuperAlert customStyle={customStyle} />
    </SafeAreaProvider>
  );
}

const customStyle = {
  container: {
    backgroundColor: Colors.main,
    borderRadius: 10,
  },
  buttonConfirm: {
    backgroundColor: Colors.red,
    borderRadius: 10,
    width: 70,
  },
  textButtonConfirm: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  title: {
    color: Colors.TextColor,
    fontSize: 24,
    fontWeight: "bold",
  },
  message: {
    color: "#4f4f4f",
    fontSize: 18,
  },
};

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
    // fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
    maxWidth: "90%",
    height: 40,
    margin: 10,
    paddingLeft: 20,
    // borderWidth :1,
    borderColor: Colors.underline,
    borderRadius: 10,
  },
  infobrgy: {
    textAlign: "center",
    fontSize: 14,
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
    margin: 5,
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
    margin: 5,
  },
  logoutbtn: {
    backgroundColor: "#ff1717",
    borderWidth: 2,
    height: 50,
    width: windowWidth / 2,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    // position: "absolute",
    // bottom: 10,
    // margin: 5,
  },
  appButtonTextRegister: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  centeredView: {  
    flex: 1,
    justifyContent: "center",
    alignItems: "center",  
  },
  modalView: {
    width:windowWidth/1.1, 
    height: windowHeight/1.025 ,
    backgroundColor: Colors.main,
    borderRadius: 20,
    padding: 30,
    alignItems: "center", 
    elevation: 5,
    borderColor: Colors.rose_200,
    borderWidth: 1,
  },
  infoedit: {
    backgroundColor: "red",
  },
  LowerModalcontainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
    paddingTop: 15,
    // backgroundColor: "grey",
  },
  appButtonContainerModalCancel: {
    backgroundColor: "#fff",
    borderWidth: 2,
    height: 50,
    width: windowWidth / 2.9,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: "absolute",
    bottom: 1,
    margin: 1,
  },
  appButtonContainerModalUpdate: {
    backgroundColor: "#ff1717",
    borderWidth: 2,
    height: 50,
    width: windowWidth / 2.9,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: "absolute",
    bottom: 1,
    margin: 1,
  },
  ImageContainerModal: {
    maxWidth: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    // marginBottom: 10,
    // backgroundColor: "red",
  },
  ImageCircleModal: {
    backgroundColor: "Colors.light",
    alignItems: "center",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 10,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
  ValidIdPicker: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: Colors.rose_300,
    elevation: 10,
    marginTop: 10,
  },
  ValidIdText: {
    color: Colors.red,
    fontSize: 18,
    fontWeight: "bold",
  },
  MainContainer: {
    // flex: 1,
    // padding: 6,
    // alignItems: "center",
  },

  // Style for iOS ONLY...
  datePicker: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: 80,
    height: 260,
    display: "flex",
  },
  datePickerButton: {
    // backgroundColor: "red",
    fontSize: 18,
    width: "73%",
    height: 40,
    marginBottom: 10,
    paddingLeft: 20,
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 10,
    paddingTop: 5,
  },
  GenderPickerButton: {
    fontSize: 18,
    width: "73%",
    height: 40,
    marginBottom: 20,
    paddingLeft: 20,
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 10,
    paddingTop: 5,
  },
  verifiedText: {
    color: "green",
  },
  NotverifiedText: {
    color: Colors.red,
  },
  pending: {
    color: Colors.warning,
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerTextStyle: {
    color: "red",
  },
  personalinformation: {
    width: windowWidth,
  },
  getVerify: {
    backgroundColor: "#ff1717",
    borderWidth: 2,
    height: 50,
    width: windowWidth / 2,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    // position: "absolute",
    // bottom: 10,
    margin: 10,
    alignItems: "center",
  },
  getLogout: {
    // backgroundColor: "#ff1717",
    // borderWidth: 2,
    height: 50,
    width: windowWidth / 2,
    // borderRadius: 5,
    // borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 10,
    alignItems: "center",
  },
});

export default Personal;
