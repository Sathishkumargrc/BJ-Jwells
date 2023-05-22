import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const DropDown = props => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState();
  return (
    <View>
      <DropDownPicker
        key={Math.random()}
        open={props.open}
        value={value}
        items={items.map((item, index) => ({
          label: item.category_name,
          value: item.category_id,
          key: index,
        }))}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        mode="BADGE"
        containerStyle={{height: 50, width: screenWidth * 0.8}}
      />
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({});
