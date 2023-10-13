import React from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
import textStyle from '../constant/text_style';
import {theme} from '../global/styles';

interface PopUpAlarmProps {
  toggleModal: () => void;
  isVisible: boolean;
  onDeleteAlarm: () => void; // Hàm khi ấn nút "Xóa báo thức"
}

const PopUpAlarm = ({
  toggleModal,
  isVisible,
  onDeleteAlarm,
}: PopUpAlarmProps) => {
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          toggleModal();
        }}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableHighlight
                onPress={onDeleteAlarm}
                activeOpacity={1}
                underlayColor="transparent"
                style={[styles.button]}>
                <Text style={textStyle.pt18}>Xóa báo thức</Text>
              </TouchableHighlight>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Màu đen có độ mờ 50%
  },
  modalView: {
    margin: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    alignItems: 'stretch', // Căn chỉnh các mục sang bên trái
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  button: {
    padding: 16,
    borderColor: 'lightgray',
  },
  buttonText: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'left', // Căn chỉnh văn bản sang bên trái
  },
});

export default PopUpAlarm;
