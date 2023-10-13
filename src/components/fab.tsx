import React from 'react';
import {
  DimensionValue,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {theme} from '../global/styles';

interface FABProps {
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  icon: string;
  right?: DimensionValue | undefined;
}

const FAB: React.FC<FABProps> = ({onPress, icon, right}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{...styles.fabWrapper, right: right ?? '4%'}}>
      <View style={styles.fab}>
        <AntDesign name={icon} style={styles.fabIcon} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: '5%',
    right: '4%',
    elevation: 5,
  },
  fab: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
  },
});

export default FAB;
