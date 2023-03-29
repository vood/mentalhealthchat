import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import {AuthProvider} from './src/AuthContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PaymentScreen from './src/screens/PaymentScreen';
import Purchases from 'react-native-purchases';
import {Platform} from 'react-native';
import Config from 'react-native-config';

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Payment: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const revenueCatApiKey = Config.REVENUECAT_API_KEY;

  useEffect(() => {
    Purchases.setDebugLogsEnabled(true);

    console.log(revenueCatApiKey);
    if (Platform.OS === 'android' && revenueCatApiKey) {
      Purchases.configure({
        apiKey: revenueCatApiKey,
      });
    }
  }, [revenueCatApiKey]);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'AI Mental Coach'}}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{title: 'Chat with AI'}}
          />
        </Stack.Navigator>
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{title: 'Subscription'}}
        />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
