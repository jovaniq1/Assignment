import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import theme, { normalize } from '../../theme/theme';

const AnimatedButton = () => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    // Start the repeating animation right after mounting the component
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1, // Repeat indefinitely
      true, // Toggle reverse each iteration
    );
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    const borderRadius = progress.value * 50 + 10; // Smoothly transition from 10 to 50
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        theme.GREEN_COLOR_CONTAINER_LIGHT_MEDIUM,
        theme.GREEN_COLOR_CONTAINER_LIGHT,
      ],
    );

    return {
      borderRadius,
      backgroundColor,
      transform: [
        { scale: progress.value * 0.1 + 1 }, // Smoothly transition scale from 1 to 1.2
        { rotate: `${progress.value * 2 * Math.PI}rad` }, // Rotate from 0 to 360 degrees
      ],
    };
  });
  const animatedStyles2 = useAnimatedStyle(() => {
    const borderRadius = progress.value * 50 + 10; // Smoothly transition from 10 to 50
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme.GREEN_COLOR_CONTAINER, theme.GREEN_COLOR_CONTAINER_LIGHT_MEDIUM],
    );

    return {
      borderRadius,
      backgroundColor,
      transform: [
        { scale: progress.value * 0.5 + 1 }, // Smoothly transition scale from 1 to 1.2
        { rotate: `${progress.value * 2 * Math.PI}rad` }, // Rotate from 0 to 360 degrees
      ],
    };
  });
  const rText = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: progress.value * 0.5 + 1 }, // Smoothly transition scale from 1 to 1.2
      ],
    };
  });

  return (
    <>
      <Animated.Text style={[styles.text, rText]}>{'Success'}</Animated.Text>
      <Animated.View style={[styles.text, { top: normalize(180 - 80) }, rText]}>
        <MaterialCommunityIcons
          name="check"
          style={{
            fontSize: normalize(50),
            color: theme.WHITE,
          }}
        />
      </Animated.View>
      <Animated.View style={[styles.button2, animatedStyles2]}>
        <Animated.View style={[styles.button, animatedStyles]} />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: normalize(150),
    height: normalize(150),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  button2: {
    width: normalize(180),
    height: normalize(180),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    zIndex: 100,
    position: 'absolute',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: normalize(18),
    textAlign: 'center',
    top: normalize(160 / 2),
    alignSelf: 'center',
  },
});

export default AnimatedButton;
