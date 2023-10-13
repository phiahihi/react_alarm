import {Dispatch} from 'redux';
import Setting from '../../src/module/SettingModule';
import AlarmModel from '../../src/model/alarm_model';

// Định nghĩa các hằng action type
export const SET_ALL_ALARM = 'SET_ALL_ALARM';
export const SET_ERROR_ALL_ALARM = 'SET_ERROR_ALL_ALARM';

// Định nghĩa kiểu action cho việc cập nhật tất cả báo thức
interface SetAllAlarmAction {
  type: typeof SET_ALL_ALARM;
  payload: AlarmModel[];
}

// Định nghĩa kiểu action cho việc xử lý lỗi
interface SetErrorAllAlarmAction {
  type: typeof SET_ERROR_ALL_ALARM;
  payload: string;
}

// Kiểu tổng hợp của tất cả các action
export type AllAlarmActions = SetAllAlarmAction | SetErrorAllAlarmAction;

// Action creator để cập nhật tất cả báo thức
export const setAllAlarm = (allAlarm: AlarmModel[]): SetAllAlarmAction => ({
  type: SET_ALL_ALARM,
  payload: allAlarm,
});

// Action creator để xử lý lỗi
export const setErrorAllAlarm = (error: string): SetErrorAllAlarmAction => ({
  type: SET_ERROR_ALL_ALARM,
  payload: error,
});

// Action creator để fetch tất cả báo thức
export const fetchAllAlarmData = () => {
  return async (dispatch: Dispatch<AllAlarmActions>) => {
    try {
      const result = await Setting.getAllAlarm();
      if (result) {
        const parsedAllAlarm: AlarmModel[] = result;
        dispatch(setAllAlarm(parsedAllAlarm));
      }
    } catch (error) {
      dispatch(setErrorAllAlarm(`Error getting all alarm: ${error}`));
    }
  };
};
