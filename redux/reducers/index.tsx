import {combineReducers} from 'redux';
import settingReducer from './setting_reducers';
import allAlarmReducer from './all_alarm_reducers';

const rootReducer = combineReducers({
  setting: settingReducer,
  allAlarm: allAlarmReducer,
  // Thêm các reducers khác nếu cần
});

export default rootReducer;
