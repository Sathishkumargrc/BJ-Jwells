import React from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Profile from '../screens/Profileandothers/Profile';
import NewOrders from '../screens/All orders/NewOrders';
import AllOrders from '../screens/All orders/AllOrders';
import LogoutModal from '../screens/Profileandothers/LogoutModal';
import {colours, style} from '../constants';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';

import Dashboard from '../screens/Auth/Dashboard';
import HomeStack from './HomeStack';

export const TabBar = () => {
  const userid = useSelector(state => state.user.user_id);
  const screen_name = useSelector(state => state.user.screen_name);
  console.log('screen_name', screen_name);
  const role = userid.parameters.user_data.role;

  const navigation = useNavigation();
  const _renderIcon = (routeName, selectedTab, index) => {
    let icon = '';

    switch (routeName) {
      case 'Dashboard':
        icon = 'briefcase';
        break;
      case 'Profile':
        icon = 'user';
        break;
      case 'AllOrders1':
        icon = 'wallet';
        break;
      case 'Logout':
        icon = 'power-off';
        break;
    }

    return (
      <FontAwesome5
        key={index}
        name={icon}
        size={25}
        color={
          routeName === selectedTab
            ? colours.ButtonBlueColor
            : colours.tabinactive
        }
      />
    );
  };
  const renderTabBar = ({routeName, selectedTab, navigate, index}) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {_renderIcon(routeName, selectedTab, index)}
        {/* <Text>{routeName}</Text> */}
      </TouchableOpacity>
    );
  };
  const screenName = {
    '': '',
    Dashboard: 'Dashboard',
    Profile: 'Profile',
    AllOrders1: 'All Orders',
    Logout: 'Logout',
  };
  console.log('screen_name of cod', screenName[screen_name]);
  return (
    <View style={{flex: 1}}>
      <CurvedBottomBar.Navigator
        height={screenName[screen_name] ? 60 : 0}
        initialRouteName="Dashborad"
        bgColor="#fff"
        tabBar={renderTabBar}
        type="down"
        strokeWidth={2}
        renderCircle={() => {
          return (
            <View>
              {role === 'CUSTOMER' ? (
                <TouchableOpacity
                  style={
                    screenName[screen_name]
                      ? styles.circleIcon
                      : styles.circleIcon1
                  }
                  onPress={() => {
                    navigation.navigate('NewOrders',{data2:"value2"});
                  }}>
                  <FontAwesome5
                    name="plus-square"
                    size={20}
                    color={colours.White}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={
                    screenName[screen_name]
                      ? styles.circleIcon
                      : styles.circleIcon1
                  }
                  onPress={() => {
                    navigation.navigate('NewOrderslist');
                  }}>
                  <FontAwesome5
                    name="cart-arrow-down"
                    size={20}
                    color={colours.White}
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        }}>
        <CurvedBottomBar.Screen
          name="Dashboard"
          component={HomeStack}
          position="left"
        />
        <CurvedBottomBar.Screen
          name="AllOrders1"
          component={AllOrders}
          position="left"
        />

        <CurvedBottomBar.Screen
          name="Profile"
          component={Profile}
          position="right"
        />
        <CurvedBottomBar.Screen
          name="Logout"
          // component={({navigate}) => navigate('Logout')}
          component={LogoutModal}
          position="right"
        />
      </CurvedBottomBar.Navigator>
    </View>
  );
};

export const styles = StyleSheet.create({
  circleIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.ButtonBlueColor,
    width: 50,
    height: 50,
    borderRadius: 50,
    transform: [{translateY: -20}],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  circleIcon1: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.ButtonBlueColor,
    width: 50,
    height: 50,
    borderRadius: 50,
    transform: [{translateY: -0}],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
