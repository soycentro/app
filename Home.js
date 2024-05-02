import React, { useState, useEffect, useRef } from "react"
import MapView, { Marker } from "react-native-maps"
import Constants from "expo-constants"
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native"
import { IconButton, useTheme, Text } from "react-native-paper"
import * as Location from "expo-location"

import InputAutocomplete from "./InputAutocomplete"
import PlaceDetail from "./PlaceDetail"

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
  const theme = useTheme()
  const [location, setLocation] = useState(null)
  const [showsUserLocation, setShowsUserLocation] = useState(false)
  const [marker, setMarker] = useState(null)
  const mapRef = useRef(null)

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        return
      }

      const newLocation = await Location.getCurrentPositionAsync()
      setLocation(newLocation)
      mapRef.current.animateToRegion({
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      })
    }

    getPermissions()
    setShowsUserLocation(true)
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_POSITION}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        showsCompass={false}
        onPress={() => {
          setMarker(null)
        }}
        onLongPress={async e => {
          const latlng = e.nativeEvent.coordinate
          const address = await mapRef.current.addressForCoordinate(latlng)

          setMarker({ latlng, address })
        }}
      >
        {marker ? <Marker coordinate={marker.latlng} /> : null}
      </MapView>
      {marker ? <PlaceDetail address={marker.address} place={null} /> : null}

      <View style={styles.searchContainer}>
        <InputAutocomplete
          label=""
          placeholder="Buscar"
          onPlaceSelected={() => {}}
        />
      </View>

      <View style={{ ...styles.buttonsContainer, bottom: marker ? 180 : 0 }}>
        <IconButton
          icon={"map-marker-radius"}
          size={50}
          mode="contained-tonal"
          iconColor={theme.colors.secondary}
          containerColor={theme.colors.secondaryContainer}
          onPress={async () => {
            const newLocation = await Location.getCurrentPositionAsync()
            setLocation(newLocation)
            mapRef.current.animateToRegion({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            })
          }}
        />
        <IconButton
          icon={"alert-octagon"}
          size={50}
          mode="contained"
          iconColor={theme.colors.error}
          containerColor={theme.colors.errorContainer}
          onPress={() => navigation.navigate("Report", { incidentId: "01" })}
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
  buttonsContainer: {
    position: "absolute",
    padding: 12,
    right: 0,
  },
})
