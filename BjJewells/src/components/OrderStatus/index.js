import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {colours, FontSize} from '../../constants';
import Paragraph from '../Paragraph';

const OrderStatus = props => {
  if (props.status === 'ACCEPT') {
    return (
      <View style={styles.acceptContainer}>
        <Paragraph style={styles.Text}>{props.status}</Paragraph>
      </View>
    );
  } else if (props.status === 'CUSTOMER DELIVERED') {
    return (
      <View
        style={{
          ...styles.acceptContainer,
          backgroundColor: colours.LightGreen,
        }}>
        <Paragraph style={{...styles.Text, color: colours.Green}}>
          {props.status}
        </Paragraph>
      </View>
    );
  } else if (props.status === 'REJECT') {
    return (
      <View
        style={{...styles.acceptContainer, backgroundColor: colours.LightRose}}>
        <Paragraph style={{...styles.Text, color: colours.Red}}>
          {props.status}
        </Paragraph>
      </View>
    );
  } else if (props.status === 'PENDING') {
    return (
      <View
        style={{...styles.acceptContainer, backgroundColor: colours.LightRose}}>
        <Paragraph style={{...styles.Text, color: colours.Red}}>
          {props.status}
        </Paragraph>
      </View>
    );
  } else if (props.status === 'ASSIGNED') {
    return (
      <View
        style={{...styles.acceptContainer, backgroundColor: colours.LightRose}}>
        <Paragraph style={{...styles.Text, color: colours.Red}}>
          {props.status}
        </Paragraph>
      </View>
    );
  } else if (props.status === 'COMPLETED') {
    return (
      <View
        style={{
          ...styles.acceptContainer,
          backgroundColor: colours.LightGreen,
        }}>
        <Paragraph style={{...styles.Text, color: colours.Green}}>
          {props.status}
        </Paragraph>
      </View>
    );
  } else {
    return (
      <View
        style={{
          ...styles.acceptContainer,
          backgroundColor: colours.Delieverd,
        }}>
        <Paragraph style={{...styles.Text, color: colours.White}}>
          {props.status}
        </Paragraph>
      </View>
    );
  }
};

export default OrderStatus;

const styles = StyleSheet.create({
  acceptContainer: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: colours.LightOrange,
    marginTop: 20,
  },
  Text: {
    fontSize: 12,
    color: colours.Orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
