
import {NativeModules} from 'react-native';

const {RingtoneModule} = NativeModules;

type RingtoneResult = {
  title: string;
  uri: string;
};

type RingtoneModuleType = {
  getRingtoneInfo(): Promise<RingtoneResult | null>;
  pickRingtone(
    ringtoneTitle: String,
    ringtoneUri: String,
  ): Promise<RingtoneResult | null>;
};

const Ringtone: RingtoneModuleType = {
  getRingtoneInfo: async () => {
    try {
      const ringtoneResult = await RingtoneModule.getDefaultRingtoneUri();
      if (ringtoneResult) {
        const parsedRingtone: RingtoneResult = JSON.parse(ringtoneResult);
        return parsedRingtone;
      }
      return null;
    } catch (error) {
      throw new Error(`Error getting ringtone info: ${error}`);
    }
  },

  pickRingtone: async (ringtoneTitle: String, ringtoneUri: String) => {
    try {
      const ringtoneResult = await RingtoneModule.pickRingtone(
        ringtoneTitle,
        ringtoneUri,
      );
      if (ringtoneResult) {
        const parsedRingtone: RingtoneResult = JSON.parse(ringtoneResult);
        return parsedRingtone;
      }
      return null;
    } catch (error) {
      throw new Error(`Error picking ringtone: ${error}`);
    }
  },
};

export default Ringtone;
