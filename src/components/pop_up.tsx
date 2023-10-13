import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import TabBarIcon from './tab_bar_icon';
import {IconRadioBtnOff, IconRadioBtnOn} from '../../assets/icons';
import {theme} from '../global/styles';
import SpacingBox from './spacing_box';
import textStyle from '../constant/text_style';
import {APP_CONSTANTS} from '../constant/app_constant';

interface PopupProps {
  values: number[];
  selectedValue: number;
  onValueSelect: (value: number) => void;
  isVisible: boolean;
  onClose: () => void;
  title: string;
  content: (value: number) => string;
}

const Popup: React.FC<PopupProps> = ({
  values,
  selectedValue,
  onValueSelect,
  isVisible,
  onClose,
  title,
  content,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modal}>
          <TouchableWithoutFeedback>
            <View style={styles.popupContent}>
              <Text style={textStyle.pt18}>{title}</Text>
              <SpacingBox height={16} />
              {values.map(value => (
                <TouchableOpacity
                  style={{alignItems: 'center', width: '100%'}}
                  key={value}
                  onPress={() => onValueSelect(value)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      width: '100%',
                    }}>
                    <TabBarIcon
                      iconComponent={
                        selectedValue === value
                          ? IconRadioBtnOn
                          : IconRadioBtnOff
                      }
                      size={24}
                      color={theme.colors.primary}
                    />
                    <SpacingBox width={16} />
                    <Text style={{...textStyle.pt14, width: '100%'}}>
                      {content(value)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={onClose}
                style={{alignSelf: 'flex-end'}}>
                <Text style={textStyle.pt16}>{APP_CONSTANTS.cancel}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 50,
    borderRadius: 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
        shadowRadius: 4,
        shadowOffset: {width: -4, height: -4},
        shadowColor: theme.colors.primary,
      },
    }),
  },
});

export default Popup;
