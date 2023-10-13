import React from 'react';
import {Dimensions, Text} from 'react-native';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import textStyle from '../../../constant/text_style';
import {theme} from '../../../global/styles';

interface ItemStopWatchProps {
  dataSource: string[];
  selectedIndex: number;
  onValueChange: (data: string) => void;
}

const {height} = Dimensions.get('window'); // Lấy kích thước của màn hình

const ItemStopWatch: React.FC<ItemStopWatchProps> = ({
  dataSource,
  selectedIndex,
  onValueChange,
}) => {
  return (
    <ScrollPicker
      dataSource={dataSource}
      selectedIndex={selectedIndex}
      renderItem={data => {
        return <Text style={textStyle.pt32}>{data}</Text>;
      }}
      wrapperBackground="#ffffff"
      onValueChange={onValueChange} // Chuyển sự kiện onValueChange từ props
      wrapperHeight={height * 0.5}
      itemHeight={height * 0.5 * 0.2} // Xác định chiều cao của mỗi mục dựa trên nhu cầu
      highlightColor={theme.colors.gray800}
      highlightBorderWidth={1}
    />
  );
};

export default ItemStopWatch;
