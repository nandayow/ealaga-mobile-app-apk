import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//  Screens
import VisitorViewContainer from "../Screens/Visitors/Index";
import LoginContainer from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import ForgotPassword from "../Screens/User/ForgotPassword";

const Stack = createStackNavigator();

function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Visitor"
        component={VisitorViewContainer}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginContainer}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return <UserStack />;
}
