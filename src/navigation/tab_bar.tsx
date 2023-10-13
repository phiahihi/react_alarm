import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {IconAlarm, IconStopWatch} from '../../assets/icons';
import StopWatchScreen from '../screens/stop_watch/stop_watch';
import {APP_CONSTANTS} from '../constant/app_constant';
import textStyle from '../constant/text_style';
import TabBarIcon from '../components/tab_bar_icon';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AlarmScreen from '../screens/alarm/alarm';
import {AppStackParamList} from '.';
import FAB from '../components/fab';

export type TabStackList = {
  Alarm: undefined;
  StopWatch: undefined;
};

const Tab = createBottomTabNavigator<TabStackList>();

type Props = NativeStackScreenProps<AppStackParamList>;

const TabStack = ({navigation}: Props): JSX.Element => {
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name="Alarm"
          options={{
            tabBarLabelStyle: textStyle.pt10,
            tabBarLabel: APP_CONSTANTS.alarm,
            tabBarIcon: ({color}) =>
              TabBarIcon({iconComponent: IconAlarm, color}),
          }}>
          {() => (
            <View style={{flex: 1}}>
              <AlarmScreen navigation={navigation} />
              <FAB
                icon="plus"
                onPress={() => {
                  navigation.navigate('CreateOrEditAlarmScreen', {
                    isEditing: false,
                  });
                }}
              />
            </View>
          )}
        </Tab.Screen>

        <Tab.Screen
          name="StopWatch"
          component={StopWatchScreen}
          options={{
            tabBarLabelStyle: textStyle.pt10,
            tabBarLabel: APP_CONSTANTS.stopWatch,
            tabBarIcon: ({color}) =>
              TabBarIcon({iconComponent: IconStopWatch, color}),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabStack;
