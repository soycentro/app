import { Text, StyleSheet } from "react-native"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { GOOGLE_API_KEY } from "../environment"
navigator.geolocation = require("react-native-geolocation-service")

export default function InputAutocomplete({
  label,
  placeholder,
  onPlaceSelected,
}) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details)
        }}
        enablePoweredByContainer={false}
        query={{
          key: GOOGLE_API_KEY,
          language: "es",
          components: "country:col",
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
})
