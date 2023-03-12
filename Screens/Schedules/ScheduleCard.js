import React, { useCallback, useContext, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform, 
} from "react-native";
import { Card } from "react-native-paper";
import moment from "moment";
import Toast from "react-native-toast-message";

import { captureRef } from "react-native-view-shot";
import SuperAlert from "react-native-super-alert";
// Fething Data
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";

// Shared
import Colors from "../../Shared/Color";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay/lib";

// Saving Image Trial

import ViewShot from "react-native-view-shot"; 
import * as MediaLibrary from "expo-media-library";
// Dimensions
const windowheight = Dimensions.get("window").height;

function ScheduleCard(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const context = useContext(AuthGlobal);
  const [scheduleId, setScheduleId] = useState(); 
  const [token, setToken] = useState();
  const [refresh, setRefresh] = useState(false);
  const [status, setstatus] = useState("Reserved");
  const [qrImage, setqrImage] = useState();
  const [service, setService] = useState();
  const [scheduleDate, setScheduleDate] = useState();
  const [scheduleTime, setScheduleTime] = useState();
 
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
              `${baseURL}schedule/activity/${context.stateUser.user.userId}`,
              {
                headers: { Authorization: `Bearer ${res}` },
              }
            )
            .then((user) => setUserProfile(user.data), setToken(res));
        })
        .catch((error) => console.log(error));
    }, [])
  );

  // Populating Data from database
  const schedules = userProfile && userProfile.filter;

  const pullMe = () => {
    setRefresh(true);
    AsyncStorage.getItem("jwt.")
      .then((res) => {
        axios
          .get(`${baseURL}schedule/activity/${context.stateUser.user.userId}`, {
            headers: { Authorization: `Bearer ${res}` },
          })
          .then((user) => setUserProfile(user.data), setToken(res));

        setTimeout(() => {
          setRefresh(false);
        }, 500);
      })
      .catch((error) => console.log(error));
    return () => {
      setUserProfile();
    };
  };

  const confirmClick = () => {
    setLoading(true);
    axios
      .get(`${baseURL}schedule/activity/cancel/${scheduleId}`)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          pullMe();
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Schedule successfuly deleted",
            text2: "Great!",
          });
          setLoading(false);
          // setTimeout(() => {
          //   props.navigation.navigate("Schedules");
          // }, 500);
        }
      })
      .catch(() => {
        setLoading(false);
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });

    setModalVisible(false);
  };

  const cancelClick = () => {
    setModalVisible(false);
  };

  const handleDelete = () => {
    alert(
      "Warning!!", // This is a title
      "Do you want to delete this schedule? You cannot undo this action", // This is a alert message
      {
        textConfirm: "Confirm", // Label of button confirm
        textCancel: "Cancel", // Label of button cancel
        onConfirm: () => confirmClick(), // Call your confirm function
        onCancel: () => cancelClick(), // Call your cancel function
      }
    );
  };

  const viewHandle = () => {
    setModalVisible(true);
  };

  const cardRef = useRef(); // Use this hook inside your func. component *important

  // Define a function like this
  // get permission on android
  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      // handle error as you please
      console.log("err", err);
    }
  };

  const saveAsImage = async () => {
    try {
      // react-native-view-shot caputures component
      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 0.8,
      });

      if (Platform.OS !== "web") {
        const granted = await getPermissionAndroid();
        if (!granted) {
          return;
        } else {
          // cameraroll saves image
          MediaLibrary.requestPermissionsAsync();
          const image = MediaLibrary.saveToLibraryAsync(uri);
          if (image) {
            alert(
              "Image saved", // This is a title
              "Successfully saved image to your gallery.", // This is a alert message
              {
                textConfirm: "I Understand", // Label of button confirm
                onConfirm: () => setModalVisible(false), // Call your confirm function
              }
            );
          }
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View style={styles} >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => pullMe()} />
        }
      >
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={"Loading..."}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.container}>
          {userProfile && userProfile.filter.length > 0 ? (
            schedules.map((schedule ,i) => {
              return (
                <Card style={styles.card} key = {i}>
                  <Image
                    source={
                      schedule.category === "Recreational Activity"
                        ? require("../../assets/recreational.png")
                        : schedule.category === "Dialysis"
                        ? require("../../assets/dialysis.png")
                        : require("../../assets/multi_purpose.png")
                    }
                    resizeMode="contain"
                    style={styles.image_card}
                  />
                  <Text style={styles.title}>{schedule.category}</Text>

                  <View style={styles.cardContent}>
                    <Text style={styles.subtitle}>ID :</Text>
                    <Text style={styles.description}>{schedule._id}</Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Icon name="calendar-o" style={styles.icon} size={20} />
                    <Text style={styles.colon}> :</Text>
                    <Text style={styles.description}>
                      {moment(schedule.date_schedule).format("dddd")}{" "}
                      {moment(schedule.date_schedule).format("MMM Do YY")}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Icon name="clock-o" style={styles.icon} size={20} />
                    <Text style={styles.colon}> :</Text>
                    {schedule.time === "am" ? (
                      <Text style={styles.description}>
                        AM 8:00am to 11:59am
                      </Text>
                    ) : schedule.time === "pm" ? (
                      <Text style={styles.description}>
                        PM 1:00pm to 5:00pm
                      </Text>
                    ) : (
                      <Text style={styles.description}>8:00am to 5:00pm</Text>
                    )}
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.subtitle}>Status :</Text>
                    <Text style={styles.notattended}>{status}</Text>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => [
                        viewHandle(),
                        setScheduleId(schedule._id),
                        setService(schedule.category),
                        setScheduleTime(schedule.time),
                        setScheduleDate(
                          moment(schedule.date_schedule).format(
                            "dddd, MMMM Do YYYY"
                          )
                        ),
                        schedules &&
                          schedule.qr_code.map((qr) => {
                            setqrImage(qr.url);
                          }),
                      ]}
                    >
                      <Icon name="eye" style={styles.iconStar} size={20} />
                      <Text style={styles.iconlabel}>View</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })
          ) : (
            <View style={[styles.center, { height: windowheight / 2 }]}>
              <Text>No Schedule found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.header}>
            <Text style={styles.headertitle}>DETAILS</Text>
          </View>

          <View style={styles.modalBody}>
            <ViewShot style={styles.qrContainer} ref={cardRef}>
              <View style={styles.qrContainerinside}>
                <View style={styles.inputWrap}>
                  <Text style={styles.label}>Service Type</Text>
                  <Text style={styles.qrDescription}>{service}</Text>
                  <Text style={styles.label}>Date and Time</Text>
                  <Text style={styles.qrDescription}>{scheduleDate}</Text>
                  {scheduleTime === "am" ? (
                    <Text style={styles.qrDescription}>8:00am to 11:59am</Text>
                  ) : scheduleTime === "pm" ? (
                    <Text style={styles.qrDescription}>1:00pm to 5:00pm</Text>
                  ) : (
                    <Text style={styles.qrDescription}>8:00am to 5:00pm</Text>
                  )}
                  <Text style={styles.label}>Location</Text>
                  <Text style={styles.qrDescription}>
                    13, 1639 Manzanitas St, Taguig, Metro Manila
                  </Text>

                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../assets/favicon.png")}
                      resizeMode="cover"
                      style={styles.favicon}
                    />

                    <Image
                      source={require("../../assets/ealaga.png")}
                      resizeMode="cover"
                      style={styles.ealaga}
                    />
                  </View>
                </View>
                <View style={styles.inputWrap}>
                  <Text style={styles.labelcode}> Qr Code</Text>
                  <Image
                    source={{ uri: qrImage }}
                    resizeMode="cover"
                    style={styles.qrImahe}
                  />
                  <Text style={styles.note}>
                    Print this e-ticket and go directly to the center. You won’t
                    be able to avail the services without this.
                  </Text>
                </View>
              </View>
            </ViewShot>
          </View>

          <TouchableOpacity
            style={styles.saveImageSubmit}
            // onPress={() => {
            //   saveAsImage();
            // }}

            onPress={() => {
              saveAsImage();
            }}
          >
            <Text style={styles.saveImage}>Save Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.CancelSubmit}
            // title="Show dialog"
            onPress={handleDelete}
          >
            <Text style={styles.cancelButton}>Cancel Schedule</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.closebutton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closebuttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SuperAlert customStyle={customStyle} />
    </View>
  );
}
const customStyle = {
 
  container: {
    backgroundColor: Colors.main,
    borderRadius: 10,
  },
  buttonCancel: {
    backgroundColor: "#b51919",
    borderRadius: 5,
  },
  buttonConfirm: {
    backgroundColor: "#4490c7",
    borderRadius: 5,
  },
  textButtonCancel: {
    color: "#fff",
    fontWeight: "bold",
  },
  textButtonConfirm: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    color: Colors.TextColor,
    fontSize: 15,
  },
  message: {
    color: "#4f4f4f",
    fontSize: 15,
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center", 
    marginBottom:50
  },
  card: {
    backgroundColor: Colors.light,
    width: "90%",
    height: 250,
    margin: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#c5c5c5",
    elevation: 2,
    padding: 10,
  },
  title: {
    textAlign: "center",
    color: Colors.TextColor,
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  subtitle: {
    color: Colors.TextColor,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "bold",
    margin: 5,
  },
  description: {
    marginLeft: 5,
    fontSize: 16,
    fontStyle: "normal",
    margin: 5,
  },
  cardContent: {
    flexDirection: "row",
  },
  colon: {
    color: Colors.TextColor,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "bold",
    marginTop: 5,
  },

  icon: {
    color: Colors.TextColor,
    margin: 5,
  },
  iconStar: {
    color: Colors.TextColor,
    backgroundColor: Colors.light,
  },
  iconlabel: {
    fontSize: 16,
    fontStyle: "normal",
    position: "absolute",
    right: 10,
    color: "red",
    fontWeight: "900",
    backgroundColor: Colors.light,
  },
  centeredView: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 10,
    width: "90%",
    minHeight: 600,
    alignSelf: "center",
    elevation: 20,
    borderColor: "#c5c5c5",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: Colors.main,
  },
  header: {
    backgroundColor: "#D03043",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    flex: 1,
    // backgroundColor:Colors.red,
    width: "100%",
    alignItems: "center",
  },
  qrContainer: {
    flex: 1,
    backgroundColor: Colors.main,
    flexDirection: "row",
    alignItems: "flex-start",
    // height:200,
    paddingLeft: 5,
    height: "90%",
    borderWidth: 1,
    borderColor: "black",
    margin: 5,
    paddingTop: 10,
  },
  qrContainerinside: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 10,
  },
  label: {
    // flex: 1,
    fontWeight: "bold",
    color: Colors.TextColor,
    fontSize: 17,
    marginBottom: 5,
  },
  labelcode: {
    fontWeight: "bold",
    color: Colors.TextColor,
    fontSize: 17,
    marginBottom: 5,
    textAlign: "center",
  },
  inputWrap: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
  },
  qrDescription: {
    // flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  qrImahe: {
    // flex: 1,
    height: 180,
    width: "90%",
    alignSelf: "center",
  },
  favicon: {
    height: 60,
    width: 60,
    alignSelf: "center",
    margin: 5,
  },
  ealaga: {
    height: 50,
    width: 85,
    alignSelf: "center",
    margin: 5,
  },
  footer: {
    backgroundColor: "#ffbaba80",
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  headertitle: {
    fontSize: 18,
    color: Colors.TextWhite,
    fontWeight: "500",
  },
  closebutton: {
    backgroundColor: "#EF3A47",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    position: "absolute",
    right: 0,
    margin: 10,
    padding: 10,
  },
  closebuttonText: {
    color: Colors.TextWhite,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  cancelButton: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  saveImage: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 18,
    color: Colors.TextColor,
    fontWeight: "500",
    marginTop: 20,
  },
  attended: {
    marginLeft: 5,
    fontSize: 16,
    fontStyle: "normal",
    margin: 5,
    color: "green",
    fontWeight: "500",
  },
  notattended: {
    marginLeft: 5,
    fontSize: 16,
    fontStyle: "normal",
    margin: 5,
    color: Colors.TextColor,
    fontWeight: "500",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  textareaContainer: {
    width: "auto",
  },
  textArea: {
    height: 170,
    width: "90%",
    justifyContent: "flex-start",
    backgroundColor: Colors.main,
    marginTop: 20,
    margin: 10,
    alignSelf: "center",
    textAlign: "center",
    borderWidth: 2,
    borderColor: "#c5c5c5",
    borderRadius: 5,
    elevation: 2,
  },
  CancelSubmit: {
    backgroundColor: Colors.main,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "black",
    paddingVertical: 10,
    margin: 2,
    padding: 10,
    width: "90%",
  },
  saveImageSubmit: {
    backgroundColor: Colors.main,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    margin: 2,
    padding: 10,
    width: "90%",
  },
  viewButton: {
    width: 90,
    borderWidth: 1.5,
    borderColor: "red",
    position: "absolute",
    right: 0,
    bottom: 5,
    padding: 10,
    justifyContent: "center",
    borderRadius: 5,
  },
  note: {
    fontStyle: "italic",
    textAlign: "center",
  },
  spinnerTextStyle: {
    color: "red",
  },
  image_card: {
    height: 70,
    width: 70,
    alignSelf: "center",
  },
});
export default ScheduleCard;
