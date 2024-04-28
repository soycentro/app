import React from "react"
import MapView from "react-native-maps"
import { StyleSheet, View, Dimensions } from "react-native"
import Constants from "expo-constants"

import InputAutocomplete from "./InputAutocomplete"

const { width, height } = Dimensions.get("window")

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.03
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const INITIAL_POSITION = {
  latitude: 4.600664,
  longitude: -74.072985,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={INITIAL_POSITION} />
      <View style={styles.searchContainer}>
        <InputAutocomplete
          label=""
          placeholder="Buscar"
          onPlaceSelected={() => {}}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
})
