import React from "react"
import { PaperProvider } from "react-native-paper"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Home from "./Home"
import PlaceDetail from "./PlaceDetail"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="PlaceDetail" component={PlaceDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}
