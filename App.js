import React from "react"
import { PaperProvider } from "react-native-paper"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Home from "./Home"
import Report from "./Report"
import Trip from "./Trip"
import RouteList from "./RouteList"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Report"
            component={Report}
            options={{ title: "Reportes" }}
          />
          <Stack.Screen
            name="Trip"
            component={Trip}
            options={{ title: "Viaje" }}
          />
          <Stack.Screen
            name="RouteList"
            component={RouteList}
            options={{ title: "Lista de rutas" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}
