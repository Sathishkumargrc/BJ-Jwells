import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

// import {Profileandothers} from './DrawerNavigation';
import Contact from '../screens/Profileandothers/Contact';
import About from '../screens/Profileandothers/About';
import Payment from '../screens/Profileandothers/Payment';
import AllOrders from '../screens/All orders/AllOrders';
import Notification from '../screens/Profileandothers/Notification';
import NewOrders from '../screens/All orders/NewOrders';
import PendingOrders from '../screens/All orders/PendingOrders';
import CompleteOrders from '../screens/All orders/CompletedOrders';
import OrderDetails from '../screens/All orders/OrderStatus';
import ReapeatOrders from '../screens/All orders/RepeatOrders';
import EditOrders from '../screens/All orders/EditOrders';
import {TabBar} from './TabNavigation';
import NewOrderslist from '../screens/All orders/NewOrderslist';
import Filter from '../screens/Profileandothers/Filter';
import UpdateOrder from '../screens/All orders/UpdateOrder';
import LogoutModal from '../screens/Profileandothers/LogoutModal';
import Image from '../screens/All orders/Image';
import Dashboard from '../screens/Auth/Dashboard';
import TestScreen from '../screens/All orders/TestScreen';
import ModalZoom from '../components/Modal/ModalZoom';
import RecentDeliveredOrders from '../screens/All orders/recentDeliveredOrders';

const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Contact" component={Contact} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="AllOrders" component={AllOrders} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="NewOrders" component={NewOrders} />
      <Stack.Screen name="PendingOrders" component={PendingOrders} />
      <Stack.Screen name="CompleteOrders" component={CompleteOrders} />
      <Stack.Screen name="OrderStatus" component={OrderDetails} />
      <Stack.Screen name="RecentDelivered" component={RecentDeliveredOrders} />
      <Stack.Screen name="RepeatOrders" component={ReapeatOrders} />
      <Stack.Screen name="EditOrders" component={EditOrders} />
      <Stack.Screen name="NewOrderslist" component={NewOrderslist} />
      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="UpdateOrder" component={UpdateOrder} />
      <Stack.Screen name="LogoutModal" component={LogoutModal} />
      <Stack.Screen name="Image" component={Image} />
      <Stack.Screen name="TestScreen" component={TestScreen} />
      <Stack.Screen name="ModalZoom" component={ModalZoom} />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
