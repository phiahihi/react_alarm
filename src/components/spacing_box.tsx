import React from 'react';
import {View, ViewStyle} from 'react-native';

interface SpacingBoxProps {
  height?: number;
  width?: number;
  style?: ViewStyle;
}

const SpacingBox: React.FC<SpacingBoxProps> = ({height, width, style}) => {
  return (
    <View
      style={[
        {
          height: height || 0,
          width: width || 0,
          backgroundColor: 'transparent', // Màu nền trong suốt
        },
        style, // Merge các style từ prop vào style của View
      ]}
    />
  );
};

export default SpacingBox;
