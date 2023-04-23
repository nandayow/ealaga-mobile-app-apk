import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, Alert, View } from "react-native";

import Swipelist from "react-native-swipeable-list-view";
import { useEffect } from "react";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import axios from "axios";
import moment from "moment";
import Colors from "../../Shared/Color";

const Notification = () => {
  const context = useContext(AuthGlobal);
  const [data, setData] = useState();

  useEffect(() => {
    if (
      context.stateUser.isAuthenticated !== false ||
      context.stateUser.isAuthenticated !== null
    ) {
      axios
        .get(`${baseURL}allNotification/${context.stateUser.user.userId}`)
        .then((userData) => setData(userData.data.notification));
    }
  });

  

  return (
    <View>
      <Swipelist
        data={data}
        renderRightItem={(data, index) => (
          <View
            key={index}
            style={[
              styles.container,
              {
                backgroundColor:
                  data.specific_read === true ? Colors.main : Colors.disabled,
              },
            ]}
          >
            <Text style={styles.data}>{data.type}</Text>
            <Text style={styles.time}>
              {moment(data.date).format("hh:mm A")}
            </Text>
          </View>
        )}
        renderHiddenItem={(data, index) => (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[styles.rightAction, { backgroundColor: "#bfbfbf" }]}
              onPress={() => {
                Alert.alert("Edit?", data.type);
              }}
            >
              <Text style={{ height: 25 }}>Show</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rightAction, { backgroundColor: "red" }]}
              onPress={() => {
                Alert.alert("Delete?", data.type);
              }}
            >
              <Text style={{ height: 25 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: 70,
    marginVertical: 3,
    paddingLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  rightAction: {
    width: "100%",
    marginVertical: 3,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    height: 70,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  data: {
    fontSize: 18,
    color: "black",
    fontWeight: "500",
  },
  time: {
    position: "absolute",
    right: 10,
  },
});

export default Notification;
