import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {style, FontSize, colours} from '../../constants';
import Paragraph from '../../components/Paragraph';

const Success = () => {
  const naviagtion = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <Image
        source={require('../../Assets/Image/Success.png')}
        style={styles.image}
      />
      <Paragraph style={styles.mobileText}>Password Changed</Paragraph>
      <Paragraph style={styles.enqText}>
        Your Password has been changed
      </Paragraph>
      <View style={{alignItems: 'center'}}>
        <Paragraph style={styles.succText}>Successfully.</Paragraph>
      </View>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => {
          naviagtion.navigate('Login');
        }}>
        <Paragraph style={styles.btnText}>Continue</Paragraph>
      </TouchableOpacity>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.White,
  },
  mobileText: {
    fontSize: FontSize.LargeFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Medium',
    marginTop: 30,
  },
  enqText: {
    marginTop: 10,
    color: colours.SpanishGray,
  },
  succText: {
    color: colours.SpanishGray,
  },
  bottomButton: {
    position: 'absolute',
    bottom: '0%',
    width: '100%',
    height: 60,
    backgroundColor: colours.ButtonBlueColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,

    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: FontSize.LargeFontsize,
    color: colours.White,
    fontFamily: 'Karla-Bold',
  },
});
