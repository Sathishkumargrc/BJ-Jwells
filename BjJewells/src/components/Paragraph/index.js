import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colours, FontSize} from '../../constants';

const Paragraph = props => {
  return (
    <Text style={[styles.Text, props.style]} selectable={props.selectable}>
      {props.children}
    </Text>
  );
};

export default Paragraph;

const styles = StyleSheet.create({
  Text: {
    fontSize: FontSize.NormalFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Regular',
  },
});
