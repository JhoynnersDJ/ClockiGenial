import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from "./src/Navigation";
import AuthProvider from "./src/controladores/AuthProvider";
import ActuProvider from "./src/controladores/ActuProvider";
import ActuTimeProvider from "./src/controladores/ActuProviderTime";

export default function App() {
  return (
    <AuthProvider>
      <ActuProvider>
        <ActuTimeProvider>
        <Navigation/>
        </ActuTimeProvider>
      </ActuProvider>
    </AuthProvider>
  );
}
