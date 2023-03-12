import React, { useCallback, useContext, useState } from "react";
import {
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "react-native-paper";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

// Fething Data
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";

// Shared
import Colors from "../../Shared/Color";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormContainerModal from "../../Shared/Form/FormContainerModal";

// Dimensions
const windowheight = Dimensions.get("window").height;

function HistoryCard(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const context = useContext(AuthGlobal);
  const [historyId, setHistoryId] = useState();
  const [starRating, setStarRating] = useState(null);
  const [comment, setComment] = useState();
  const [token, setToken] = useState();
  const [refresh, setRefresh] = useState(false);

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
              `${baseURL}schedule/history/${context.stateUser.user.userId}`,
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
  const histories = userProfile && userProfile.filter;

  const pullMe = () => {
    setRefresh(true);
    AsyncStorage.getItem("jwt")
      .then((res) => {
        axios
          .get(`${baseURL}schedule/history/${context.stateUser.user.userId}`, {
            headers: { Authorization: `Bearer ${res}` },
          })
          .then((user) => setUserProfile(user.data), setToken(res));
        setTimeout(() => {
          setRefresh(false);
        }, 1000);
      })
      .catch((error) => console.log(error));
    return () => {
      setUserProfile();
    };
  };

  const postReview = () => {
    if (comment === null || starRating === null) {
      console.log("null");
    } else {
      let formData = new FormData();
      formData.append("rate", starRating);
      formData.append("comment", comment);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .put(`${baseURL}schedule/review/${historyId}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            pullMe();
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Review successfuly posted",
              text2: "Great!",
            });
            setTimeout(() => {
              props.navigation.navigate("History");
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });

      setModalVisible(false);
    }
  };
  return (
    <View>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            tintColor="transparent"
            colors={["transparent"]}
            style={{ backgroundColor: "transparent" }}
            refreshing={refresh}
            onRefresh={() => pullMe()}
          />
        }
      >
        <View style={styles.container}>
          {userProfile && userProfile.filter.length > 0 ? (
            histories.map((history, i) => {
              return (
                <Card style={styles.card} key={i}>
                  <Text style={styles.title}>{history.category}</Text>

                  <View style={styles.cardContent}>
                    <Text style={styles.subtitle}>ID :</Text>
                    <Text style={styles.description}>{history._id}</Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Icon name="calendar-o" style={styles.icon} size={20} />
                    <Text style={styles.colon}> :</Text>
                    <Text style={styles.description}>
                      {" "}
                      {moment(history.date_schedule).format("MMM Do YY")}{" "}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Icon name="clock-o" style={styles.icon} size={20} />
                    <Text style={styles.colon}> :</Text>
                    <Text style={styles.description}>8am to 5pm</Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.subtitle}>Status :</Text>
                    {history.status === "attended" ? (
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.attended}>
                          {history.status.toUpperCase()}
                        </Text>
                        {history.review === undefined ? (
                          <TouchableOpacity
                            onPress={() => [
                              setModalVisible(true),
                              setHistoryId(history._id),
                              setStarRating(null),
                              setComment(null),
                            ]}
                          >
                            <Icon
                              name="star"
                              style={styles.iconStar}
                              size={20}
                            />
                            <Text style={styles.iconlabel}>Review</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    ) : (
                      <Text style={styles.notattended}>
                        {/* {history.status.toUpperCase()}
                         */}
                         Not Attended
                      </Text>
                    )}
                  </View>
                </Card>
              );
            })
          ) : (
            <View style={[styles.center, { height: windowheight / 2 }]}>
              <Text>No History found</Text>
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
            <Text style={styles.headertitle}>Create Review</Text>
          </View>

          <Text style={styles.modalSubtitle}>How was your experience?</Text>
          <View style={styles.Starcontainer}>
            {/* <Text style={styles.heading}>{starRating ? `${starRating}*` : 'Tap to rate'}</Text> */}
            <View style={styles.stars}>
              <TouchableOpacity onPress={() => setStarRating(1)}>
                <MaterialIcons
                  name={starRating >= 1 ? "star" : "star-border"}
                  size={32}
                  style={
                    starRating >= 1
                      ? styles.starSelected
                      : styles.starUnselected
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStarRating(2)}>
                <MaterialIcons
                  name={starRating >= 2 ? "star" : "star-border"}
                  size={32}
                  style={
                    starRating >= 2
                      ? styles.starSelected
                      : styles.starUnselected
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStarRating(3)}>
                <MaterialIcons
                  name={starRating >= 3 ? "star" : "star-border"}
                  size={32}
                  style={
                    starRating >= 3
                      ? styles.starSelected
                      : styles.starUnselected
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStarRating(4)}>
                <MaterialIcons
                  name={starRating >= 4 ? "star" : "star-border"}
                  size={32}
                  style={
                    starRating >= 4
                      ? styles.starSelected
                      : styles.starUnselected
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStarRating(5)}>
                <MaterialIcons
                  name={starRating >= 5 ? "star" : "star-border"}
                  size={32}
                  style={
                    starRating >= 5
                      ? styles.starSelected
                      : styles.starUnselected
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modalBody}>
            <ScrollView>
              <View style={styles.textareaContainer}>
                <TextInput
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  placeholder="Type something"
                  placeholderTextColor="grey"
                  numberOfLines={10}
                  multiline={true}
                  id={"comment"}
                  value={comment}
                  onChangeText={(text) => setComment(text)}
                />

                <TouchableOpacity
                  style={styles.ReviewSubmit}
                  onPress={() => postReview()}
                >
                  <Text style={styles.closebuttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  card: {
    backgroundColor: Colors.main,
    width: "90%",
    height: 165,
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
    borderWidth: 1,
    borderColor: Colors.rose_300,
    borderRadius: 2,
    width: 30,
    padding: 5,
    position: "absolute",
    bottom: 5,
    marginLeft: 15,
    elevation: 2,
    backgroundColor: "white",
  },
  iconlabel: {
    fontSize: 16,
    fontStyle: "normal",
    marginLeft: 50,
  },
  centeredView: {
    // flex: 1,
    alignItems: "center",
    marginTop: 80,
    marginBottom: 10,
    width: "90%",
    minHeight: 500,
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
    // position:"absolute",
    // bottom:0,
    flex: 1,
    backgroundColor: Colors.main,
    width: "100%",
    // height:70,
    //   justifyContent: "center",
    // alignItems: "center",
  },
  footer: {
    // position:"absolute",
    // bottom:0,
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
  Starcontainer: {
    // flex: 1,
    backgroundColor: Colors.main,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
  starUnselected: {
    color: "#aaa",
  },
  starSelected: {
    color: "red",
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
  ReviewSubmit: {
    backgroundColor: "#EF3A47",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    margin: 10,
    padding: 10,
  },
  scrollView: {
    margin: 5,
    paddingBottom: 50,
    backgroundColor: "transparent",
  },
});
export default HistoryCard;
