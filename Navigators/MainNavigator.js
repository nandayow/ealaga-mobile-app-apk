import React, { useContext } from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Stacks
import UserNavigator from "./UserNavigator";
import HomeNavigator from "./HomeNavigator";
import ProfileNavigator from "./ProfileNavigator";

// Auth
import AuthGlobal from "../Context/store/AuthGlobal";
import AboutContainer from "../Screens/About/Index"; 
const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const context = useContext(AuthGlobal);

  return (
    <Tab.Navigator
      initialRouteName="Home" 
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      }}
    >
      {context.stateUser.isAuthenticated === true ? (
        <Tab.Screen
          name="About"
          component={AboutContainer}
          options={{
            headerShown: false, 
            tabBarIcon: ({ color }) => (
              <Icon name="info" color={color} size={30} />
            ),
          }}
        />
      ) : null}
      {context.stateUser.isAuthenticated === true ? (
        <Tab.Screen
          name="Home"
          component={HomeNavigator} 
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={30} />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Guest"
          component={UserNavigator}
          options={{
            headerShown: false,
            tabBarVisible: false,
            tabBarButton: () => null,
            tabBarStyle: { display: "none" },
          }}
        />
      )}

      {context.stateUser.isAuthenticated === true ? (
        <Tab.Screen
          name="User"
          component={ProfileNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon name="user" color={color} size={30} />
            ),
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
};

export default MainNavigator;
