import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import textStyle from '../../../constant/text_style';
import {theme} from '../../../global/styles';

interface DayRowProps {
  day: string;
  isTurnedOn: boolean;
}

interface DayScheduleProps {
  dayTurnOn: boolean[];
}

const DayColumn: React.FC<DayRowProps> = ({day, isTurnedOn}) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
      }}>
      <View
        style={{
          ...styles.CircleShape,
          backgroundColor: isTurnedOn
            ? theme.colors.primary
            : theme.colors.gray500,
        }}
      />
      <Text
        style={{
          ...textStyle.pt14,
          color: isTurnedOn ? theme.colors.primary : theme.colors.gray500,
        }}>
        {day}
      </Text>
    </View>
  );
};

const DaySchedule: React.FC<DayScheduleProps> = ({dayTurnOn}) => {
  const dayOfWeek = ['2', '3', '4', '5', '6', '7', 'CN'];

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
      }}>
      {dayOfWeek.map((day, index) => (
        <DayColumn key={index} day={day} isTurnedOn={dayTurnOn[index]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  CircleShape: {
    width: 3,
    height: 3,
    borderRadius: 4 / 2,
    backgroundColor: '#FF9800',
  },
});

export default DaySchedule;
