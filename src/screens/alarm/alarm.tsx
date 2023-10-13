import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CircleIconButton from '../../components/circle_icon_button';
import {IconThreeDotVertical} from '../../../assets/icons';
import AlarmModel from '../../model/alarm_model';
import textStyle from '../../constant/text_style';
import styles from './styles';
import AlarmItem from './component/alarm_item';
import {APP_CONSTANTS} from '../../constant/app_constant';
import {fetchAllAlarmData} from '../../../redux/actions/alarm_actions';
const {NotificationEventModule} = NativeModules;

type Props = {
  navigation: any;
};

const AlarmScreen = ({navigation}: Props) => {
  const dispatch = useDispatch();
  const allAlarm = useSelector(
    (state: {allAlarm: AlarmModel[]}) => state.allAlarm,
  );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Gọi action để tải danh sách báo thức từ Redux
  //     fetchAllAlarmData()(dispatch);
  //   };

  //   fetchData();
  // }, [dispatch]);

  useEffect(() => {
    const fetchDataAndRefreshUI = async () => {
      fetchAllAlarmData()(dispatch);
    };

    fetchDataAndRefreshUI(); // Thực hiện lần đầu khi màn hình được tạo

    const notificationEventEmitter = new NativeEventEmitter(
      NotificationEventModule,
    );

    const notificationListener = notificationEventEmitter.addListener(
      'onNotificationDismissed',
      () => {
        fetchDataAndRefreshUI(); // Thực hiện sau khi thông báo bị tắt
      },
    );

    return () => {
      notificationListener.remove(); // Loại bỏ sự kiện khi màn hình bị hủy
    };
  }, [dispatch]);

  const renderSeparator = () => <View style={{height: 16, width: '100%'}} />;

  return (
    <View style={{flex: 1}}>
      <View style={styles.threeDotVertical}>
        <CircleIconButton
          onPress={() => {
            navigation.navigate('SettingScreen');
          }}
          iconComponent={IconThreeDotVertical}
        />
      </View>

      <View style={{flex: 1}}>
        {allAlarm.length > 0 ? (
          <FlatList
            ItemSeparatorComponent={renderSeparator}
            columnWrapperStyle={{justifyContent: 'space-evenly', flex: 1}}
            contentContainerStyle={{
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            scrollsToTop={true}
            data={allAlarm}
            renderItem={({item}) => (
              <AlarmItem
                alarm={item}
                key={item.id}
                onUpdateAlarm={() =>
                  navigation.navigate('CreateOrEditAlarmScreen', {
                    isEditing: true,
                    alarm: item,
                  })
                }
              />
            )}
            numColumns={2}
            keyExtractor={item => item.id.toString()} // Sử dụng toString() để chuyển đổi ID sang chuỗi
          />
        ) : (
          <Text
            style={{
              ...textStyle.pt16,
              textAlign: 'center',
              textAlignVertical: 'center',
              flex: 1,
            }}>
            {APP_CONSTANTS.thereIsNoAlarm}
          </Text>
        )}
      </View>
    </View>
  );
};

export default AlarmScreen;
