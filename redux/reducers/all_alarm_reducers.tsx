import AlarmModel from '../../src/model/alarm_model';
import { AllAlarmActions, SET_ALL_ALARM } from '../actions/alarm_actions';

// Định nghĩa initialState cho reducer
const initialState: AlarmModel[] = [];

// Định nghĩa reducer cho việc quản lý tất cả báo thức
const allAlarmReducer = (
  state = initialState,
  action: AllAlarmActions,
): AlarmModel[] => {
  switch (action.type) {
    case SET_ALL_ALARM:
      return action.payload;
    default:
      return state;
  }
};

export default allAlarmReducer;
