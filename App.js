import React from "react"
import { MD3DarkTheme as DefaultTheme, PaperProvider } from "react-native-paper"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Home from "./Home"
import PlaceDetail from "./PlaceDetail"

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
}

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="PlaceDetail" component={PlaceDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}
