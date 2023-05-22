import {Dimensions} from 'react-native';
import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

import Dashboard from '../screens/Auth/Dashboard';
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

import {DrawerContent} from '../components/DeawerContent';

const screenWidth = Dimensions.get('window').width;

export const Profileandothers = () => {
  const drawer = createDrawerNavigator();
  return (
    <drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        tabBarVisible: false,
        headerShown: false,
        drawerStyle: {
          width: screenWidth * 0.8,
        },
      }}>
      <drawer.Screen name="Home" component={TabBar} />
      <drawer.Screen name="Contact" component={Contact} />
      <drawer.Screen name="About" component={About} />
      <drawer.Screen name="Payment" component={Payment} />
      <drawer.Screen name="AllOrders" component={AllOrders} />
      <drawer.Screen name="Notification" component={Notification} />
      <drawer.Screen name="NewOrders" component={NewOrders} />
      <drawer.Screen name="PendingOrders" component={PendingOrders} />
      <drawer.Screen name="CompleteOrders" component={CompleteOrders} />
      <drawer.Screen name="OrderStatus" component={OrderDetails} />
      <drawer.Screen name="RepeatOrders" component={ReapeatOrders} />
      <drawer.Screen name="EditOrders" component={EditOrders} />
      <drawer.Screen name="NewOrderslist" component={NewOrderslist} />
      <drawer.Screen name="Filter" component={Filter} />
      <drawer.Screen name="UpdateOrder" component={UpdateOrder} />
      <drawer.Screen name="Logout" component={LogoutModal} />
      <drawer.Screen name="Image" component={Image} />
    </drawer.Navigator>
  );
};
