import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import Colors from "../../Shared/Color";
import { Card } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

// Fetching Data
import AuthGlobal from "../../Context/store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import SuperAlert from "react-native-super-alert";

// Dimensions
const windowWidth = Dimensions.get("window").width;
const windowheight = Dimensions.get("window").height;

function FunctionList(props) {
  const [userProfile, setUserProfile] = useState();
  const context = useContext(AuthGlobal);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisibleloding, setModalVisibLoading] = useState(false);
  const [modalVisibleStatus, setModalVisibStatus] = useState(false);

  const [mystatus, setMyStatus] = useState();
  const [myVerified, setMyVerified] = useState();

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
            .then((user) => [
              setUserProfile(user.data),
              setMyStatus(user.data.user.status),
              setMyVerified(user.data.user.account_verified),
            ]);
        })
        .catch(() => console.log("error"));
    }, [])
  );

  const isVerified = () => {
    let status = myVerified;

    if (status !== undefined) {
      setModalVisibLoading(true);
      setTimeout(() => {
         setModalVisibLoading(false);
        userProfile && userProfile.user.account_verified === "pending"
          ? setModalVisible(true)
          : userProfile && userProfile.user.account_verified === "not verified"
          ? setModalVisible2(true)
          : mystatus !== "active"
          ? setModalVisibStatus(true)
          : props.navigation.navigate("Services");
      }, 1000);
    } else {
      setModalVisibLoading(true);
      setTimeout(() => {
        setModalVisibLoading(false);
        alert(
          "Connection Error!", // This is a title
          "Please try Again", // This is a alert message
          {
            type: "flashmessage",
            option: "danger",
            timeout: 2,
          }
        );
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Card style={styles.card} onPress={() => [isVerified()]}>
          <Card.Cover
            source={require("../../assets/services.png")}
            style={styles.cover}
          />
          <Text style={styles.title}>Services</Text>
        </Card>

        <Card
          style={styles.card}
          onPress={() => props.navigation.navigate("Donations")}
        >
          <Card.Cover
            source={require("../../assets/donation.png")}
            style={styles.cover}
          />
          <Text style={styles.title}>Donation</Text>
        </Card>
      </View>
      <View style={styles.item}>
        <Card
          style={styles.card}
          onPress={() => props.navigation.navigate("History")}
        >
          <Card.Cover
            source={require("../../assets/history.png")}
            style={styles.cover}
          />
          <Text style={styles.title}>History</Text>
        </Card>

        <Card
          style={styles.card}
          onPress={() => props.navigation.navigate("Schedules")}
        >
          <Card.Cover
            source={require("../../assets/activities.png")}
            style={styles.cover}
          />
          <Text style={styles.title}>Schedule</Text>
        </Card>
      </View>
      {/* Modal */}

      {/* Loading */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleloding}
        style={styles.modalView}
        onRequestClose={() => {
          setModalVisibLoading(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalBody}>
            <Image
              source={require("../../assets/loading.gif")}
              resizeMode="contain"
              style={styles.image}
            />
            <Text style={styles.headertitle1}>
              Please wait while processing your account
            </Text>
          </View>
        </View>
      </Modal>

      {/* Pending */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        style={styles.modalView}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredViewPending}>
          <View style={styles.modalBody}>
            <Image
              source={require("../../assets/pending.gif")}
              resizeMode="contain"
              style={styles.image}
            />
            <Text style={styles.headertitle}>Pending Account Verification</Text>
            <Text style={styles.subheader}>
              Your account verification is currently being reviewed by our team.
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.closebutton}
              onPress={() => [setModalVisible(false)]}
            >
              <Text style={styles.closebuttonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Not Verified */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        style={styles.modalView}
        onRequestClose={() => {
          setModalVisible2(false);
        }}
      >
        <View style={styles.centeredViewPending}>
          <View style={styles.modalBody}>
            <Image
              source={require("../../assets/not_verified.gif")}
              resizeMode="contain"
              style={styles.image}
            />
            <Text style={styles.headertitle}>Account Not Verified</Text>
            <Text style={styles.subheader}>
              To access our services, please visit your profile, click the
              "Verify" button, and complete all required information.
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.closebutton}
              onPress={() => [setModalVisible2(false)]}
            >
              <Text style={styles.closebuttonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Not Active */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleStatus}
        style={styles.modalView}
        onRequestClose={() => {
          setModalVisibStatus(false);
        }}
      >
        <View style={styles.centeredViewPending}>
          <View style={styles.modalBody}>
            <Image
              source={require("../../assets/restricted.gif")}
              resizeMode="contain"
              style={styles.image}
            />
            <Text style={styles.headertitle}>
              Your account has been restricted
            </Text>
            <Text style={styles.subheader}>
              We regret to inform you that your account has been temporarily
              restricted due to repeated instances of not attending to your
              bookings.
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.closebutton}
              onPress={() => [setModalVisibStatus(false)]}
            >
              <Text style={styles.closebuttonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <SuperAlert />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main,
    height: windowheight - 50,
    paddingTop: 40,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start", // if you want to fill rows left to right
  },
  item: {
    width: windowWidth / 2,
  },
  card: {
    backgroundColor: Colors.rose_200, // fallback color
    margin: 10,
    // borderBottomWidth: 2,
    borderRadius: 20,
    alignItems: "center",
    elevation: 30,
  },
  cover: {
    backgroundColor: Colors.rose_200,
    marginTop: 20,
    marginBottom: 50,
    width: 150,
    height: 150,
  },
  title: {
    color: Colors.gray,
    position: "absolute",
    bottom: 10, 
    alignSelf: "center",
    marginBottom: 5,
    fontSize: 24,
    fontWeight: "400",
  },
  image: {
    height: 300,
    width: 300,
    alignSelf: "center",
  },
  centeredView: {
    alignItems: "center",
    width: "90%",
    // minHeight: 300,
    alignSelf: "center",
    elevation: 20,
    borderColor: "#c5c5c5",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.main,
    position: "absolute",
    bottom: 200,
  },
  centeredViewPending: {
    alignItems: "center",
    width: "90%",
    // minHeight: 300,
    alignSelf: "center",
    elevation: 20,
    borderColor: "#c5c5c5",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.main,
    position: "absolute",
    bottom: 140,
  },
  header: {
    backgroundColor: "#ffbaba80",
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  subheader: {
    textAlign: "center",
    color: Colors.gray,
    fontSize: 18,
    marginBottom: 20,
  },

  modalBody: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  footer: {
    backgroundColor: Colors.main,
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  headertitle: {
    fontSize: 20,
    color: Colors.warning,
    fontWeight: "bold",
    marginBottom: 20,
  },
  headertitle1: {
    fontSize: 20,
    color: Colors.gray,
    // fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  closebutton: {
    backgroundColor: "#EF3A47",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    // position: "absolute",
    // right: 0,
    // margin: 10,
    padding: 10,
    width: 70,
  },
  closebuttonText: {
    color: Colors.TextWhite,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default FunctionList;
