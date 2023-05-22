import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import Paragraph from '../Paragraph';
import {colours, FontSize, style} from '../../constants';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ModalComponenet = props => {
  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onBackdropPress}
      onBackButtonPress={props.onBackButtonPress}>
      <View
        style={{
          width: screenWidth * 0.87,
          height: screenHeight * 0.6,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={props.data ? props.data : []}
          renderItem={({item, index}) => (
            <View style={styles.categoryContainer}>
              <Paragraph style={styles.categoryName}>
                {item.category_name}
              </Paragraph>

              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={styles.imageContainer}
                data={item.categoryImages}
                nestedScrollEnabled={true}
                renderItem={it => (
                  console.log('item....', it.item),
                  (
                    <TouchableOpacity
                      key={index}
                      style={styles.scrollContainer}
                      onPress={() => {
                        console.log('image....', item);
                        props.onImagePress(it.item);
                        props.onPress(item, index);
                      }}>
                      <FastImage
                        style={styles.image}
                        source={{
                          uri: it.item.image_url,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </TouchableOpacity>
                  )
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
          keyExtractor={item => item.category_id}
        />
      </View>
    </Modal>
  );
};

export default ModalComponenet;

const styles = StyleSheet.create({
  font: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    borderWidth: 1,
  },
  categoryContainer: {
    width: screenWidth * 0.87,
    height: screenHeight * 0.4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 300,
    marginTop: 10,
  },
  categoryName: {
    fontSize: FontSize.LargeFontsize,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 10,
    width: screenWidth * 0.87,
    height: screenHeight * 0.4,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    width: 220,
    marginLeft: 10,
  },
});
