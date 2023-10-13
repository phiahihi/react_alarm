import {Dispatch} from 'redux';
import SettingsModel from '../../src/model/settings_model';
import Setting from '../../src/module/SettingModule';

export const SET_VOLUME_ALARM = 'SET_VOLUME_ALARM';
export const TOGGLE_VIBRATION = 'TOGGLE_VIBRATION';
export const SET_PRE_ALARM_TIME = 'SET_PRE_ALARM_TIME';
export const SET_FADE_IN_DURATION = 'SET_FADE_IN_DURATION';
export const SET_TIME_SNOOZE = 'SET_TIME_SNOOZE';
export const SET_TIME_STOP_ALARM = 'SET_TIME_STOP_ALARM';
export const SET_RINGTONE_URL = 'SET_RINGTONE_URL';
export const SET_RINGTONE_TITLE = 'SET_RINGTONE_TITLE';
export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_ERROR = 'SET_ERROR';

export const setVolumeAlarm = (volume: number) => ({
  type: SET_VOLUME_ALARM,
  payload: volume,
});

export const toggleVibration = (value: boolean) => ({
  type: TOGGLE_VIBRATION,
  payload: value,
});

export const setPreAlarmTime = (duration: number) => ({
  type: SET_PRE_ALARM_TIME,
  payload: duration,
});

export const setFadeInDuration = (duration: number) => ({
  type: SET_FADE_IN_DURATION,
  payload: duration,
});

export const setTimeSnooze = (duration: number) => ({
  type: SET_TIME_SNOOZE,
  payload: duration,
});

export const setTimeStopAlarm = (duration: number) => ({
  type: SET_TIME_STOP_ALARM,
  payload: duration,
});

export const setRingToneUrl = (url: string) => ({
  type: SET_RINGTONE_URL,
  payload: url,
});

export const setRingToneTitle = (title: string) => ({
  type: SET_RINGTONE_TITLE,
  payload: title,
});

// Action creator để cập nhật settings
export const updateSettings = (settings: SettingsModel) => {
  return {type: SET_SETTINGS, payload: settings};
};

// Action creator để xử lý lỗi
export const setError = (error: string) => {
  return {type: SET_ERROR, payload: error};
};

// Action creator để lấy dữ liệu settings bất đồng bộ
export const fetchSettings = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result = await Setting.getSettings(); // Đảm bảo Setting.getSettings() trả về đúng dữ liệu
      if (result) {
        const parsedSettings: SettingsModel = result;
        dispatch(updateSettings(parsedSettings));
      }
    } catch (error) {
      dispatch(setError(`Error get settings: ${error}`));
    }
  };
};
