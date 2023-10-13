import {
  SET_RINGTONE_URL,
  SET_RINGTONE_TITLE,
  SET_VOLUME_ALARM,
  TOGGLE_VIBRATION,
  SET_PRE_ALARM_TIME,
  SET_FADE_IN_DURATION,
  SET_SETTINGS,
  SET_ERROR,
  SET_TIME_SNOOZE,
  SET_TIME_STOP_ALARM,
} from '../actions/setting_actions';

export interface SettingState {
  volume: number;
  timeShowNotification: number;
  vibrate: boolean;
  timePreAlarm: number;
  timeSnooze: number;
  timeStopAlarm: number;
  titleRingTone: string;
  urlRingTone: string;
  error: string; // Thêm trường để xử lý lỗi
}

// Khởi tạo initialState với giá trị mặc định
const initialState: SettingState = {
  volume: 0,
  timeShowNotification: 0,
  vibrate: false,
  timePreAlarm: 0,
  timeSnooze: 1,
  timeStopAlarm: 0,
  titleRingTone: '',
  urlRingTone: '',
  error: '', // Khởi tạo lỗi trống
};

const settingReducer = (state = initialState, action: any): SettingState => {
  switch (action.type) {
    case SET_RINGTONE_URL:
      return {...state, urlRingTone: action.payload};
    case SET_RINGTONE_TITLE:
      return {...state, titleRingTone: action.payload};
    case SET_VOLUME_ALARM:
      return {...state, volume: action.payload};
    case TOGGLE_VIBRATION:
      return {...state, vibrate: action.payload};
    case SET_PRE_ALARM_TIME:
      return {...state, timePreAlarm: action.payload};
    case SET_FADE_IN_DURATION:
      return {...state, timeShowNotification: action.payload};
    case SET_SETTINGS:
      // Sử dụng action.payload để cập nhật toàn bộ settings
      return {...state, ...action.payload, error: ''}; // Xóa lỗi khi cập nhật thành công
    case SET_ERROR:
      return {...state, error: action.payload};
    case SET_TIME_SNOOZE:
      return {...state, timeSnooze: action.payload};
    case SET_TIME_STOP_ALARM:
      return {...state, timeStopAlarm: action.payload};
    default:
      return state;
  }
};

export default settingReducer;
