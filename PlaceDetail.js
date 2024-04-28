import React from "react"
import { Text, Button } from "react-native-paper"

export default function PlaceDetail({ navigation }) {
  return (
    <>
      <Text>Pantalla de place detail</Text>
      <Button mode="contained" onPress={() => navigation.navigate("Search")}>
        Ir a búsqueda
      </Button>
    </>
  )
}
