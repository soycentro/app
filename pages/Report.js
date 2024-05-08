import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { useTheme, Text, TextInput, Button } from "react-native-paper"

const incidentsInfo = {
  "01": {
    title: "robo",
    description: "Si has presenciado un robo bla bla bla",
  },
  // AQUI VAN LOS OTROS INCIDENTES
}

export default function Report({ route, navigation }) {
  const { incidentId } = route.params
  const { title, description } = incidentsInfo[incidentId]
  const [coment, setComent] = useState("")
  const [address, setAddres] = useState("")
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Reportar {title}
      </Text>
      <Text variant="bodyLarge" style={styles.description}>
        {description}
      </Text>

      <Text variant="titleMedium">Lugar del incidente</Text>
      <TextInput
        label="Dirección"
        mode="outlined"
        value={address}
        style={styles.input}
        onChangeText={address => {
          setAddres(address)
        }}
      />

      <Text variant="titleMedium">Comentario</Text>
      <TextInput
        multiline
        label="Comentario"
        mode="outlined"
        numberOfLines={3}
        value={coment}
        style={styles.input}
        onChangeText={coment => {
          setComent(coment)
        }}
      />

      <View style={styles.button}>
        <Button mode="contained" onPress={() => console.log("Pressed")}>
          Reportar
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    marginBottom: 20,
  },
})
