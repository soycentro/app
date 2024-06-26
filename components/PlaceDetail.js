import React from "react"
import { Text, View, StyleSheet } from "react-native"
import { Button, Icon, IconButton } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"

function TripDetail({ address, time, place = false }) {
  return (
    <View style={styles.tripContainer}>
      <View style={styles.addressContainer}>
        {place ? (
          <View>
            {/* Falta hacer que funcione con place: issue #14 */}
            <Text style={styles.primary}>Lugar</Text>
            <Text style={styles.secondary}>
              {`${address.thoroughfare} #${address.subThoroughfare}`}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.primary}>
              {`${address.thoroughfare} #${address.subThoroughfare}`}
            </Text>
            <Text style={styles.secondary}>
              {`${address.administrativeArea}, ${address.country}`}
            </Text>
          </View>
        )}
      </View>
      <View style={{ ...styles.timeContainer, marginLeft: 30 }}>
        <Icon source="clock-time-five" size={30} />
        <Text style={styles.secondary}>{time} Min</Text>
      </View>
    </View>
  )
}

function NoTripDetail({ address, time, origin, destination, place = false }) {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        {place ? (
          <View>
            {/* Falta hacer que funcione con place: issue #14 */}
            <Text style={styles.primary}>Lugar</Text>
            <Text style={styles.secondary}>
              {`${address.thoroughfare} #${address.subThoroughfare}`}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.primary}>
              {`${address.thoroughfare} #${address.subThoroughfare}`}
            </Text>
            <Text style={styles.secondary}>
              {`${address.administrativeArea}, ${address.country}`}
            </Text>
          </View>
        )}
        <IconButton icon={"alert"} size={30} mode="contained" />
      </View>
      <View style={styles.timeContainer}>
        <Icon source="walk" size={30} />
        <Text style={styles.secondary}>{time} Minutos</Text>
      </View>
      <Button
        mode="contained"
        onPress={() =>
          navigation.navigate("RouteList", {
            origin: origin,
            destination: destination,
            address: address,
          })
        }
      >
        Ver rutas
      </Button>
    </View>
  )
}

export default function PlaceDetail({
  origin,
  destination,
  address,
  time,
  place = false,
  trip = false,
}) {
  return trip ? (
    <TripDetail address={address} time={time} place={place} />
  ) : (
    <NoTripDetail
      address={address}
      origin={origin}
      destination={destination}
      time={time}
      place={place}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    bottom: 0,
    padding: 18,
  },
  tripContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    bottom: 0,
    padding: 18,
  },
  primary: {
    fontWeight: "bold",
    fontSize: 20,
  },
  secondary: {
    fontSize: 18,
  },
  addressContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  timeContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
})
