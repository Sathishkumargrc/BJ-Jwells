import {
  StyleSheet,
  FlatList,
  Dimensions,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colours} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ViewImage = () => {
  const navigation = useNavigation();
  const image = useSelector(state => state.user.image);
  const catalog_image = useSelector(state => state.user.catalog_image);
  console.log('url od imae', catalog_image);
  return (
    <ScrollView style={styles.viewContainer} horizontal={true}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backIcon}>
        <Ionicons name={'arrow-back'} size={25} color={colours.Black} />
      </TouchableOpacity>
      <>
        {catalog_image.length > 0 ? (
          <View style={styles.viewImage}>
            <ImageZoom
              // cropWidth={Dimensions.get('window').width}
              // cropHeight={Dimensions.get('window').height}
              // imageWidth={400}
              // imageHeight={400}
              cropWidth={screenWidth }
              cropHeight={screenHeight }
              imageWidth={300}
              imageHeight={300}>
              <FastImage
                style={styles.image}
                source={{
                  uri: catalog_image,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </ImageZoom>
          </View>
        ) : (
          <>
            <FlatList
              //  showsVerticalScrollIndicator={false}
              horizontal={true}
              data={image}
              renderItem={({item}) => (
                // <View key={index} style={styles.viewImage}>
                <View style={styles.viewImage}>
                  <ImageZoom
                    // cropWidth={Dimensions.get('window').width}
                    // cropHeight={Dimensions.get('window').height}
                    // imageWidth={400}
                    // imageHeight={400}
                    cropWidth={screenWidth}
                    cropHeight={screenHeight}
                    imageWidth={300}
                    imageHeight={300}>
                    <FastImage
                      style={styles.image}
                      source={{
                        uri: item,
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                  </ImageZoom>
                </View>
              )}
            />
          </>
        )}
      </>
    </ScrollView>
  );
};

{
  /* {image.map((item, index) => {
              console.log('item', item);
              return (
                <View key={index} style={styles.viewImage}>
                  <ImageZoom
                    // cropWidth={Dimensions.get('window').width}
                    // cropHeight={Dimensions.get('window').height}
                    // imageWidth={400}
                    // imageHeight={400}
                    cropWidth={screenWidth}
              cropHeight={screenHeight}
              imageWidth={400}
                     imageHeight={400}
                    >
                    <FastImage
                      style={styles.image}
                      source={{
                        uri: item,
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                  </ImageZoom>
                </View>
              );
            })} */
}
{
  /* </>
        )} */
}

export default ViewImage;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderWidth: 1,
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
