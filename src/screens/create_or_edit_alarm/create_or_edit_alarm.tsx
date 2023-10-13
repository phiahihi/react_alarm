import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import SafeAreaContainerView from '../../components/safe_area_container_view';
import AppBarWithIconAndText from '../../components/app_bar';
import NumberButtonSetWithModal from '../alarm/component/number_button';
import styles from './styles';
import {APP_CONSTANTS} from '../../constant/app_constant';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation';
import Ringtone from '../../module/RingtoneModule';
import ItemApp from '../../components/item_app';
import Popup from '../../components/pop_up';
import PopupMultiSelect from '../../components/pop_up_multiselect';
import Setting from '../../module/SettingModule';

import AlarmModel from '../../model/alarm_model';
import {fetchAllAlarmData} from '../../../redux/actions/alarm_actions';
import {useDispatch, useSelector} from 'react-redux';
import {SettingState} from '../../../redux/reducers/setting_reducers';
import textStyle from '../../constant/text_style';

type Props = {
  route: RouteProp<AppStackParamList, 'CreateOrEditAlarmScreen'>;
  navigation: StackNavigationProp<AppStackParamList, 'CreateOrEditAlarmScreen'>;
};

export default function CreateOrEditAlarmScreen({route, navigation}: Props) {
  const {isEditing, alarm} = route.params;
  const dispatch = useDispatch();
  const settings = useSelector(
    (state: {setting: SettingState}) => state.setting,
  );

  useEffect(() => {
    if (isEditing && alarm !== null) {
      setTimeAlarm(alarm!.time);
      setSelectedValues(alarm!.repeatDaysOfWeek);
      setRepeat(checkSelectedValues(alarm!.repeatDaysOfWeek));
      setRingtoneTitle(alarm!.ringtoneTitle);
      setRingtoneUrl(alarm!.ringtoneUrl);
      setLabel(alarm!.label);
      setAlarmId(alarm!.id);
    } else {
      loadDefaultRingtone();
    }
  }, [isEditing, alarm]);

  const valuesRepeatdayDayOfWeeks = [0, 1, 2, 3];
  const [valueRepeat, setRepeat] = useState(0);
  const [isToggleRepeat, setToggleRepeat] = useState(false);
  const [isToggleSetTime, setToggleSetTime] = useState(false);
  const getRepeatText = (value: number) => {
    switch (value) {
      case 0:
        return APP_CONSTANTS.oneTime;
      case 1:
        return APP_CONSTANTS.everyDay;
      case 2:
        return APP_CONSTANTS.fromMondayToFriday;
      default:
        return APP_CONSTANTS.custom;
    }
  };

  const getRepeatTextDes = (value: number) => {
    if (value < 3) {
      return getRepeatText(value);
    } else {
      const content = (index: number) => {
        const days = [
          APP_CONSTANTS.monday,
          APP_CONSTANTS.tuesday,
          APP_CONSTANTS.wednesday,
          APP_CONSTANTS.thursday,
          APP_CONSTANTS.friday,
          APP_CONSTANTS.saturday,
          APP_CONSTANTS.sunday,
        ];
        return days[index];
      };
      const result = [];
      for (let i = 0; i < selectedValues.length; i++) {
        if (selectedValues[i]) {
          result.push(content(i));
        }
      }
      return result.join(', ');
    }
  };

  const handleRepeat = (value: number) => {
    setToggleRepeat(false);

    if (value === 0) {
      setSelectedValues([false, false, false, false, false, false, false]);
    } else if (value === 1) {
      setSelectedValues([true, true, true, true, true, true, true]);
    } else if (value === 2) {
      setSelectedValues([true, true, true, true, true, false, false]);
    } else {
      setToggleCustom(true);
    }

    if (value !== 3) {
      setRepeat(value);
    }
  };

  const checkSelectedValues = (values: boolean[]) => {
    if (values.every(value => value === true)) {
      return 1;
    } else if (values.every(value => value === false)) {
      return 0;
    } else if (
      values[0] &&
      values[1] &&
      values[2] &&
      values[3] &&
      values[4] &&
      !values[5] &&
      !values[6]
    ) {
      return 2;
    } else {
      return 3;
    }
  };

  const toggleRepeat = () => {
    setToggleRepeat(!isToggleRepeat);
  };

  const valuesDayOfWeeks = [false, false, false, false, false, false, false];
  const [selectedValues, setSelectedValues] = useState(valuesDayOfWeeks);
  const [isToggleCustom, setToggleCustom] = useState(false);

  const [alarmId, setAlarmId] = useState<string>('0');
  const [timeAlarm, setTimeAlarm] = useState<string>('00:00');
  const [ringtoneTitle, setRingtoneTitle] = useState('');
  const [ringtoneUrl, setRingtoneUrl] = useState('');
  const [label, setLabel] = useState('');

  const handleTimeAlarmCallback = (selectedTime: string) => {
    setTimeAlarm(selectedTime);
  };

  const handleChangeText = (text: string) => {
    setLabel(text);
  };

  const loadDefaultRingtone = () => {
    Ringtone.getRingtoneInfo().then(ringtoneInfo => {
      if (ringtoneInfo) {
        const {title, uri} = ringtoneInfo;
        setRingtoneTitle(title);
        setRingtoneUrl(uri);
      }
    });
  };

  const toggleSetTime = () => {
    setToggleSetTime(!isToggleSetTime);
  };

  return (
    <SafeAreaContainerView>
      <AppBarWithIconAndText
        onBackPress={() => navigation.pop()}
        onDonePress={async () => {
          if (isEditing && alarm !== null) {
            const alarmData = {
              id: alarmId,
              time: timeAlarm,
              repeatDaysOfWeek: selectedValues,
              enabled: true,
              ringtoneTitle: ringtoneTitle,
              ringtoneUrl: ringtoneUrl,
              label: label,
              preAlarmTime: settings.timePreAlarm,
            };
            const alarmModelInstance: AlarmModel = alarmData;
            try {
              const result = await Setting.updateAlarm(
                alarmId,
                alarmModelInstance,
              );
              console.log(result);
            } catch (error) {
              console.log(error);
            }
          } else {
            const alarmData = {
              id: Date.now().toString(),
              time: timeAlarm,
              repeatDaysOfWeek: selectedValues,
              enabled: true,
              ringtoneTitle: ringtoneTitle,
              ringtoneUrl: ringtoneUrl,
              label: label,
              preAlarmTime: settings.timePreAlarm,
            };
            const alarmModelInstance: AlarmModel = alarmData;
            try {
              const result = await Setting.setRepeatingAlarm(
                alarmModelInstance,
              );
              console.log(result);
            } catch (error) {
              console.log(error);
            }
          }
          fetchAllAlarmData()(dispatch);
          navigation.pop();
        }}
        doneText={APP_CONSTANTS.done}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          height: '50%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={toggleSetTime}>
          <Text style={{...textStyle.pt100}}>
            {timeAlarm !== null ? timeAlarm : '00:00'}
          </Text>
        </TouchableOpacity>
        {isToggleSetTime && (
          <NumberButtonSetWithModal
            onTimeAlarmSet={handleTimeAlarmCallback}
            toggleModal={toggleSetTime}
            isModalVisible={isToggleSetTime}
            timeAlarm={timeAlarm}
          />
        )}
      </View>

      <View style={styles.bottomContainer}>
        <TextInput
          style={styles.input}
          placeholder={APP_CONSTANTS.labelAlarm}
          value={label}
          onChangeText={handleChangeText}
        />
        <ItemApp
          titleAlarmText={APP_CONSTANTS.alarmSound}
          alarmText={ringtoneTitle}
          onPressContainer={async () => {
            try {
              const ringtoneInfo = await Ringtone.pickRingtone(
                ringtoneTitle,
                ringtoneUrl,
              );
              console.log(ringtoneInfo);
              if (ringtoneInfo) {
                setRingtoneTitle(ringtoneInfo!.title);
                setRingtoneUrl(ringtoneInfo!.uri);
              }
            } catch (error) {
              console.log(error);
            }
          }}
        />

        <ItemApp
          titleAlarmText={APP_CONSTANTS.repeat}
          alarmText={getRepeatTextDes(valueRepeat)}
          onPressContainer={toggleRepeat}
        />
        <Popup
          values={valuesRepeatdayDayOfWeeks}
          selectedValue={valueRepeat}
          onValueSelect={handleRepeat}
          isVisible={isToggleRepeat}
          onClose={toggleRepeat}
          title={APP_CONSTANTS.repeat}
          content={getRepeatText}
        />
        <PopupMultiSelect
          values={selectedValues}
          selectedValues={[]}
          onValueSelect={value => {
            setSelectedValues(value);
            setRepeat(checkSelectedValues(value));
          }}
          isVisible={isToggleCustom}
          onClose={() => {
            setToggleCustom(false);
          }}
          title={APP_CONSTANTS.custom}
        />
      </View>
    </SafeAreaContainerView>
  );
}
