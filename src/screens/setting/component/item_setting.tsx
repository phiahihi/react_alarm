import {View, Text, StyleSheet} from 'react-native';
import React, {ReactNode} from 'react';
import textStyle from '../../../constant/text_style';

interface ItemSettingProps {
  children: ReactNode;
  title: string;
}

const ItemSetting: React.FC<ItemSettingProps> = ({children, title}) => {
  return (
    <View
      style={{
        width: '100%',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'blue',
      }}>
      <Text style={styles.titleText}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    ...textStyle.pt14,
    color: '#4D8AF0',
  },
});
export default ItemSetting;
