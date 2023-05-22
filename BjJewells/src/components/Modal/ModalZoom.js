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
  import ImageZoom from 'react-native-image-pan-zoom';
  import Paragraph from '../Paragraph';
  import {colours, FontSize, style} from '../../constants';


  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
const ModalZoom = props => {
    const photo = "https://sriibjjewels.in/admin/web/images/product/20221010151009_6304620220902170913_2264422076627.jpeg"
  return (
   
    <Modal
    isVisible={props.showable}
    onBackdropPress={props.onBackdropPress1}
    onBackButtonPress={props.onBackButtonPress1}>
         <View
        style={{
          width: screenWidth * 0.87,
          height: screenHeight * 0.6,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
        }}>
            <ImageZoom
                cropWidth={screenWidth * 0.87}
                cropHeight={screenHeight * 0.6}
                imageWidth={300}
                       imageHeight={300}
               >
                <FastImage
                    style={styles.image}
                  source={{
                    uri:props.JewellPhoto,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </ImageZoom>



        </View>
        </Modal>


)
}

export default ModalZoom

const styles = StyleSheet.create({
    image: {
        width: 300,
        height:300,
        marginTop: 10,
       
      },
})
