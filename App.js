import React from "react";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox, StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
// Redux
import { Provider } from "react-redux";
import store from "./Redux/store";

// Context API
import Auth from "./Context/store/Auth";
import MainNavigator from "./Navigators/MainNavigator";
import Colors from "./Shared/Color"; 

// Navigators

LogBox.ignoreAllLogs(true);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
 
  // Eg. schedule the notification
  Notifications.scheduleNotificationAsync({
    content: {
      title: "eAlaga Reminders!!!",
      body: "Kndly Check your Schedule",
      sound: require("./assets/notif.wav"),
    },
    trigger: {
      seconds: 2,
      channelId: "new-emails", // <- for Android 8.0+, see definition above
    },
    android: {
      icon: require("./assets/notificon.png"),
      channelId: "default", // Required for Android 8+
      sound: true,
      vibrate: true,
    },
  });


  return (
    <Auth>
      <Provider store={store}>
        <NativeBaseProvider>
          <StatusBar
            backgroundColor={Colors.main}
            barStyle="dark-content"
            translucent={false}
            hidden={false}
          />
          <NavigationContainer>
            <MainNavigator />
            <Toast />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    </Auth>
  );
}
