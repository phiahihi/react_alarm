import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';

const TimerScreen: React.FC = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Timer: {seconds} seconds</Text>
    </View>
  );
};
export default TimerScreen;
