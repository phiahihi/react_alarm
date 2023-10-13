import Slider from '@react-native-community/slider';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import textStyle from '../constant/text_style';
import TabBarIcon from './tab_bar_icon';
import {IconAlarm} from '../../assets/icons';

interface TitleWithSliderProps {
  valueVolume: number;
  onValueChange: (value: number) => void;
  theme: any;
  minValue: number;
  maxValue: number;
  title: string;
}

const TitleWithSlider: React.FC<TitleWithSliderProps> = ({
  valueVolume,
  onValueChange,
  theme,
  minValue,
  maxValue,
  title,
}) => {
  return (
    <View>
      <Text style={styles.alarmText}>{title}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TabBarIcon iconComponent={IconAlarm} size={18} color="blue" />
        <Slider
          style={{width: '100%', height: 40}}
          minimumValue={minValue}
          maximumValue={maxValue}
          value={valueVolume}
          onSlidingComplete={onValueChange}
          thumbTintColor={theme.colors.primary}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alarmText: {
    ...textStyle.pt14,
    color: '#4D8AF0',
  },
});

export default TitleWithSlider;
