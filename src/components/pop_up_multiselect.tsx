import React, {useEffect, useState} from 'react';
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
import {IconCheckBoxChecked, IconCheckBoxUnchecked} from '../../assets/icons';
import {theme} from '../global/styles';
import SpacingBox from './spacing_box';
import textStyle from '../constant/text_style';
import {APP_CONSTANTS} from '../constant/app_constant';

interface PopupMultiSelectProps {
  values: boolean[];
  selectedValues: boolean[];
  onValueSelect: (tempSelectedValues: boolean[]) => void;
  isVisible: boolean;
  onClose: () => void;
  title: string;
}

const PopupMultiSelect: React.FC<PopupMultiSelectProps> = ({
  values,
  onValueSelect,
  isVisible,
  onClose,
  title,
}) => {
  const [tempSelectedValues, setTempSelectedValues] =
    useState<boolean[]>(values);

  useEffect(() => {
    // Update tempSelectedValues when values change
    setTempSelectedValues(values);
  }, [values]);

  const toggleValue = (index: number) => {
    const updatedTempSelectedValues = [...tempSelectedValues];
    updatedTempSelectedValues[index] = !updatedTempSelectedValues[index];
    setTempSelectedValues(updatedTempSelectedValues);
  };

  const handleOkPress = () => {
    // Update selectedValues with the temporary selected values
    onValueSelect(tempSelectedValues);
    onClose();
  };

  const handleCancelPress = () => {
    // Reset tempSelectedValues to the original values and close the modal
    setTempSelectedValues(values);
    onClose();
  };

  const dayNames = [
    APP_CONSTANTS.monday,
    APP_CONSTANTS.tuesday,
    APP_CONSTANTS.wednesday,
    APP_CONSTANTS.thursday,
    APP_CONSTANTS.friday,
    APP_CONSTANTS.saturday,
    APP_CONSTANTS.sunday,
  ];

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modal}>
          <TouchableWithoutFeedback>
            <View style={styles.popupContent}>
              <View style={{justifyContent: 'flex-start'}}>
                <Text style={textStyle.pt18}>{title}</Text>
                <SpacingBox height={16} />
                {values.map((value, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      alignItems: 'center',
                      width: '100%',
                    }}
                    onPress={() => toggleValue(index)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 8,
                        width: '100%',
                      }}>
                      <TabBarIcon
                        iconComponent={
                          tempSelectedValues[index]
                            ? IconCheckBoxChecked
                            : IconCheckBoxUnchecked
                        }
                        size={24}
                        color={theme.colors.primaryLight}
                      />
                      <SpacingBox width={16} />
                      <Text style={{...textStyle.pt14, width: '100%'}}>
                        {dayNames[index]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleCancelPress}>
                  <Text style={textStyle.pt16}>{APP_CONSTANTS.cancel}</Text>
                </TouchableOpacity>
                <SpacingBox width={16} />
                <TouchableOpacity onPress={handleOkPress}>
                  <Text style={textStyle.pt16}>{APP_CONSTANTS.ok}</Text>
                </TouchableOpacity>
              </View>
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
    alignItems: 'flex-end',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 16,
  },
});

export default PopupMultiSelect;
