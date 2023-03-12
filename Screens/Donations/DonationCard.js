import React, { useCallback, useContext, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "react-native-paper";
import moment from "moment";
import Toast from "react-native-toast-message";
import Dialog from "react-native-dialog";

import ViewShot from "react-native-view-shot";
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

// Dimensions
const windowheight = Dimensions.get("window").height;

function DonationCard(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [mydonations, setMyDonations] = useState();
  const context = useContext(AuthGlobal);
  const [token, setToken] = useState();
  const [refresh, setRefresh] = useState(false);
  const [donationImage, setDonationImage] = useState();
  const [category, setCategory] = useState();
  const [qty, setQty] = useState();

  // Fecth Donation
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
            .get(`${baseURL}donation/client/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => setMyDonations(user.data), setToken(res));
        })
        .catch((error) => console.log(error));
      return () => {
        setMyDonations();
      };
    }, [context.stateUser.isAuthenticated])
  );
  // console.log(mydonations && mydonations.donation.length);

  // Populating Data from database
  const donations = mydonations && mydonations.donation;
  // console.log(donations)

  // Refresh
  const pullMe = () => {
    setRefresh(true);
    AsyncStorage.getItem("jwt.")
      .then((res) => {
        axios
          .get(`${baseURL}donation/client/${context.stateUser.user.userId}`, {
            headers: { Authorization: `Bearer ${res}` },
          })
          .then((user) => setMyDonations(user.data), setToken(res));

        setTimeout(() => {
          setRefresh(false);
        }, 500);
      })
      .catch((error) => console.log(error));
    return () => {
      setMyDonations();
    };
  };

  // console.log(category)

  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => pullMe()} />
        }
      >
        <View style={styles.container}>
          {mydonations && mydonations.donation.length > 0 ? (
            donations.map((donation, i) => {
              // console.log(i);
              return (
                <Card style={styles.card} key={i}>
                  <Image
                    source={
                      donation.category === "Clothing"
                        ? require("../../assets/clothing.png")
                        : donation.category === "Personal Hygiene Items"
                        ? require("../../assets/hygienic.png")
                        : donation.category === "Bed Linens"
                        ? require("../../assets/bedliners.png")
                        : donation.category === "Books and Entertainment"
                        ? require("../../assets/booksen.png")
                        : donation.category === "Food"
                        ? require("../../assets/foods.png")
                        : donation.category === "Furniture"
                        ? require("../../assets/furniture.png")
                        : donation.category === "Medical Supplies"
                        ? require("../../assets/medicalequip.png")
                        : donation.category === "Electronics"
                        ? require("../../assets/electronics.png")
                        : donation.category === "Home Decor"
                        ? require("../../assets/homedecor.png")
                        : require("../../assets/other.png")
                    }
                    resizeMode="contain"
                    style={styles.image}
                  />
                  <Text style={styles.title}>{donation.category}</Text>

                  <View style={styles.cardContent}>
                    <Text style={styles.subtitle}>Quantity:</Text>
                    <Text style={styles.description}>{donation.quantity}</Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Icon name="calendar-o" style={styles.icon} size={20} />
                    <Text style={styles.colon}> :</Text>
                    <Text style={styles.description}>
                      {moment(donation.donatedAt).format("MM/DD/YYYY")}
                    </Text>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => [
                        setModalVisible(true),
                        //  setDonationImage(donation.image.url),
                        donation.image === undefined
                          ? setDonationImage(
                              "https://res.cloudinary.com/du7wzlg44/image/upload/v1675574530/Untitled_design_voefwk.jpg"
                            )
                          : setDonationImage(donation.image.url),
                        setCategory(donation.category),
                        setQty(donation.quantity),
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
              <Text>No Donation found</Text>
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
            <Text style={styles.headertitle}>Donation</Text>
          </View>

          <View style={styles.modalBody}>
            <Image
              source={{
                uri: donationImage,
              }}
              resizeMode="cover"
              style={styles.ModalImage}
            />
            <Text style={styles.Modalcategory}>{category}</Text>
            <Text style={styles.Modalcategory}>Quantity : {qty}</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.closebutton}
              onPress={() => [setModalVisible(false)]}
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
    backgroundColor: "#e8e8e8",
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
    marginBottom:40
  },
  card: {
    backgroundColor: Colors.light,
    width: "90%",
    height: 190,
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
    marginTop: 120,
    marginBottom: 10,
    width: "90%",
    minHeight: 450,
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
  viewButton: {
    width: 85,
    borderWidth: 1.5,
    borderColor: "red",
    position: "absolute",
    right: 0,
    padding: 10,
    bottom: 1,
    justifyContent: "center",
    borderRadius: 10,
  },
  image: {
    height: 70,
    width: 70,
    alignSelf: "center",
  },
  ModalImage: {
    height: "70%",
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
  Modalcategory: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    width: "90%",
    textAlign: "center",
    borderWidth: 0.5,
    padding: 5,
  },
});
export default DonationCard;
