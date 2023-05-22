import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import Login from '../screens/Auth/Login';
import Enquire from '../screens/Auth/Enquire';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ChangePassword from '../screens/Auth/ChangePassword';
import Success from '../screens/Auth/Success';
import TabNavigation from './TabNavigation';
import HomeStack from './HomeStack';
import {TabBar} from './TabNavigation';
import RecentDeliveredOrders from '../screens/All orders/recentDeliveredOrders';

const AuthStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Enquire" component={Enquire} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="Dashboard" component={TabBar} />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
