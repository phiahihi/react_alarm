import React, {FC} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {IconBack} from '../../assets/icons';
import CircleIconButton from './circle_icon_button';

interface AppBarProps {
  onBackPress: () => void;
  onDonePress?: () => void;
  doneText?: string;
  title?: string;
}

const AppBarWithIconAndText: FC<AppBarProps> = ({
  onBackPress,
  onDonePress,
  doneText,
  title,
}) => {
  return (
    <View
      style={{
        ...styles.appBar,
        justifyContent: title ? 'flex-start' : 'space-between',
      }}>
      <CircleIconButton onPress={onBackPress} iconComponent={IconBack} />
      {doneText && (
        <TouchableOpacity onPress={onDonePress}>
          <Text style={styles.doneText}>{doneText}</Text>
        </TouchableOpacity>
      )}
      {!doneText && <Text style={styles.titleText}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  doneText: {
    fontSize: 16,
    color: 'blue',
    fontFamily: 'DMSans_18pt-Black',
  },
  titleText: {
    paddingStart: 16,
    fontSize: 24,
    color: 'blue',
    fontFamily: 'DMSans_18pt-Black',
  },
});

export default AppBarWithIconAndText;
