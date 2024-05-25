import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native"
import { useTheme, Icon, Text, Divider } from "react-native-paper"

function Route({ danger, time, navigate }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        navigate(time, danger)
      }}
    >
      <View style={styles.horizontal}>
        <Icon source="clock-time-five" size={30} />
        <Text>{time} Minutos</Text>
      </View>

      <View style={styles.horizontal}>
        <Icon source="alert-octagon" size={30} />
        <Text>Calificacion de seguridad: {danger}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function RouteList({ route, navigation }) {
  const theme = useTheme()
  const [routes, setRoutes] = useState([])
  const { origin, destination, address } = route.params

  const navigateToTrip = (time, danger) => {
    navigation.navigate("Trip", {
      origin: origin,
      destination: destination,
      address: address,
      time: time,
      place: null, // ver como obtener place apartir de address
      danger: danger,
    })
  }

  useEffect(() => {
    // const routes = getRoutes(origin, destination) // issue #26
    setRoutes([
      { danger: 2, time: 0 },
      { danger: 1, time: 0 },
      { danger: 0, time: 0 },
    ])
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={routes}
        renderItem={({ index, item }) => {
          return (
            <View>
              <Route
                danger={item.danger}
                time={item.time}
                navigate={navigateToTrip}
                key={index}
              />
              <Divider />
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  horizontal: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  container: {
    paddingVertical: 9,
  },
  item: {
    paddingLeft: 18,
    paddingBottom: 7,
    paddingTop: 7,
  },
})
