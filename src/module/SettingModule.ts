import {NativeModules} from 'react-native';
import AlarmModel from '../model/alarm_model';
import SettingsModel from '../model/settings_model';
const {SettingModule} = NativeModules;

type SettingModuleType = {
  setRepeatingAlarm(alarm: AlarmModel): Promise<String | null>;
  updateAlarm(alarmId: String, alarm: AlarmModel): Promise<String | null>;
  getAllAlarm(): Promise<AlarmModel[] | null>;
  deleteAllAlarm(): Promise<String | null>;
  deleteAlarm(alarmId: String): Promise<String | null>;
  enableAlarm(alarmId: String): Promise<String | null>;
  disableAlarm(alarmId: String): Promise<String | null>;
  getSettings(): Promise<SettingsModel | null>;
  updateSettingField(
    fieldName: String,
    fieldValue: String,
  ): Promise<String | null>;
};

const Setting: SettingModuleType = {
  setRepeatingAlarm: async (alarm: AlarmModel) => {
    try {
      const result = await SettingModule.setRepeatingAlarm(
        JSON.stringify(alarm),
      );

      return result;
    } catch (error) {
      throw new Error(`Error set repeating alarm: ${error}`);
    }
  },
  getAllAlarm: async () => {
    try {
      const result = await SettingModule.getAllAlarm();
      if (result) {
        try {
          const parsedResult: AlarmModel[] = JSON.parse(result);
          return parsedResult;
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          return null; // Handle parsing error gracefully
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching all alarm data:', error);
      throw error; // Re-throw the error or handle it as needed
    }
  },

  getSettings: async () => {
    try {
      const result = await SettingModule.getSettings();
      if (result) {
        console.log('result', JSON.parse(result));
        const parsedSettings: SettingsModel = JSON.parse(result);
        return parsedSettings;
      }
      return null;
    } catch (error) {
      throw new Error(`Error get settings: ${error}`);
    }
  },

  updateSettingField: async (fieldName: String, fieldValue: String) => {
    try {
      const result = await SettingModule.updateSettingsField(
        fieldName,
        fieldValue,
      );

      return result.toString();
    } catch (error) {
      throw new Error(`Error update setting field: ${error}`);
    }
  },

  deleteAllAlarm: async () => {
    try {
      const result = await SettingModule.deleteAllAlarms();
      return result;
    } catch (error) {
      throw new Error(`Error delete all alarm: ${error}`);
    }
  },

  deleteAlarm: async (alarmId: String) => {
    try {
      const result = await SettingModule.deleteAlarm(alarmId);
      return result;
    } catch (error) {
      throw new Error(`Error delete alarm: ${error}`);
    }
  },

  enableAlarm: async (alarmId: String) => {
    try {
      const result = await SettingModule.enableAlarm(alarmId);
      return result;
    } catch (error) {
      throw new Error(`Error enable alarm: ${error}`);
    }
  },

  disableAlarm: async (alarmId: String) => {
    try {
      const result = await SettingModule.disableAlarm(alarmId);
      return result;
    } catch (error) {
      throw new Error(`Error disable alarm: ${error}`);
    }
  },

  updateAlarm: async (alarmId: String, alarm: AlarmModel) => {
    try {
      const result = await SettingModule.updateAlarm(
        alarmId,
        JSON.stringify(alarm),
      );
      return result;
    } catch (error) {
      throw new Error(`Error update alarm: ${error}`);
    }
  },
};

export default Setting;
