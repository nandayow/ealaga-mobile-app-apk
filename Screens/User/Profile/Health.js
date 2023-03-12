import React, { useCallback, useContext, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import MultiSelect from "react-native-multiple-select";
import Toast from "react-native-toast-message";
import { Checkbox } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay/lib";

// Color
import Colors from "../../../Shared/Color";

// Fething Data
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import AuthGlobal from "../../../Context/store/AuthGlobal";

// Dimensions
const windowWidth = Dimensions.get("window").width;

function Health(props) {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [token, setToken] = useState();
  const [requirements, setRequirements] = useState();
  const [loading, setLoading] = useState(false);

  // Requirement Checkbox
  const [cb_req1, setCb_req1] = useState(false);
  const [cb_req2, setCb_req2] = useState(false);
  const [cb_req3, setCb_req3] = useState(false);
  const [cb_req4, setCb_req4] = useState(false);
  const [cb_req5, setCb_req5] = useState(false);
  const [cb_req6, setCb_req6] = useState(false);
  const [cb_req7, setCb_req7] = useState(false);
  const [cb_req8, setCb_req8] = useState(false);
  const [confirm, setConfirm] = useState(false);

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
              setToken(res),
              user.data.user.requirement_id.includes("req1")
                ? setCb_req1(true)
                : setCb_req1(false),
              user.data.user.requirement_id.includes("req2")
                ? setCb_req2(true)
                : setCb_req2(false),
              user.data.user.requirement_id.includes("req3")
                ? setCb_req3(true)
                : setCb_req3(false),
              user.data.user.requirement_id.includes("req4")
                ? setCb_req4(true)
                : setCb_req4(false),
              user.data.user.requirement_id.includes("req5")
                ? setCb_req5(true)
                : setCb_req5(false),
              user.data.user.requirement_id.includes("req6")
                ? setCb_req6(true)
                : setCb_req6(false),
              user.data.user.requirement_id.includes("req7")
                ? setCb_req7(true)
                : setCb_req7(false),
              user.data.user.requirement_id.includes("req8")
                ? setCb_req8(true)
                : setCb_req8(false),
              setRequirements(user.data.user.requirement_id),
              setSelectedItems(user.data.user.health_id),
              setLoading(false),
            ]);
        })
        .catch((error) => console.log(error));
    }, [])
  );

  // Removing Requirement ID

  const removeReq1 = () => {
    let arr = requirements.filter((item) => item !== "req1");
    setRequirements(arr);
  };

  const removeReq2 = () => {
    let arr = requirements.filter((item) => item !== "req2");
    setRequirements(arr);
  };

  const removeReq3 = () => {
    let arr = requirements.filter((item) => item !== "req3");
    setRequirements(arr);
  };
  const removeReq4 = () => {
    let arr = requirements.filter((item) => item !== "req4");
    setRequirements(arr);
  };
  const removeReq5 = () => {
    let arr = requirements.filter((item) => item !== "req5");
    setRequirements(arr);
  };
  const removeReq6 = () => {
    let arr = requirements.filter((item) => item !== "req6");
    setRequirements(arr);
  };
  const removeReq7 = () => {
    let arr = requirements.filter((item) => item !== "req7");
    setRequirements(arr);
  };
  const removeReq8 = () => {
    let arr = requirements.filter((item) => item !== "req8");
    setRequirements(arr);
  };

  // Populating Data from database
  const sakits = userProfile && userProfile.health;
  var results = new Array();
  const resultHealth =
    sakits &&
    sakits.map((sakit) => {
      let records = { id: sakit._id, name: sakit.health_problem };
      results.push(records);
    });

  // console.log(results);
  // console.log(results);
  // console.log("sakits",sakits);

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);

    for (let i = 0; i < selectedItems.length; i++) {
      var tempItem = results.find((item) => item.id === selectedItems[i]);
    }
  };

  const UpdateHealth = () => {
    let formData = new FormData();

    for (let i = 0; i < selectedItems.length; i++) {
      var tempItem = results.find((item) => item.id === selectedItems[i]);
      formData.append("health_id", tempItem.id);
    }
    requirements.forEach((element) => {
      formData.append("requirement_id", element);
    });
    formData.append("confirm", confirm);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);
    // axios
    axios
      .put(
        `${baseURL}users/profile/updateHealth/${context.stateUser.user.userId}`,
        formData,
        config
      )
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Health successfuly updated",
            text2: "Great!",
          });
          setLoading(false);
          setTimeout(() => {
            props.navigation.navigate("Personal");
          }, 500);
          setConfirm(false);
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
      {/* <Container style={styles.ImageContainer}>
        <View style={styles.ImageCircle}>
          <Image
            source={{
              uri: userProfile ? userProfile.user.profile_picture.url : "",
            }}
            resizeMode="cover"
            style={styles.image}
          />
        </View>
      </Container> */}

      <ScrollView
        style={styles.healthbody}
        // title={userProfile ? userProfile.user.user_name : ""}
      >
        <View style={styles.MainContainer}>
          {/* Checkbox for Requirement lists */}
          <Text style={styles.text}> Dialysis Requirements</Text>

          {/* checkbox1 */}
          <View style={styles.Checkboxdetail}>
            <Checkbox
              status={cb_req1 ? "checked" : "unchecked"}
              color="red"
              onPress={() => {
                [
                  cb_req1
                    ? removeReq1()
                    : // Checked
                    requirements.includes("req1")
                    ? // true
                      null
                    : // false
                      requirements.push("req1"),
                  setCb_req1(!cb_req1),
                ];
              }}
            />
            <Text style={styles.label}>Medical Abstract or History</Text>
          </View>
          {/* checkbox2 */}
          <View style={styles.Checkboxdetail}>
            <Checkbox
              status={cb_req2 ? "checked" : "unchecked"}
              color="red"
              onPress={() => {
                [
                  cb_req2
                    ? removeReq2()
                    : // Checked
                    requirements.includes("req2")
                    ? // true
                      null
                    : // false
                      requirements.push("req2"),
                  setCb_req2(!cb_req2),
                ];
              }}
            />
            <Text style={styles.label}>
              Pinakahuling Hepatitis Profile - HBsAg, anti-HCV, anti-HBs{"\n"}
              (nakuha sa nakaraang tatlong buwan)
            </Text>
          </View>
          {/* checkbox3 */}
          <View style={styles.Checkboxdetail}>
            <Checkbox
              status={cb_req3 ? "checked" : "unchecked"}
              color="red"
              onPress={() => {
                [
                  cb_req3
                    ? removeReq3()
                    : // Checked
                    requirements.includes("req3")
                    ? // true
                      null
                    : // false
                      requirements.push("req3"),
                  setCb_req3(!cb_req3),
                ];
              }}
            />
            <Text style={styles.label}>
              Pinakahuling Complete Blood Count (CBC) (nakuha sa nakaraang
              buwan)
            </Text>
          </View>
          {/* checkbox4 */}
          <View style={styles.Checkboxdetail}>
            <Checkbox
              status={cb_req4 ? "checked" : "unchecked"}
              color="red"
              onPress={() => {
                [
                  cb_req4
                    ? removeReq4()
                    : // Checked
                    requirements.includes("req4")
                    ? // true
                      null
                    : // false
                      requirements.push("req4"),
                  setCb_req4(!cb_req4),
                ];
              }}
            />
            <Text style={styles.label}>
              Pinakahuling resulta ng Creatin, K, Ca, Phosphorus, Albumin{"\n"}
              (nakuha sa nakaraang buwan)
            </Text>
          </View>
          {/* checkbox5 */}
          <View style={styles.Checkboxdetail}>
            <Checkbox
              status={cb_req5 ? "checked" : "unchecked"}
              color="red"
              onPress={() => {
                [
                  cb_req5
                    ? removeReq5()
                    : // Checked
                    requirements.includes("req5")
                    ? // true
                      null
                    : // false
                      requirements.push("req5"),
                  setCb_req5(!cb_req5),
                ];
              }}
            />
            <Text style={styles.label}>
              Swab Test Result (nakuha sa nakaraang dalawang linggo)
            </Text>
          </View>
          {/* checkbox6*/}
          <View style={styles.Checkboxdetail}>
            <Checkbox
              status={cb_req6 ? "checked" : "unchecked"}
              color="red"
              onPress={() => {
                [
                  cb_req6
                    ? removeReq6()
                    : // Checked
                    requirements.includes("req6")
                    ? // true
                      null
                    : // false
                      requirements.push("req6"),
                  setCb_req6(!cb_req6),
                ];
              }}
            />
            <Text style={styles.label}>
              Chest X-ray {"\n"}(nakuha sa nakaraang anim buwan)
            </Text>
          </View>
          {/* checkbox7*/}
          <View style={styles.Checkboxdetail}>
            <Checkbox
              status={cb_req7 ? "checked" : "unchecked"}
              color="red"
              onPress={() => {
                [
                  cb_req7
                    ? removeReq7()
                    : // Checked
                    requirements.includes("req7")
                    ? // true
                      null
                    : // false
                      requirements.push("req7"),
                  setCb_req7(!cb_req7),
                ];
              }}
            />
            <Text style={styles.label}>
              Kopya ng Treatment Monitoring Sheet/Record (Huling tatlong
              treatment) mula sa huling dialysis center
            </Text>
          </View>
          {/* checkbox8*/}
          <View style={styles.Checkboxdetail}>
            <Checkbox
              status={cb_req8 ? "checked" : "unchecked"}
              color="red"
              onPress={() => {
                [
                  cb_req8
                    ? removeReq8()
                    : // Checked
                    requirements.includes("req8")
                    ? // true
                      null
                    : // false
                      requirements.push("req8"),
                  setCb_req8(!cb_req8),
                ];
              }}
            />
            <Text style={styles.label}>
              Voter's Registration/Certificate or any Valid ID
            </Text>
          </View>

          {/* Multiselect Component */}
          <Text style={styles.text}> Health Disclosure </Text>
          <MultiSelect
            hideTags
            items={results}
            uniqueKey="id"
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="Select Items"
            searchInputPlaceholderText="Select Health problem here..."
            onChangeInput={(text) => console.log(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#ff1717"
            selectedItemIconColor="#ff1717"
            itemTextColor="#000"
            displayKey="name"
            submitButtonColor="#ff1717"
            submitButtonText="Done"
            textInputProps={{ editable: false }}
            searchIcon={false}
            styleDropdownMenuSubsection={{ backgroundColor: Colors.rose_200 }}
            searchInputStyle={{ backgroundColor: Colors.rose_200 }}
            hideDropdown={true}
          />
        </View>
        {/* Checkbox Confirm */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={confirm ? "checked" : "unchecked"}
            color="red"
            onPress={() => {
              [
                confirm
                  ? setConfirm(false)
                  : // false
                    setConfirm(true),
                setConfirm(!confirm),
              ];
            }}
          />
          <Text style={styles.label}>I verify all the Information</Text>
        </View>
        <View style={[styles.Lowercontainer]}>
          <TouchableOpacity
            style={[confirm ? styles.appButtonUpdate1 : styles.appButtonUpdate]}
            onPress={() => [UpdateHealth()]}
            disabled={confirm ? false : true}
          >
            <Text style={styles.appButtonTextUpdate}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontWeight: "bold",
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
  infoContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  Lowercontainer: {
    padding: 15,
  },
  appButtonTextUpdate: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
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
  appButtonUpdate: {
    backgroundColor: Colors.disabled,
    borderWidth: 2,
    height: 50,
    width: windowWidth / 1.2,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 5,
    alignSelf: "center",
  },
  appButtonUpdate1: {
    backgroundColor: Colors.TextColor,
    borderWidth: 2,
    height: 50,
    width: windowWidth / 1.2,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 5,
    alignSelf: "center",
  },
  MainContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.main,
    width: windowWidth / 1.1,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.red,
    alignSelf: "center",
    marginTop: 10,
  },
  text: {
    padding: 12,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  buttonContainer: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 6,
    textAlign: "justify",
  },

  spinnerTextStyle: {
    color: "red",
  },
  Checkboxdetail: {
    flexDirection: "row",
    paddingRight: 32,
  },
});

export default Health;
