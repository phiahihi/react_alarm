import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabStack from './tab_bar';
import CreateOrEditAlarmScreen from '../screens/create_or_edit_alarm/create_or_edit_alarm';
import SettingScreen from '../screens/setting/setting';
import AlarmModel from '../model/alarm_model';
import {useDispatch} from 'react-redux';
import { fetchSettings } from '../../redux/actions/setting_actions';

const Stack = createStackNavigator<AppStackParamList>();

export type AppStackParamList = {
  AlarmScreen: undefined;
  TimerScreen: undefined;
  StopWatchScreen: undefined;
  CreateOrEditAlarmScreen: {isEditing: boolean; alarm?: AlarmModel};
  SettingScreen: undefined;
  TabStack: undefined;
  AppStack: undefined;
};

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TabStack" component={TabStack} />
      <Stack.Screen
        name="CreateOrEditAlarmScreen"
        component={CreateOrEditAlarmScreen}
      />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
    </Stack.Navigator>
  );
};

const Root = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSettings()(dispatch);
  }, [dispatch]);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="AppStack" component={AppStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Root;
