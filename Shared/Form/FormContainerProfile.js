import React from 'react';
import { ScrollView, Dimensions, StyleSheet, Text } from 'react-native';
import Colors from '../Color';


var { width } = Dimensions.get('window');

function FormContainerProfile(props) {
   
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            {props.children}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {  
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        marginBottom:20,
        color:Colors.gray,
        fontWeight:'400'
    }
})

export default FormContainerProfile