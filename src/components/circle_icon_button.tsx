import React, {useState} from 'react';
import {
  TouchableNativeFeedback,
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import {SvgProps} from 'react-native-svg';

interface CircleIconButtonProps {
  onPress: () => void;
  iconComponent: React.FC<SvgProps>;
}

const CircleIconButton: React.FC<CircleIconButtonProps> = ({
  onPress,
  iconComponent: IconComponent,
}) => {
  const [animationValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(animationValue, {
      toValue: 0.8,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      onPress();
    });
  };

  const animatedStyle = {
    transform: [{scale: animationValue}],
  };

  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple('#5EA7DE', true)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={styles.circleButton}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <IconComponent width={24} height={24} />
        </Animated.View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
  },
});

export default CircleIconButton;
