import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import AppBarWithIconAndText from '../../components/app_bar';
import {APP_CONSTANTS} from '../../constant/app_constant';
import {styles, theme} from '../../global/styles';
import ItemApp from '../../components/item_app';
import TitleWithSlider from '../../components/title_with_slider';
import ItemSetting from './component/item_setting';
import SpacingBox from '../../components/spacing_box';
import Popup from '../../components/pop_up';
import {useDispatch, useSelector} from 'react-redux';

import {
  setVolumeAlarm,
  toggleVibration,
  setFadeInDuration,
  setTimeSnooze,
  setTimeStopAlarm,
  fetchSettings,
  setPreAlarmTime,
  // setRingToneTitle,
  // setRingToneUrl,
} from '../../../redux/actions/setting_actions';
import {SettingState} from '../../../redux/reducers/setting_reducers';
import Setting from '../../module/SettingModule';
type Props = {
  navigation: any;
};

const SettingScreen = ({navigation}: Props) => {
  const dispatch = useDispatch();
  const settings = useSelector(
    (state: {setting: SettingState}) => state.setting,
  );

  useEffect(() => {
    fetchSettings()(dispatch);
  }, [dispatch]);

  const vibrate = useSelector(
    (state: {setting: SettingState}) => state.setting.vibrate,
  );

  const timeShowNotification = useSelector(
    (state: {setting: SettingState}) => state.setting.timeShowNotification,
  );
  const timeSnooze = useSelector(
    (state: {setting: SettingState}) => state.setting.timeSnooze,
  );
  const timeStopAlarm = useSelector(
    (state: {setting: SettingState}) => state.setting.timeStopAlarm,
  );
  const timePreAlarm = useSelector(
    (state: {setting: SettingState}) => state.setting.timePreAlarm,
  );

  function onValueChangeVolumeAlarm(value: number) {
    dispatch(setVolumeAlarm(value));
    Setting.updateSettingField('volume', value.toString())
      .then(() => {
        console.log('Update volume success');
      })
      .catch(error => {
        console.log('Update volume error: ', error);
      });
  }

  function onValueChangeVibration(value: boolean) {
    dispatch(toggleVibration(value));
    Setting.updateSettingField('vibrate', value.toString())
      .then(() => {
        console.log('Update volume success');
      })
      .catch(error => {
        console.log('Update volume error: ', error);
      });
  }

  const [isFadeInDuration, setIsFadeInDuration] = useState(false);

  const [isAgainDuration, setIsAgainDuration] = useState(false);

  const [isAutoSilent, setAutoSilent] = useState(false);

  const [isPreAlarmTime, setIsPreAlarmTime] = useState(false);

  const getFadeInduration = (value: number) => {
    switch (value) {
      case 0:
        return APP_CONSTANTS.off;
      case 10:
        return `${value} ${APP_CONSTANTS.seconds.toLowerCase()}`;
      case 20:
        return `${value} ${APP_CONSTANTS.seconds.toLowerCase()}`;
      case 30:
        return `${value} ${APP_CONSTANTS.seconds.toLowerCase()}`;
      case 60:
        return `${value} ${APP_CONSTANTS.seconds.toLowerCase()}`;
      case 120:
        return `${value} ${APP_CONSTANTS.seconds.toLowerCase()}`;
      default:
        return APP_CONSTANTS.off;
    }
  };

  const valuesAutoSilent = [0, 5, 10, 15, 20, 25, 30];
  const valuesAgainDurations = [1, 5, 10, 15, 20, 25, 30];
  const valuesFadeInDuration = [0, 10, 20, 30, 60, 120];
  const valuesPreAlarmDuration = [0, 10, 20, 30, 45, 60];

  const getAutoSilentOrAgainDurations = (value: number) => {
    switch (value) {
      case 0:
        return APP_CONSTANTS.off;
      case 1:
        return `${value} ${APP_CONSTANTS.minutes.toLowerCase()}`;
      case 5:
        return `${value} ${APP_CONSTANTS.minutes.toLowerCase()}`;
      case 10:
        return `${value} ${APP_CONSTANTS.minutes.toLowerCase()}`;
      case 15:
        return `${value} ${APP_CONSTANTS.minutes.toLowerCase()}`;
      case 20:
        return `${value} ${APP_CONSTANTS.minutes.toLowerCase()}`;
      case 25:
        return `${value} ${APP_CONSTANTS.minutes.toLowerCase()}`;
      case 30:
        return `${value} ${APP_CONSTANTS.minutes.toLowerCase()}`;
      case 45:
        return `${value} ${APP_CONSTANTS.minutes.toLowerCase()}`;
      case 60:
        return `${value} ${APP_CONSTANTS.minutes.toLowerCase()}`;
      default:
        return APP_CONSTANTS.off;
    }
  };

  const toggleFadeInDuration = () => {
    setIsFadeInDuration(!isFadeInDuration);
  };

  const toggleAgainDuration = () => {
    setIsAgainDuration(!isAgainDuration);
  };

  const toggleAutoSilent = () => {
    setAutoSilent(!isAutoSilent);
  };

  const togglePreAlarmTime = () => {
    setIsPreAlarmTime(!isPreAlarmTime);
  };

  const handleFadeInSelect = (value: number) => {
    dispatch(setFadeInDuration(value));
    Setting.updateSettingField('timeShowNotification', value.toString())
      .then(() => {
        console.log('Update timeShowNotification success');
      })
      .catch(error => {
        console.log('Update timeShowNotification error: ', error);
      });
  };
  const handleAgainDurationSelect = (value: number) => {
    dispatch(setTimeSnooze(value));
    Setting.updateSettingField('timeSnooze', value.toString())
      .then(() => {
        console.log('Update timeSnooze success');
      })
      .catch(error => {
        console.log('Update timeSnooze error: ', error);
      });
  };
  const handleAutoSilentSelect = (value: number) => {
    dispatch(setTimeStopAlarm(value));
    Setting.updateSettingField('timeStopAlarm', value.toString())
      .then(() => {
        console.log('Update timeStopAlarm success');
      })
      .catch(error => {
        console.log('Update timeStopAlarm error: ', error);
      });
  };

  const handlePreAlarmTimeSelect = (value: number) => {
    dispatch(setPreAlarmTime(value));
    Setting.updateSettingField('timePreAlarm', value.toString())
      .then(() => {
        console.log('Update timePreAlarm success');
      })
      .catch(error => {
        console.log('Update timePreAlarm error: ', error);
      });
  };

  return (
    <View style={{flex: 1}}>
      <AppBarWithIconAndText
        onBackPress={() => navigation.pop()}
        title={APP_CONSTANTS.setting}
      />
      <View style={{flex: 1, backgroundColor: theme.colors.primaryLight}}>
        <ScrollView>
          <View style={styles.flexColView}>
            <ItemSetting
              title={APP_CONSTANTS.volumesAndSounds}
              children={
                <View>
                  <ItemApp
                    titleAlarmText={APP_CONSTANTS.ringtone}
                    alarmText={settings.titleRingTone}
                  />
                  <SpacingBox height={16} />
                  <TitleWithSlider
                    minValue={0}
                    maxValue={100}
                    theme={theme}
                    title={APP_CONSTANTS.volumeAlarm}
                    onValueChange={onValueChangeVolumeAlarm}
                    valueVolume={settings.volume}
                  />
                  <SpacingBox height={16} />
                  <ItemApp
                    titleAlarmText={APP_CONSTANTS.vibration}
                    onToggleSwitch={onValueChangeVibration}
                    isSwitch={vibrate}
                  />
                </View>
              }
            />

            <ItemSetting
              title={APP_CONSTANTS.durations}
              children={
                <View>
                  <ItemApp
                    titleAlarmText={APP_CONSTANTS.preAlarmDuration}
                    alarmText={getAutoSilentOrAgainDurations(timePreAlarm)}
                    onPressContainer={togglePreAlarmTime}
                  />
                  <Popup
                    content={getAutoSilentOrAgainDurations}
                    values={valuesPreAlarmDuration}
                    selectedValue={timePreAlarm}
                    onValueSelect={handlePreAlarmTimeSelect}
                    isVisible={isPreAlarmTime}
                    onClose={togglePreAlarmTime}
                    title={APP_CONSTANTS.fadeInDuration}
                  />
                  <ItemApp
                    titleAlarmText={APP_CONSTANTS.fadeInDuration}
                    alarmText={getFadeInduration(timeShowNotification)}
                    onPressContainer={toggleFadeInDuration}
                  />
                  <Popup
                    content={getFadeInduration}
                    values={valuesFadeInDuration}
                    selectedValue={timeShowNotification}
                    onValueSelect={handleFadeInSelect}
                    isVisible={isFadeInDuration}
                    onClose={toggleFadeInDuration}
                    title={APP_CONSTANTS.fadeInDuration}
                  />
                  <ItemApp
                    titleAlarmText={APP_CONSTANTS.againDuration}
                    alarmText={getAutoSilentOrAgainDurations(timeSnooze)}
                    onPressContainer={toggleAgainDuration}
                  />
                  <Popup
                    content={getAutoSilentOrAgainDurations}
                    values={valuesAgainDurations}
                    selectedValue={timeSnooze}
                    onValueSelect={handleAgainDurationSelect}
                    isVisible={isAgainDuration}
                    onClose={toggleAgainDuration}
                    title={APP_CONSTANTS.againDuration}
                  />
                  <ItemApp
                    titleAlarmText={APP_CONSTANTS.autoSilent}
                    alarmText={getAutoSilentOrAgainDurations(timeStopAlarm)}
                    onPressContainer={toggleAutoSilent}
                  />
                  <Popup
                    content={getAutoSilentOrAgainDurations}
                    values={valuesAutoSilent}
                    selectedValue={timeStopAlarm}
                    onValueSelect={handleAutoSilentSelect}
                    isVisible={isAutoSilent}
                    onClose={toggleAutoSilent}
                    title={APP_CONSTANTS.autoSilent}
                  />
                </View>
              }
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SettingScreen;
