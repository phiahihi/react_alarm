import React from 'react';
import {View, Text, Switch, StyleSheet, TouchableHighlight} from 'react-native';
import textStyle from '../constant/text_style';

type ItemAppProps = {
  titleAlarmText: string;
  alarmText?: string;
  isSwitch?: boolean;
  isSleepModeEnabled?: boolean;
  onPressContainer?: (() => void) | undefined;
  onToggleSwitch?:
    | ((value: boolean) => void | Promise<void>)
    | null
    | undefined;
  onValueChange?: ((value: number) => void) | undefined;
  valueVolume?: number;
};

const ItemApp: React.FC<ItemAppProps> = ({
  titleAlarmText,
  alarmText,
  isSwitch,
  isSleepModeEnabled,
  onToggleSwitch,
  onPressContainer,
}) => {
  return (
    <TouchableHighlight
      activeOpacity={1}
      underlayColor="transparent"
      onPress={onPressContainer}>
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>{titleAlarmText}</Text>
          <View style={styles.switchContainer}>
            {onToggleSwitch && (
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={
                  isSleepModeEnabled ?? isSwitch ? '#f5dd4b' : '#f4f3f4'
                }
                ios_backgroundColor="#3e3e3e"
                onValueChange={onToggleSwitch}
                value={isSleepModeEnabled ?? isSwitch}
              />
            )}
          </View>
        </View>

        {alarmText && <Text style={styles.alarmText}>{alarmText}</Text>}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  label: {
    ...textStyle.pt16,
  },
  alarmText: {
    ...textStyle.pt14,
    color: '#4D8AF0',
  },
  switchContainer: {
    alignItems: 'flex-end', // Đặt cách căn lề phải
  },
});

export default ItemApp;
