import React, {useState, useEffect} from 'react';
import {StyleSheet, Switch, View, Text, Pressable} from 'react-native';
import DaySchedule from './day_schedule';
import textStyle from '../../../constant/text_style';
import AlarmModel from '../../../model/alarm_model';
import {theme} from '../../../global/styles';
import PopUpAlarm from '../../../components/pop_up_alarm';
import Setting from '../../../module/SettingModule';
import {fetchAllAlarmData} from '../../../../redux/actions/alarm_actions';
import {useDispatch} from 'react-redux';

interface AlarmItemProps {
  alarm: AlarmModel;
  onUpdateAlarm: () => void;
}

const AlarmItem: React.FC<AlarmItemProps> = ({alarm, onUpdateAlarm}) => {
  const dispatch = useDispatch();

  const [isEnable, setIsEnable] = useState(alarm.enabled);
  const onLongPressAction = () => {
    toggleModal();
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    // Sử dụng useEffect để theo dõi thay đổi trong alarm.enabled và cập nhật isEnable
    setIsEnable(alarm.enabled);
  }, [alarm.enabled]);

  const onDeleteAlarm = () => {
    Setting.deleteAlarm(alarm.id)
      .then(value => {
        console.log(value);
      })
      .catch(e => {
        console.log(e);
      }); // Xóa báo thức
    fetchAllAlarmData()(dispatch); // Cập nhật lại danh sách báo thức sau khi xóa
    toggleModal(); // Đóng modal sau khi xóa và cập nhật
  };

  const isEnabled = () => {
    if (alarm.enabled) {
      setIsEnable(false);
      Setting.disableAlarm(alarm.id)
        .then(value => {
          console.log(value);
        })
        .catch(e => {
          console.log(e);
        }); // Bật hoặc tắt báo thức
    } else {
      setIsEnable(true);
      Setting.enableAlarm(alarm.id)
        .then(value => {
          console.log(value);
        })
        .catch(e => {
          console.log(e);
        }); // Bật hoặc tắt báo thức
    }
    fetchAllAlarmData()(dispatch); // Cập nhật lại danh sách báo thức sau khi bật hoặc tắt
  };

  return (
    <Pressable onPress={onUpdateAlarm} onLongPress={onLongPressAction}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text
            numberOfLines={2}
            style={{...textStyle.pt14, color: '#000', marginBottom: 8}}>
            {alarm.label}
          </Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{alarm.time}</Text>
          </View>
          <DaySchedule dayTurnOn={alarm.repeatDaysOfWeek} />
        </View>
        <Switch
          style={styles.switch}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnable ? theme.colors.primary : theme.colors.gray500}
          ios_backgroundColor="#3e3e3e"
          onValueChange={isEnabled}
          value={isEnable}
        />
        <PopUpAlarm
          toggleModal={toggleModal}
          isVisible={isModalVisible}
          onDeleteAlarm={onDeleteAlarm}
          // Gọi hàm xóa tất cả báo thức ở đây
        />
      </View>
    </Pressable>
  );
};

export default AlarmItem;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 177,
    width: 177,
    flex: 1,
    borderRadius: 20,
    padding: 19,
    backgroundColor: '#fff',
    margin: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    top: 19,
    right: 19,
    left: 19,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timeText: {
    ...textStyle.pt36,
  },
  amPmText: {
    ...textStyle.pt18,
    position: 'absolute',
    bottom: 5,
    right: -30,
  },
  switch: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
});
