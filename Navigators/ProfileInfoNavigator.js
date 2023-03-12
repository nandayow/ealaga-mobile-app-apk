import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Colors from "../Shared/Color";
// Screens
import Personal from "../Screens/User/Profile/Personal";
import Health from "../Screens/User/Profile/Health";
import Credentials from "../Screens/User/Profile/Credentials";
const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Personal"
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: "red" },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
        tabBarStyle: { backgroundColor: Colors.rose_200 },
        tabBarActiveTintColor: Colors.TextColor,
        tabBarInactiveTintColor: Colors.gray,
        tabBarPressColor: Colors.main, 
        swipeEnabled:false, 
      }}
    >
      <Tab.Screen name="Personal" component={Personal} screenOptions />
      <Tab.Screen name="Health" component={Health} />
      <Tab.Screen name="Credentials" component={Credentials} />
    </Tab.Navigator>
  );
}

export default function ProfileInfoNavigator() {
  return <MyTabs />;
}
