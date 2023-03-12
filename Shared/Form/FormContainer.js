import React from 'react';
import { ScrollView, Dimensions, StyleSheet, Text } from 'react-native';
import Colors from '../Color';

var { width } = Dimensions.get('window');

const FormContainer = (props) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            {props.children}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 400,
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        marginBottom:40,
        color:Colors.TextColor,
        fontWeight:'bold'
    }
})

export default FormContainer;