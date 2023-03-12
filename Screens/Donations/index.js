import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native';
 
// Shared
import Header from '../../Shared/Header';
import DonationCard from './DonationCard';
import Colors from '../../Shared/Color';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { StatusBar } from 'react-native';
   

// Dimensions
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

 
const DonationsContainer = (props) => {
  return (

    <SafeAreaProvider style ={styles.homecontainer}>
      <Header navigation={props.navigation} />
      <Text style={styles.title}>My Donation</Text>
      <View style={styles.container}>
        <DonationCard navigation={props.navigation} />
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  homecontainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor:Colors.main
  },
  container:{
      height:windowHeight,
      width:windowWidth,
      backgroundColor: Colors.main,
      borderBottomWidth:200,
      borderBottomColor: Colors.main,
      
   },
  title:{
    fontSize: 30,
    color:Colors.TextColor,
    fontWeight:'bold',
    textAlign:"center",
    height:100,
    textAlignVertical:"center",
    backgroundColor:Colors.main
  },

    refreshColor:
    {
      tintColor:Colors.red,
      backgroundColor:"green"

    }, 
 
});

export default DonationsContainer