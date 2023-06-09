import React, { useState, useContext, useCallback } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { Card, Checkbox, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import moment from "moment";
import SuperAlert from "react-native-super-alert";
import DropDownPicker from "react-native-dropdown-picker";

// Shared
import Colors from "../../Shared/Color";
import { Calendar } from "react-native-calendars";
// Auth related
import AuthGlobal from "../../Context/store/AuthGlobal";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useFocusEffect } from "@react-navigation/native";

// Dimensions
const windowWidth = Dimensions.get("window").width;
const windowheight = Dimensions.get("window").height;

function ServiceProgressSteps(props) {
  // Data
  const context = useContext(AuthGlobal);
  const [loading, setLoading] = useState(false);
  const [purpose, setPurpose] = useState();
  const [attendees, setAttendees] = useState();
  const [openAttendees, setOpenAttendees] = useState(false);

  const [attendeesOption, setAttendeesOption] = useState([
    { label: "10-15 attendees", value: "10-15" },
    { label: "16-20 attendees", value: "16-20" },
    { label: "21 or more attendees", value: "21-above" },
  ]);
  // Steps
  const [step, setStep] = useState();
  const [service, setService] = useState();
  const [category_time, setCategory_time] = useState();
  const [requirementlist, setRequirementList] = useState();
  const [first_name, setFirstName] = useState();
  // Dates
  const [selectedDate, setSelectedDate] = useState(null);
  const today = moment(new Date()).format("yyyy-MM-DD");
  const markedWeekends = {};
  const [existingDates, setExistingDates] = useState();
  const [existingmpham, setExistingmpham] = useState();
  const [existingmphpm, setExistingmphpm] = useState();
  const [existingmphwholeday, setExistingmphwholeday] = useState();
  const [slot_recreational_am, setSlot_recreational_am] = useState();
  const [slot_recreational_pm, setSlot_recreational_pm] = useState();
  const [slot_dialysis_am, setslot_dialysis_am] = useState();
  const [slot_dialysis_pm, setslot_dialysis_pm] = useState();

  var d = new Date();
  var getTot = (d.getMonth(), d.getFullYear()); //Get total days in a month
  var sat = new Array(); //Declaring array for inserting Saturdays
  var sun = new Array(); //Declaring array for inserting Sundays
  var existingDate = new Array(); //Declaring array for existing date in calendar
  var existingDatempham = new Array(); //Declaring array for existing mph am date in calendar
  var existingDatemphpm = new Array(); //Declaring array for existing mph pm date in calendar
  var existingDatemphwholeday = new Array(); //Declaring array for existing whole am date in calendar
  var SlotsDateam = new Array(); //Declaring array for  existing 0  am date in calendar
  var SlotsDatepm = new Array(); //Declaring array for  existing 0  pm date in calendar
  var SlotsDateamDialysis = new Array(); //Declaring array for  existing 0  am date in calendar
  var SlotsDatepmDialysis = new Array(); //Declaring array for  existing 0  am date in calendar
  var SlotsZero = new Array(); //Declaring array for  0 slots date in calendar

  const [isamVisible, setamIsVisible] = useState(true);
  const [ispmVisible, setpmIsVisible] = useState(true);

  const [ismphamVisible, setmphamIsVisible] = useState(true);
  const [ismphpmVisible, setmphpmIsVisible] = useState(true);
  const [iswholedayVisible, setwholedayIsVisible] = useState(true);

  // Getting Exisitng Dates

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("User");
      }

      setLoading(true);
      const requests = [
        axios.get(
          `${baseURL}schedule/schedule/${context.stateUser.user.userId}`
        ),
        axios.get(
          `${baseURL}users/profile/edit/${context.stateUser.user.userId}`
        ),
        axios.get(
          `${baseURL}schedule/activity/${context.stateUser.user.userId}`
        ),
      ];

      Promise.all(requests)
        .then((responses) => {
          const [schedule, profile, activity] = responses;

          setExistingmpham(schedule.data.userMultipurposeSchedAm);
          setExistingmphpm(schedule.data.userMultipurposeSchedPm);
          setExistingmphwholeday(schedule.data.userMultipurposeSchedWhole);
          setSlot_recreational_am(schedule.data.slot_recreational_am);
          setSlot_recreational_pm(schedule.data.slot_recreational_pm);
          setslot_dialysis_am(schedule.data.slot_dialysis_am);
          setslot_dialysis_pm(schedule.data.slot_dialysis_pm);

          setRequirementList(profile.data.user.requirement_id);
          setFirstName(profile.data.user.first_name);
          setExistingDates(activity.data);

          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }, [])
  );

  // Existing Date
  const passExisitngDates = existingDates && existingDates.filter;
  if (existingDates && existingDates.filter.length > 0) {
    passExisitngDates.map((schedule) => {
      existingDate.push(moment(schedule.date_schedule).format("yyyy-MM-DD"));
    });

    existingDate.forEach((val) => {
      markedWeekends[val] = {
        disabled: true,
      };
    });
  }

  // Check available slots

  if (service === "Recreational Activity") {
    // AM
    const passslot_recreational_am =
      slot_recreational_am && slot_recreational_am;
    if (slot_recreational_am && slot_recreational_am.length > 0) {
      const filteredArray = passslot_recreational_am.filter((element) => {
        return element.avaliableSlot === 0;
      });

      filteredArray.map((slots) => {
        let dateObject = slots.date;
        const parts = dateObject.split("/");
        const yyyyMMdd = `${parts[2]}-${parts[0].padStart(
          2,
          "0"
        )}-${parts[1].padStart(2, "0")}`;
        SlotsZero.push(yyyyMMdd);
        SlotsDateam.push(yyyyMMdd);
      });
    }
    // PM
    const passslot_recreational_pm =
      slot_recreational_pm && slot_recreational_pm;
    if (slot_recreational_pm && slot_recreational_pm.length > 0) {
      const filteredArray = passslot_recreational_pm.filter((element) => {
        return element.avaliableSlot === 0;
      });

      filteredArray.map((slots) => {
        let dateObject = slots.date;
        const parts = dateObject.split("/");
        const yyyyMMdd = `${parts[2]}-${parts[0].padStart(
          2,
          "0"
        )}-${parts[1].padStart(2, "0")}`;

        SlotsZero.push(yyyyMMdd);
        SlotsDatepm.push(yyyyMMdd);
      });
    }
    // SlotsZero.forEach((val) => {
    //   markedWeekends[val] = {
    //     disabled: true,
    //   };
    // });
  }

  if (service === "Multipurpose Hall") {
    // // Whole Day
    const passExisitngDatesmphwholeday =
      existingmphwholeday && existingmphwholeday;
    if (existingmphwholeday && existingmphwholeday.length > 0) {
      passExisitngDatesmphwholeday.map((schedule) => {
        existingDatemphwholeday.push(moment(schedule).format("yyyy-MM-DD"));
      });

      existingDatemphwholeday.forEach((val) => {
        let dateObject = moment(new Date(val)).format("yyyy-MM-DD"); // Creating a new Date object by passing the date string as argument
        markedWeekends[dateObject] = {
          disabled: true,
        };
      });
    }

    // Morning MPH
    const passExisitngDatesmpham = existingmpham && existingmpham;
    if (existingmpham && existingmpham.length > 0) {
      passExisitngDatesmpham.map((schedule) => {
        existingDatempham.push(moment(schedule).format("yyyy-MM-DD"));
      });
    }

    // PM MPH
    const passExisitngDatesmphpm = existingmphpm && existingmphpm;
    if (existingmphpm && existingmphpm.length > 0) {
      passExisitngDatesmphpm.map((schedule) => {
        existingDatemphpm.push(moment(schedule).format("yyyy-MM-DD"));
      });
    }
  }

  if (service === "Dialysis") {
    // AM DIALAYIS
    const passslot_dialysis_am = slot_dialysis_am && slot_dialysis_am;
    if (slot_dialysis_am && slot_dialysis_am.length > 0) {
      const filteredArray = passslot_dialysis_am.filter((element) => {
        return element.avaliableSlot === 0;
      });

      filteredArray.map((slots) => {
        let dateObject = slots.date;
        const parts = dateObject.split("/");
        const yyyyMMdd = `${parts[2]}-${parts[0].padStart(
          2,
          "0"
        )}-${parts[1].padStart(2, "0")}`;
        SlotsZero.push(yyyyMMdd);
        SlotsDateamDialysis.push(yyyyMMdd);
      });
    }
    // PM DIALYSIS
    const passslot_dialysis_apm = slot_dialysis_pm && slot_dialysis_pm;
    if (slot_dialysis_pm && slot_dialysis_pm.length > 7) {
      const filteredArray = passslot_dialysis_apm.filter((element) => {
        return element.avaliableSlot === 0;
      });

      filteredArray.map((slots) => {
        let dateObject = slots.date;
        const parts = dateObject.split("/");
        const yyyyMMdd = `${parts[2]}-${parts[0].padStart(
          2,
          "0"
        )}-${parts[1].padStart(2, "0")}`;
        SlotsZero.push(yyyyMMdd);
        SlotsDatepmDialysis.push(yyyyMMdd);
      });
    }
  }

  // ....

  // Mark Selected Date
  markedWeekends[selectedDate] = {
    selected: true,
    selectedColor: "red",
  };
  // Geeting Weekends
  for (var i = 1; i <= getTot; i++) {
    //looping through days in month
    var newDate = new Date(d.getFullYear(), d.getMonth(), i);
    if (newDate.getDay() == 0) {
      //if Sunday
      sun.push(moment(newDate).format("yyyy-MM-DD"));
    }
    if (newDate.getDay() == 6) {
      //if Saturday
      sat.push(moment(newDate).format("yyyy-MM-DD"));
    }
  }
  sun.forEach((val) => {
    markedWeekends[val] = {
      disabled: true,
    };
  });

  sat.forEach((val) => {
    markedWeekends[val] = {
      disabled: true,
    };
  });
  // ...

  const newToday = moment(today).format("yyyy-MM-DD");
  markedWeekends[newToday] = {
    disabled: true,
  };

  // Starting Day
  let Datetoday = new Date(); // create a new Date object for today's date
  let tomorrow = new Date(); // create a new Date object for tomorrow's date
  tomorrow.setDate(Datetoday.getDate() + 1); // set tomorrow's date by adding one day to today's date
  const minTom = moment(tomorrow).format("yyyy-MM-DD");

  // Modals
  const [recreationalmodalVisible, setRecreationalmodalVisible] =
    useState(false);
  const [multipurposemodalVisible, setMultipurposemodalVisible] =
    useState(false);
  const [dialysismodalVisible, setDialysismodalVisible] = useState(false);
  const [servicesmodalVisible, setServicesmodalVisible] = useState(false);
  const [reqmodalVisible, setReqmodalVisible] = useState(false);
  const [mphmodalVisible, setMphmodalVisible] = useState(false);
  const [isReminderVisible, setReminderVisible] = useState(false);

  const buttonTextStyle = {
    color: "red",
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);

    if (service === "Recreational Activity") {
      if (
        SlotsDateam.includes(day.dateString) === true &&
        SlotsDatepm.includes(day.dateString) === true
      ) {
        alert(
          `Hi, ${first_name}`, // This is a title
          "Sorry the selected date is not Available. Kindly select another Date.", // This is a alert message
          {
            type: "flashmessage",
            option: "danger",
            timeout: 5,
          }
        );
      } else if (
        SlotsDateam.includes(day.dateString) === false &&
        SlotsDatepm.includes(day.dateString) === true
      ) {
        setpmIsVisible(false);
        setamIsVisible(true);
        setRecreationalmodalVisible(true);
      } else if (
        SlotsDateam.includes(day.dateString) === true &&
        SlotsDatepm.includes(day.dateString) === false
      ) {
        setpmIsVisible(true);
        setamIsVisible(false);
        setRecreationalmodalVisible(true);
      } else {
        setpmIsVisible(true);
        setamIsVisible(true);
        setRecreationalmodalVisible(true);
      }
    } else if (service === "Multipurpose Hall") {
      // Check if selected date exist in multi-purpose am
      if (existingDatempham.includes(day.dateString) === true) {
        setmphamIsVisible(false);
        setmphpmIsVisible(true);
        setwholedayIsVisible(false);
      } else if (existingDatemphpm.includes(day.dateString) === true) {
        setmphamIsVisible(true);
        setmphpmIsVisible(false);
        setwholedayIsVisible(false);
      } else {
        setmphamIsVisible(true);
        setmphpmIsVisible(true);
        setwholedayIsVisible(true);
      }
      // ....
      setMultipurposemodalVisible(true);
    } else {
      if (
        SlotsDateamDialysis.includes(day.dateString) === true &&
        SlotsDatepmDialysis.includes(day.dateString) === true
      ) {
        alert(
          `Hi, ${first_name}`, // This is a title
          "Sorry the selected date is not Available. Kindly select another Date.", // This is a alert message
          {
            type: "flashmessage",
            option: "danger",
            timeout: 5,
          }
        );
      } else if (
        SlotsDateamDialysis.includes(day.dateString) === true &&
        SlotsDatepmDialysis.includes(day.dateString) === false
      ) {
        setamIsVisible(false);
        setpmIsVisible(true);
        setDialysismodalVisible(true);
      } else if (
        SlotsDateamDialysis.includes(day.dateString) === false &&
        SlotsDatepmDialysis.includes(day.dateString) === true
      ) {
        setamIsVisible(true);
        setpmIsVisible(false);
        setDialysismodalVisible(true);
      } else {
        setamIsVisible(true);
        setpmIsVisible(true);
        setDialysismodalVisible(true);
      }
    }
  };

  const bookService = () => {
    if (category_time === undefined || selectedDate === null) {
      alert(
        "Warning!!", // This is a title
        "Set date and time", // This is a alert message
        {
          type: "flashmessage",
          option: "danger",
          timeout: 3,
        }
      );
    } else {
      const newSelectedDate = moment(selectedDate).format("M/D/YYYY");

      let services = {
        date: newSelectedDate,
        user_id: context.stateUser.user.userId,
        category: service,
        status: "reserved",
        category_time: category_time,
        recreational_services2: isServices,
        purpose: purpose,
        attendees_number: attendees,
      };

      setLoading(true);
      axios
        .post(`${baseURL}schedule/schedule/add`, services)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Scheduling Service Successfully",
              text2: "Great!",
            });
            setLoading(false);
            setReminderVisible(true);
          } else {
            setLoading(false);
            Toast.show({
              topOffset: 60,
              type: "error",
              text1: "Time not Available",
              text2: "Please try again",
            });
          }
        })
        .catch(() => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
          setLoading(false);
        });
    }
  };

  // Checkbox

  const [isServices, setServices] = useState([]);
  const [checkedballroom, setCheckedBallroom] = useState(false);
  const [checkedgym, setCheckedGym] = useState(false);
  const [checkedmassage, setCheckedMassage] = useState(false);
  const [checkedtheater, setCheckedtheater] = useState(false);
  const [checkedsauna, setCheckedSauna] = useState(false);
  const [checkedtherapy, setCheckedTherapy] = useState(false);
  const [checkedyoga, setCheckedYoga] = useState(false);

  const removeBallroom = () => {
    let arr = isServices.filter((item) => item !== "Ballroom");
    setServices(arr);
  };
  const removeGym = () => {
    let arr = isServices.filter((item) => item !== "Gym");
    setServices(arr);
  };
  const removeMassage = () => {
    let arr = isServices.filter((item) => item !== "Massage");
    setServices(arr);
  };
  const removeTheater = () => {
    let arr = isServices.filter((item) => item !== "Mini Theater");
    setServices(arr);
  };
  const removeSauna = () => {
    let arr = isServices.filter((item) => item !== "Sauna");
    setServices(arr);
  };
  const removeTherapy = () => {
    let arr = isServices.filter((item) => item !== "Therapy Pool");
    setServices(arr);
  };
  const removeYoga = () => {
    let arr = isServices.filter((item) => item !== "Yoga");
    setServices(arr);
  };

  const isDialysis = () => {
    if (requirementlist.length !== 8) {
      alert(
        "Incomplete Requirements", // This is a title
        "Your requirements for dialysis in your health information profile are currently incomplete.", // This is a alert message
        {
          textConfirm: "I Understand", // Label of button confirm
          onConfirm: () => setReqmodalVisible(false), // Call your confirm function
        }
      );
    } else {
      setReqmodalVisible(false);
      setStep(2);
      setService("Dialysis");
    }
  };

  const isMPH = () => {
    if (purpose === undefined || attendees === undefined) {
      setMphmodalVisible(false);
      alert(
        "Warning!!", // This is a title
        "Kindly Provide the required information", // This is a alert message
        {
          type: "flashmessage",
          option: "danger",
          timeout: 3,
        }
      );
    } else {
      setMphmodalVisible(false);
      setStep(2);
      setService("Multipurpose Hall");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <ProgressSteps
        activeStepIconColor={Colors.rose_300}
        activeStepIconBorderColor="#ff1717"
        completedProgressBarColor="#686868"
        completedStepIconColor={Colors.rose_300}
        activeStep={step}
        activeLabelColor={Colors.red}
      >
        <ProgressStep
          label="Pick a services"
          nextBtnTextStyle={buttonTextStyle}
          removeBtnRow={true}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View style={styles.container}>
            <View style={styles.item}>
              <Card
                style={styles.card}
                onPress={() => [
                  // setStep(2),
                  setServicesmodalVisible(true),
                  setService("Recreational Activity"),
                ]}
              >
                <Card.Cover
                  source={require("../../assets/activities.png")}
                  style={styles.cover}
                />
                <Text style={styles.title}>Recreational</Text>
              </Card>

              <Card
                style={styles.card}
                onPress={() => setMphmodalVisible(true)}
              >
                <Card.Cover
                  source={require("../../assets/multi_purpose.png")}
                  style={styles.cover}
                />
                <Text style={styles.title}>MPH</Text>
              </Card>
            </View>
            <View style={styles.item}>
              <Card
                style={styles.card}
                onPress={() => setReqmodalVisible(true)}
              >
                <Card.Cover
                  source={require("../../assets/dialysis.png")}
                  style={styles.cover}
                />
                <Text style={styles.title}>Dialysis</Text>
              </Card>
            </View>
          </View>
        </ProgressStep>

        <ProgressStep
          label="Set a Schedule and Confirm"
          // removeBtnRow	= {false}
          onPrevious={() => setStep()}
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={buttonTextStyle}
          onSubmit={() => bookService()}
        >
          <View style={{ alignItems: "center" }}>
            <Calendar
              onDayPress={onDayPress}
              // markedDates={{
              //   [selectedDate]: { selected: true, selectedColor: "red" },
              // }}
              markedDates={markedWeekends}
              minDate={minTom}
              disableAllTouchEventsForDisabledDays={true}
            />
          </View>
        </ProgressStep>
      </ProgressSteps>

      {/* Modals */}
      {/* Recreational Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={recreationalmodalVisible}
        onRequestClose={() => {
          setRecreationalmodalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.headertitle}>Select a Time</Text>
            <View style={styles.row}>
              {isamVisible && (
                <View style={styles.box}>
                  <TouchableOpacity
                    style={styles.touchableOpacity}
                    onPress={() => [
                      setRecreationalmodalVisible(false),
                      setCategory_time("recreational_am"),
                    ]}
                  >
                    <Image
                      source={require("../../assets/am.png")}
                      resizeMode="contain"
                      style={styles.image}
                    />
                  </TouchableOpacity>
                  <Text style={styles.timestyle}>8:00am - 11:59am</Text>
                </View>
              )}
              {ispmVisible && (
                <View style={styles.box}>
                  <TouchableOpacity
                    style={styles.touchableOpacity}
                    onPress={() => [
                      setRecreationalmodalVisible(false),
                      setCategory_time("recreational_pm"),
                    ]}
                  >
                    <Image
                      source={require("../../assets/pm.png")}
                      resizeMode="contain"
                      style={styles.image}
                    />
                  </TouchableOpacity>
                  <Text style={styles.timestyle}>1:00pm - 5:00pm</Text>
                </View>
              )}
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.closebutton}
                onPress={() => [setRecreationalmodalVisible(false)]}
              >
                <Text style={styles.closebuttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Services Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={servicesmodalVisible}
        onRequestClose={() => {
          setServicesmodalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.headertitle}>Recreational Activities</Text>
            <Text style={styles.description}>
              Select a recreational activities you want to avail
            </Text>
            <Text style={styles.subdescription}>(Maximum of 3)</Text>

            <View style={styles.CheckboxContainer}>
              {/* Checkbox */}
              <View style={styles.Checkboxdetail}>
                <Checkbox
                  status={checkedballroom ? "checked" : "unchecked"}
                  color="red"
                  onPress={() => {
                    [
                      checkedballroom
                        ? removeBallroom()
                        : // Checked
                        isServices.includes("Ballroom")
                        ? // true
                          null
                        : // false
                          isServices.push("Ballroom"),
                      setCheckedBallroom(!checkedballroom),
                    ];
                  }}
                  disabled={
                    checkedballroom === true && isServices.length > 3
                      ? false
                      : checkedballroom === false && isServices.length < 3
                      ? false
                      : isServices.length < 3
                      ? false
                      : checkedballroom === true
                      ? false
                      : true
                  }
                />
                <Text style={styles.label}>Ballroom</Text>
              </View>

              <View style={styles.Checkboxdetail}>
                <Checkbox
                  status={checkedgym ? "checked" : "unchecked"}
                  color="red"
                  onPress={() => {
                    [
                      checkedgym
                        ? removeGym()
                        : // Checked
                        isServices.includes("Gym")
                        ? // true
                          null
                        : // false
                          isServices.push("Gym"),
                      setCheckedGym(!checkedgym),
                    ];
                  }}
                  disabled={
                    checkedgym === true && isServices.length > 3
                      ? false
                      : checkedgym === false && isServices.length < 3
                      ? false
                      : isServices.length < 3
                      ? false
                      : checkedgym === true
                      ? false
                      : true
                  }
                />
                <Text style={styles.label}>Gym</Text>
              </View>

              <View style={styles.Checkboxdetail}>
                <Checkbox
                  status={checkedmassage ? "checked" : "unchecked"}
                  color="red"
                  onPress={() => {
                    [
                      checkedmassage
                        ? removeMassage()
                        : // Checked
                        isServices.includes("Massage")
                        ? // true
                          null
                        : // false
                          isServices.push("Massage"),
                      setCheckedMassage(!checkedmassage),
                    ];
                  }}
                  disabled={
                    checkedmassage === true && isServices.length > 3
                      ? false
                      : checkedmassage === false && isServices.length < 3
                      ? false
                      : isServices.length < 3
                      ? false
                      : checkedmassage === true
                      ? false
                      : true
                  }
                />
                <Text style={styles.label}>Massage</Text>
              </View>

              <View style={styles.Checkboxdetail}>
                <Checkbox
                  status={checkedtheater ? "checked" : "unchecked"}
                  color="red"
                  onPress={() => {
                    [
                      checkedtheater
                        ? removeTheater()
                        : // Checked
                        isServices.includes("Mini Theater")
                        ? // true
                          null
                        : // false
                          isServices.push("Mini Theater"),
                      setCheckedtheater(!checkedtheater),
                    ];
                  }}
                  disabled={
                    checkedtheater === true && isServices.length > 3
                      ? false
                      : checkedtheater === false && isServices.length < 3
                      ? false
                      : isServices.length < 3
                      ? false
                      : checkedtheater === true
                      ? false
                      : true
                  }
                />
                <Text style={styles.label}>Mini Theater</Text>
              </View>

              <View style={styles.Checkboxdetail}>
                <Checkbox
                  status={checkedsauna ? "checked" : "unchecked"}
                  color="red"
                  onPress={() => {
                    [
                      checkedsauna
                        ? removeSauna()
                        : // Checked
                        isServices.includes("Sauna")
                        ? // true
                          null
                        : // false
                          isServices.push("Sauna"),
                      setCheckedSauna(!checkedsauna),
                    ];
                  }}
                  disabled={
                    checkedsauna === true && isServices.length > 3
                      ? false
                      : checkedsauna === false && isServices.length < 3
                      ? false
                      : isServices.length < 3
                      ? false
                      : checkedsauna === true
                      ? false
                      : true
                  }
                />
                <Text style={styles.label}>Sauna</Text>
              </View>

              <View style={styles.Checkboxdetail}>
                <Checkbox
                  status={checkedtherapy ? "checked" : "unchecked"}
                  color="red"
                  onPress={() => {
                    [
                      checkedtherapy
                        ? removeTherapy()
                        : // Checked
                        isServices.includes("Therapy Pool")
                        ? // true
                          null
                        : // false
                          isServices.push("Therapy Pool"),
                      setCheckedTherapy(!checkedtherapy),
                    ];
                  }}
                  disabled={
                    checkedtherapy === true && isServices.length > 3
                      ? false
                      : checkedtherapy === false && isServices.length < 3
                      ? false
                      : isServices.length < 3
                      ? false
                      : checkedtherapy === true
                      ? false
                      : true
                  }
                />
                <Text style={styles.label}>Therapy Pool</Text>
              </View>

              <View style={styles.Checkboxdetail}>
                <Checkbox
                  status={checkedyoga ? "checked" : "unchecked"}
                  color="red"
                  onPress={() => {
                    [
                      checkedyoga
                        ? removeYoga()
                        : // Checked
                        isServices.includes("Yoga")
                        ? // true
                          null
                        : // false
                          isServices.push("Yoga"),
                      setCheckedYoga(!checkedyoga),
                    ];
                  }}
                  disabled={
                    checkedyoga === true && isServices.length > 3
                      ? false
                      : checkedyoga === false && isServices.length < 3
                      ? false
                      : isServices.length < 3
                      ? false
                      : checkedyoga === true
                      ? false
                      : true
                  }
                />
                <Text style={styles.label}>Yoga</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.proceedbutton,
                isServices.length > 0
                  ? { backgroundColor: Colors.main }
                  : { backgroundColor: Colors.disabled },
              ]}
              disabled={isServices.length > 0 ? false : true}
              onPress={() => [setStep(2), setServicesmodalVisible(false)]}
            >
              <Text
                style={[
                  styles.proceedbuttonText,
                  isServices.length > 0
                    ? { color: Colors.TextColor }
                    : { color: Colors.main },
                ]}
              >
                Proceed
              </Text>
            </TouchableOpacity>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.closebutton}
                onPress={() => [setServicesmodalVisible(false)]}
              >
                <Text style={styles.closebuttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Multipurpose  Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={multipurposemodalVisible}
        onRequestClose={() => {
          setMultipurposemodalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.headertitle}>Select a Time</Text>
            <ScrollView horizontal={true}>
              <View style={styles.row}>
                {/* Row1 */}
                {ismphamVisible && (
                  <View style={styles.box} visible={false}>
                    {/* Option1 */}
                    <TouchableOpacity
                      style={styles.touchableOpacity}
                      onPress={() => [
                        setMultipurposemodalVisible(false),
                        setCategory_time("multipurpose_am"),
                      ]}
                    >
                      <Image
                        source={require("../../assets/am.png")}
                        resizeMode="contain"
                        style={styles.image}
                      />
                    </TouchableOpacity>
                    <Text style={styles.timestyle}>8:00am - 11:59am</Text>
                  </View>
                )}
                {ismphpmVisible && (
                  <View style={styles.box}>
                    {/* Option2 */}
                    <TouchableOpacity
                      style={styles.touchableOpacity}
                      onPress={() => [
                        setMultipurposemodalVisible(false),
                        setCategory_time("multipurpose_pm"),
                      ]}
                    >
                      <Image
                        source={require("../../assets/pm.png")}
                        resizeMode="contain"
                        style={styles.image}
                      />
                    </TouchableOpacity>
                    <Text style={styles.timestyle}>1:00pm - 5:00pm</Text>
                  </View>
                )}
                {/* Row2 */}
                {iswholedayVisible && (
                  <View style={styles.box}>
                    <TouchableOpacity
                      style={styles.touchableOpacity}
                      onPress={() => [
                        setMultipurposemodalVisible(false),
                        setCategory_time("multipurpose_wholeday"),
                      ]}
                    >
                      <Image
                        source={require("../../assets/whole_day.png")}
                        resizeMode="contain"
                        style={styles.image}
                      />
                    </TouchableOpacity>
                    <Text style={styles.timestyle}>Whole Day</Text>
                  </View>
                )}
              </View>
            </ScrollView>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.closebutton}
                onPress={() => [setMultipurposemodalVisible(false)]}
              >
                <Text style={styles.closebuttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Dialysis */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={dialysismodalVisible}
        onRequestClose={() => {
          setDialysismodalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.headertitle}>Select a Time</Text>
            <View style={styles.row}>
              {isamVisible && (
                <View style={styles.box}>
                  <TouchableOpacity
                    style={styles.touchableOpacity}
                    onPress={() => [
                      setDialysismodalVisible(false),
                      setCategory_time("dialysis_am"),
                    ]}
                  >
                    <Image
                      source={require("../../assets/am.png")}
                      resizeMode="contain"
                      style={styles.image}
                    />
                  </TouchableOpacity>
                  <Text style={styles.timestyle}>8:00am - 11:59am</Text>
                </View>
              )}
              {ispmVisible && (
                <View style={styles.box}>
                  <TouchableOpacity
                    style={styles.touchableOpacity}
                    onPress={() => [
                      setDialysismodalVisible(false),
                      setCategory_time("dialysis_pm"),
                    ]}
                  >
                    <Image
                      source={require("../../assets/pm.png")}
                      resizeMode="contain"
                      style={styles.image}
                    />
                  </TouchableOpacity>
                  <Text style={styles.timestyle}>1:00pm - 5:00pm</Text>
                </View>
              )}
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.closebutton}
                onPress={() => [setDialysismodalVisible(false)]}
              >
                <Text style={styles.closebuttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Dialysis Requirement*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={reqmodalVisible}
        onRequestClose={() => {
          setReqmodalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.headertitle}>Dialysis Consultation</Text>
            <View style={styles.subheaderReq}>
              <Text style={styles.subheaderReqtext}>
                Requirements for dialysis
              </Text>
              <Text style={styles.subheaderReqdesc}>
                Make sure you have the necessary dialysis requirements to bring
                before clicking the 'proceed.'
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <FlatList
                data={[
                  {
                    key: "Medical Abstract or History",
                  },
                  {
                    key: "Pinakahuling Hepatitis Profile - HBsAg, anti-HCV, anti-HBs(nakuha sa nakaraang tatlong buwan)",
                  },
                  {
                    key: "Pinakahuling Complete Blood Count (CBC)(nakuha sa nakaraang buwan)",
                  },
                  {
                    key: "Pinakahuling resulta ng Creatin, K, Ca, Phosphorus, Albumin(nakuha sa nakaraang buwan)",
                  },
                  {
                    key: "Swab Test Result(nakuha sa nakaraang dalawang linggo)",
                  },
                  {
                    key: "Chest X-ray(nakuha sa nakaraang anim buwan)",
                  },
                  {
                    key: "Kopya ng Treatment Monitoring Sheet/Record (Huling tatlong treatment) mula sa huling dialysis center",
                  },
                  {
                    key: "Voter's Registration/Certificate or any Valid ID",
                  },
                ]}
                renderItem={({ item }) => {
                  return (
                    // <ScrollView>
                    <View style={{ marginBottom: 5 }}>
                      <Text style={styles.reqText}>{`\u2B24${item.key}`}</Text>
                    </View>
                    // </ScrollView>
                  );
                }}
              />
              <View style={styles.footerReq}>
                <TouchableOpacity
                  style={styles.footerReqproceed}
                  onPress={() => isDialysis()}
                >
                  <Text style={styles.closebuttonText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.closebutton}
                onPress={() => [setReqmodalVisible(false)]}
              >
                <Text style={styles.closebuttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MPH Field*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={mphmodalVisible}
        onRequestClose={() => {
          setMphmodalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.headertitle}>Multipurpose Hall</Text>
            <View style={styles.subheaderReq}>
              <Text style={styles.subheaderMphtext}>
                Please complete the required field(s) below
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <TextInput
                style={styles.input}
                placeholder="Booking Purpose *"
                onChangeText={(text) => setPurpose(text)}
              />

              <DropDownPicker
                placeholder="Select Number of Attendees *"
                open={openAttendees}
                items={attendeesOption}
                value={attendees}
                setOpen={setOpenAttendees}
                setValue={setAttendees}
                setItems={setAttendeesOption}
                style={styles.AttendeesPickerButton}
                dropDownContainerStyle={{ width: "73%" }}
              />

              <View style={styles.footerReq}>
                <TouchableOpacity
                  style={styles.footerReqproceed}
                  onPress={() => isMPH()}
                >
                  <Text style={styles.closebuttonText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.closebutton}
                onPress={() => [setMphmodalVisible(false)]}
              >
                <Text style={styles.closebuttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Remidner Modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isReminderVisible}
        onRequestClose={() => {
          setReminderVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              source={require("../../assets/reminder.gif")}
              resizeMode="contain"
              style={styles.imageReminder}
            />
            <Text style={styles.headerRemindertext}>Reminder</Text>
            <Text style={styles.subheaderRemindertext}>
              {"     "}Please cancel your booked schedule if you are unable to
              attend the day before, or else it will be marked as not attended.
              This helps us ensure that other users have the opportunity to book
              that slot.
            </Text>
            <Text style={styles.subheaderRemindertext}>
              {"     "}Please note that if you accumulate 5 not attended, you
              will be restricted from booking for a period of 7 days.
            </Text>
            <TouchableOpacity
              style={styles.closebuttonReminder}
              onPress={() => [
                setReminderVisible(false),
                props.navigation.navigate("Schedules"),
              ]}
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
  buttonConfirm: {
    backgroundColor: Colors.warning,
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
    fontSize: 20,
  },
  message: {
    color: "#4f4f4f",
    fontSize: 16,
  },
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main,
    paddingTop: 40,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start", // if you want to fill rows left to right
  },
  item: {
    width: windowWidth / 2,
  },
  card: {
    backgroundColor: Colors.rose_200,
    margin: 10,
    // borderBottomWidth: 2,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
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
    // left: 0,
    alignSelf: "center",
    marginBottom: 5,
    fontSize: 24,
    fontWeight: "400",
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    backgroundColor: Colors.main,
    borderRadius: 10,
    width: windowWidth / 1.09,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.rose_200,
  },
  centeredViewMph: {
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    elevation: 20,
    borderColor: "#c5c5c5",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.main,
    position: "absolute",
    top: 150,
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
  },
  modalBody: {
    flex: 1,
    // backgroundColor:Colors.red,
    width: "100%",
    alignItems: "center",
  },
  proceedbutton: {
    width: "90%",
    height: 50,
    margin: 10,
    borderWidth: 1,
    borderRadius: 2.5,
    borderColor: Colors.red,
    alignSelf: "center",
    justifyContent: "center",
  },
  proceedbuttonText: {
    color: Colors.TextColor,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "400",
  },
  description: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    margin: 10,
    textAlign: "center",
  },
  subdescription: {
    color: "black",
    fontSize: 14,
    margin: 5,
    textAlign: "center",
  },
  CheckboxContainer: {
    width: "100%",
    padding: 20,
  },
  Checkboxdetail: {
    width: "100%",
    flexDirection: "row",
    // margin: 5,
  },
  label: {
    fontSize: 16,
    marginTop: 6,
  },
  footer: {
    backgroundColor: "#ffbaba80",
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  headertitle: {
    fontSize: 18,
    height: 50,
    width: "100%",
    color: Colors.TextWhite,
    fontWeight: "bold",
    backgroundColor: "#D03043",
    textAlign: "center",
    textAlignVertical: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
  closebuttonReminder: {
    backgroundColor: "#EF3A47",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#ff1717",
    paddingVertical: 10,
    padding: 10,
    width: 70,
    alignSelf: "center",
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
  box: {
    width: windowWidth / 2,
    height: windowheight / 4,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    width: 150,
    height: 120,
  },
  timestyle: {
    color: Colors.TextColor,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  spinnerTextStyle: {
    color: "red",
  },
  reqText: {
    textAlign: "justify",
    fontSize: 15,
    marginHorizontal: 10,
    fontWeight: "300",
  },
  subheaderReq: {
    // width: "95%",
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: Colors.disabled,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: "center",
  },
  subheaderReqtext: {
    textAlign: "center",
    color: Colors.TextColor,
    fontSize: 18,
    fontWeight: "bold",
  },
  subheaderMphtext: {
    textAlign: "center",
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRemindertext: {
    textAlign: "left",
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  subheaderRemindertext: {
    color: "black",
    fontSize: 16,
    margin: 10,
    textAlign: "justify",
  },

  subheaderReqdesc: {
    textAlign: "center",
  },
  footerReq: {
    backgroundColor: "#ffeaea87",
    margin: 10,
  },
  footerReqproceed: {
    backgroundColor: "red",
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  input: {
    width: windowWidth / 1.2,
    backgroundColor: Colors.main,
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingLeft: 10,
  },
  AttendeesPickerButton: {
    fontSize: 18,
    width: windowWidth / 1.2,
    height: 40,
    marginBottom: 20,
    paddingLeft: 20,
    borderColor: "black",
    paddingTop: 5,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  imageReminder: {
    width: "100%",
    height: "50%",
  },
});

export default ServiceProgressSteps;
