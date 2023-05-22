import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const ImageViews = url => {
  // console.log('url of image', url);
  const navigation = useNavigation();
  return (
    <>
      {url.map(item => (
        <View style={styles.viewContainer}>
          <Image source={item} style={styles.image} />
        </View>
      ))}
    </>
  );
};

export default ImageViews;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
