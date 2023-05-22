import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import {Profileandothers} from './DrawerNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {setScreenName} from '../redux/Slice/user';
import {setUser} from '../redux/Slice/user';

const RootNavigation = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('@user_id');
      const userObj = JSON.parse(user);
      dispatch(setUser(userObj));
    } catch (error) {
      console.log(error);
    }
  };

  console.log(
    'user',
    useSelector(state => state.user.user_id),
  );
  const navRef = createNavigationContainerRef();
  return (
    <NavigationContainer
      independent={true}
      ref={navRef}
      onStateChange={state => {
        if (navRef.isReady()) {
          dispatch(setScreenName(navRef.getCurrentRoute()?.name));
          console.log('nav Ref', navRef.getCurrentRoute());
        }
      }}>
      {useSelector(state => state.user.user_id) ? (
        <Profileandothers />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default RootNavigation;

const styles = StyleSheet.create({});
