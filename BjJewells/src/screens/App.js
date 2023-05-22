import {StyleSheet, LogBox, Platform, Alert, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import store from '../redux/Store';
import RNBootSplash from 'react-native-bootsplash';
import RootNavigation from '../navigation/RootNavigation';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';

const App = () => {
  const [isConnected, setisConnected] = useState();
  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  ]);
  LogBox.ignoreLogs(['new NativeEventEmitter']);
  LogBox.ignoreAllLogs();
  useEffect(() => {
    RNBootSplash.hide({duration: 250});
    netInfo();
  }, []);
  const netInfo = () => {
    NetInfo.fetch()
      .then(state => {
        console.log(state.isConnected);
        if (state.isConnected) {
          setisConnected(true);
        } else {
          Toast.show('Please check your internet connection');
          setisConnected(false);
        }
      })
      .catch(err => {
        console.log('netinfo', err);
      });
  };
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
};

export default App;
