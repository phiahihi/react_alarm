import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import ItemStopWatch from './component/item_stop_watch';
import {theme} from '../../global/styles';
import textStyle from '../../constant/text_style';
import FAB from '../../components/fab';

const hoursDataSource: string[] = Array.from({length: 24}, (_, i) =>
  String(i).padStart(2, '0'),
);
const minutesDataSource: string[] = Array.from({length: 60}, (_, i) =>
  String(i).padStart(2, '0'),
);
const secondsDataSource: string[] = Array.from({length: 60}, (_, i) =>
  String(i).padStart(2, '0'),
);

const StopWatchScreen: React.FC = () => {
  const [selectedHour, setSelectedHour] = useState<string>('00');
  const [selectedMinute, setSelectedMinute] = useState<string>('10');
  const [selectedSecond, setSelectedSecond] = useState<string>('00');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const fadeAnimText = useRef(new Animated.Value(0)).current;
  const fadeAnimView = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        let newSecond = Number(selectedSecond);
        let newMinute = Number(selectedMinute);
        let newHour = Number(selectedHour);

        if (newSecond === 0) {
          if (newMinute === 0 && newHour === 0) {
            setIsRunning(false);
          } else {
            if (newMinute === 0) {
              newHour -= 1;
              newMinute = 59;
            } else {
              newMinute -= 1;
            }
            newSecond = 59;
          }
        } else {
          newSecond -= 1;
        }

        setSelectedSecond(String(newSecond).padStart(2, '0'));
        setSelectedMinute(String(newMinute).padStart(2, '0'));
        setSelectedHour(String(newHour).padStart(2, '0'));
      }, 1000);

      // Sử dụng Animated để tạo animation cho văn bản và view
      Animated.timing(fadeAnimText, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();

      Animated.timing(fadeAnimView, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      if (!isRunning) {
        Animated.timing(fadeAnimText, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();

        Animated.timing(fadeAnimView, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
        clearInterval(interval!);
      }
    }

    return () => clearInterval(interval!);
  }, [
    isPaused,
    fadeAnimText,
    fadeAnimView,
    isRunning,
    selectedHour,
    selectedMinute,
    selectedSecond,
  ]);

  const toggleStopWatch = () => {
    setIsRunning(!isRunning);
    if (isPaused === true) {
      setIsPaused(!isPaused);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.white}}>
      {isRunning ? (
        <View style={styles.container}>
          <Animated.Text
            style={{
              ...textStyle.pt48,
              fontSize: 70,
              textAlign: 'center',
              alignItems: 'center',
              opacity: fadeAnimText,
            }}>{`${selectedHour}:${selectedMinute}:${selectedSecond}`}</Animated.Text>
        </View>
      ) : (
        <Animated.View style={{...styles.container, opacity: fadeAnimView}}>
          <ItemStopWatch
            dataSource={hoursDataSource}
            selectedIndex={hoursDataSource.indexOf(selectedHour)}
            onValueChange={data => {
              setSelectedHour(data);
            }}
          />
          <View style={styles.verticalLine} />
          <ItemStopWatch
            dataSource={minutesDataSource}
            selectedIndex={minutesDataSource.indexOf(selectedMinute)}
            onValueChange={data => {
              setSelectedMinute(data);
            }}
          />
          <View style={styles.verticalLine} />
          <ItemStopWatch
            dataSource={secondsDataSource}
            selectedIndex={secondsDataSource.indexOf(selectedSecond)}
            onValueChange={data => {
              setSelectedSecond(data);
            }}
          />
        </Animated.View>
      )}
      {isRunning && (
        <FAB
          right={'30%'} // Adjust the right position as needed
          onPress={togglePause}
          icon={!isPaused ? 'pause' : 'caretright'}
        />
      )}
      <FAB
        onPress={toggleStopWatch}
        icon={isRunning ? 'close' : 'caretright'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  verticalLine: {
    width: 15,
    height: '40%',
    backgroundColor: theme.colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 36,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
});

export default StopWatchScreen;
