import React from 'react'
 import { SafeAreaProvider } from 'react-native-safe-area-context';
 

// Shared
import Header from '../../Shared/Header';
import Colors from '../../Shared/Color';
 import ServiceProgressSteps from './ServiceProgressSteps';
import { Platform } from 'react-native';
import { StatusBar } from 'react-native';
import { StyleSheet } from 'react-native';
 
function ServicesContainer(props) {

 
  return (
    <SafeAreaProvider style={styles.container}>
        <Header navigation={props.navigation}/>  
        <ServiceProgressSteps  navigation={props.navigation}/>
     </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor:Colors.main
  },
 
  
});

export default ServicesContainer