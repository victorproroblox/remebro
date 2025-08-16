import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RegisterProductScreen from './screens/RegisterProductScreen';
import MonitorProductScreen from './screens/MonitorProductScreen';
import AlertScreen from './screens/AlertScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Oculta la barra superior
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegisterProduct" component={RegisterProductScreen} />
        <Stack.Screen name="MonitorProduct" component={MonitorProductScreen} />
        <Stack.Screen name="Alert" component={AlertScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}