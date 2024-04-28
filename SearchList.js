import React from "react"
import { Text, Button } from "react-native-paper"

export default function SearchList({ navigation }) {
  return (
    <>
      <Text>Search list</Text>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log("Pressed")}
      >
        Press me
      </Button>
    </>
  )
}
