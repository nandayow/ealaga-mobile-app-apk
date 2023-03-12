import React from "react";
import { TextInput, StyleSheet } from "react-native";
import Colors from "../Color";

const Input = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={props.placeholder}
      name={props.name}
      id={props.id}
      value={props.value}
      // autoCorrect={props.autoCorrect}
      heck={false}
      autoCorrect={false}
      onChangeText={props.onChangeText}
      onFocus={props.onFocus}
      secureTextEntry={props.secureTextEntry}
      keyboardType={props.keyboardType}
    ></TextInput>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "80%",
    height: 40,
    backgroundColor: "white",
    margin: 2,
    paddingLeft: 13,
    borderBottomWidth: 2,
    borderColor: Colors.underline,
    fontSize:16,
     fontFamily:   "sans-serif",
    // , verdana, arial, sans-serif;
  },
  
});

export default Input;
