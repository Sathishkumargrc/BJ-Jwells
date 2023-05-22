import {
    StyleSheet,
    Dimensions,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Text,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {useSelector} from 'react-redux';
  import Ionicons from 'react-native-vector-icons/Ionicons';
 import { useRoute } from '@react-navigation/native';
  import {colours} from '../../constants';
  import {useNavigation} from '@react-navigation/native';
  import FastImage from 'react-native-fast-image';
  import ImageZoom from 'react-native-image-pan-zoom';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const TestScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const image = useSelector(state => state.user.image);
    const orderImage = useSelector(state => state.user.new_order_image);
    const catalog_image = useSelector(state => state.user.catalog_image);
  console.log('image is', image);
    return (
      <ScrollView style={styles.viewContainer} horizontal={true}>
        <TouchableOpacity
           onPress={() => navigation.goBack({data1:"value1"})}
          style={styles.backIcon}>
          <Ionicons name={'arrow-back'} size={25} color={colours.Black} />
        </TouchableOpacity>
        <>
        
            <View style={styles.viewImage}>
              <ImageZoom
                cropWidth={Dimensions.get('window').width}
                cropHeight={Dimensions.get('window').height}
                imageWidth={400}
                imageHeight={400}>
                <FastImage
                  style={styles.image}
                  source={{
                    uri:orderImage,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </ImageZoom>
            </View>
          
        </>
      </ScrollView>
    );
  };
  
  export default TestScreen;
  
  const styles = StyleSheet.create({
    viewContainer: {
      flex: 1,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    viewImage: {
      width: screenWidth,
      height: screenHeight,
    },
    backIcon: {
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 1,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colours.White,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });