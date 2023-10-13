interface AlarmModel {
  id: string;
  time: string;
  repeatDaysOfWeek: boolean[];
  enabled: boolean;
  ringtoneTitle: string;
  ringtoneUrl: string;
  label: string;
  preAlarmTime: number;
}
export default AlarmModel;
