import React from "react";
import { StyleSheet, Dimensions, TextInput } from "react-native";
import Colors from "../Color";

// Dimensions
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function InputModal(props) {
  return (
    <TextInput
      style={styles.input}
      placeholder={props.placeholder}
      name={props.name}
      id={props.id}
      value={props.value}
      spellCheck={false}
      autoCorrect={false}
      onChangeText={props.onChangeText}
      onFocus={props.onFocus}
      secureTextEntry={props.secureTextEntry}
      keyboardType={props.keyboardType}
    ></TextInput>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    width: "73%",
    height: 40,
    marginBottom: 10,
    paddingLeft: 20,
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 10,
    // backgroundColor: "red",
    // alignSelf: "center",
  },
});
export default InputModal;
