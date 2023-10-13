import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import CircleIconButton from '../../../components/circle_icon_button';
import textStyle from '../../../constant/text_style';
import {checkValid24HourFormat} from '../../../utils/check_time_validate';
import {isValid24HourTimeFormat} from '../../../utils/time_validate';
import {IconRemoveTag} from '../../../../assets/icons';
import {APP_CONSTANTS} from '../../../constant/app_constant';

interface NumberButtonSetWithModalProps {
  onTimeAlarmSet: (selectedTime: string) => void;
  timeAlarm: string;
  isModalVisible: boolean;
  toggleModal: () => void;
}

const NumberButtonSetWithModal: React.FC<NumberButtonSetWithModalProps> = ({
  onTimeAlarmSet,
  timeAlarm,
  isModalVisible,
  toggleModal,
}) => {
  const [setAlarm, setSetAlarm] = useState(['-', '-', ':', '-', '-']);
  const [timeAlarmPopup, setTimeAlarmPopup] = useState('00:00');

  useEffect(() => {
    setTimeAlarmPopup(timeAlarm);
    setSetAlarm(timeAlarm.split(''));
  }, [timeAlarm]);

  function handleNumberPress(number: string) {
    const findDot = setAlarm.findIndex(value => value === ':');
    if (findDot !== -1) {
      setAlarm.splice(findDot, 1);
    }
    const lastDashIndex = setAlarm.findIndex(value => value === '-');
    if (lastDashIndex !== -1) {
      const updatedSetAlarm = [...setAlarm];

      if (number.length === 2) {
        updatedSetAlarm.splice(lastDashIndex, 2);
        const hours = parseInt(number.slice(0, 1), 10);
        const minutes = parseInt(number.slice(1, 2), 10);
        updatedSetAlarm.push(hours.toString());
        updatedSetAlarm.push(minutes.toString());
      } else {
        updatedSetAlarm.splice(lastDashIndex, 1);
        updatedSetAlarm.push(number);
      }

      const formattedAlarm = [...updatedSetAlarm];
      formattedAlarm.splice(2, 0, ':');

      setSetAlarm(updatedSetAlarm);
      setTimeAlarmPopup(formattedAlarm.join(''));
    }
  }

  function handleRemove() {
    // Kiểm tra biến state trước khi xử lý sự kiện "Remove"
    // Xử lý sự kiện "Remove" ở đây
    const updatedSetAlarm = [...setAlarm];
    updatedSetAlarm.pop(); // Remove the last element from updatedSetAlarm
    updatedSetAlarm.unshift('-'); // Add '-' at the beginning of updatedSetAlarm
    console.log(updatedSetAlarm);
    const formattedAlarm = [...updatedSetAlarm];
    const findDot = formattedAlarm.findIndex(value => value === ':');
    if (findDot !== -1) {
      formattedAlarm.splice(findDot, 1);
    }
    formattedAlarm.splice(2, 0, ':');
    if (formattedAlarm.length > 5) {
      formattedAlarm.pop();
      updatedSetAlarm.pop();
    }
    console.log('formattedAlarm' + formattedAlarm);
    setSetAlarm(updatedSetAlarm);
    setTimeAlarmPopup(formattedAlarm.join(''));
  }

  return (
    <View style={styles.container}>
      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Text style={{...textStyle.pt32}}>
                  {timeAlarmPopup !== '' ? timeAlarmPopup : '--:--'}
                </Text>
                <CircleIconButton
                  onPress={() => handleRemove()}
                  iconComponent={IconRemoveTag}
                />
              </View>
              <View style={styles.buttonContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, ':00', 0, ':30'].map(number => (
                  <TouchableOpacity
                    key={number}
                    style={[styles.numberButton]}
                    onPress={() => {
                      if (
                        isValid24HourTimeFormat(
                          timeAlarmPopup + number.toString().replace(':', ''),
                        )
                      ) {
                        handleNumberPress(number.toString().replace(':', ''));
                      }
                    }}>
                    <Text
                      style={{
                        ...styles.numberButtonText,
                        color: isValid24HourTimeFormat(
                          timeAlarmPopup + number.toString().replace(':', ''),
                        )
                          ? 'rgba(94, 167, 222, 1)'
                          : 'rgba(94, 167, 222, 0.5)',
                      }}>
                      {number}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.footerButtons}>
                <TouchableOpacity
                  style={styles.footerButton}
                  onPress={toggleModal}>
                  <Text style={styles.footerButtonText}>
                    {APP_CONSTANTS.cancel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.footerButton}
                  onPress={() => {
                    if (checkValid24HourFormat(timeAlarmPopup!)) {
                      const numberConverted = timeAlarmPopup.replace(/-/g, '0');
                      setTimeAlarmPopup(numberConverted);
                      onTimeAlarmSet(numberConverted);
                      toggleModal();
                    }
                  }}>
                  <Text
                    style={{
                      ...styles.footerButtonText,
                      color: checkValid24HourFormat(timeAlarmPopup!)
                        ? 'rgba(94, 167, 222, 1)'
                        : 'rgba(94, 167, 222, 0.5)',
                    }}>
                    {APP_CONSTANTS.ok}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FE',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'rgba(94, 167, 222, 1)',
    shadowColor: 'rgba(94, 167, 222, 1)',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 10,
    elevation: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  numberButton: {
    width: '33%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
  },
  numberButtonText: {
    ...textStyle.pt48,
    color: 'rgba(94, 167, 222, 1)',
  },

  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 5,
    borderColor: 'rgba(94, 167, 222, 1)',
  },
  footerButtonText: {
    ...textStyle.pt18,
    color: 'rgba(94, 167, 222, 1)',
  },
});

export default NumberButtonSetWithModal;
