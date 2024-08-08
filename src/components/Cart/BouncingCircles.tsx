import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  interpolate,
  Easing,
} from 'react-native-reanimated';

import theme, { normalize } from '../../theme/theme'; // Adjust path as needed

const BouncingCircles = () => {
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);

  React.useEffect(() => {
    // Starting the first circle's animation
    progress1.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.out(Easing.elastic(1)) }),
      -1, // Repeat indefinitely
      true, // Toggle reverse each iteration
    );

    // Starting the second circle's animation after a delay
    setTimeout(() => {
      progress2.value = withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.out(Easing.elastic(1)),
        }),
        -1,
        true,
      );
    }, 400); // Delay in milliseconds

    // Starting the third circle's animation after a longer delay
    setTimeout(() => {
      progress3.value = withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.out(Easing.elastic(1)),
        }),
        -1,
        true,
      );
    }, 800);
  }, []);

  // Generic function to create circle style
  const createCircleStyle = (progress, colorFrom, colorTo) =>
    useAnimatedStyle(() => {
      const translateY = interpolate(progress.value, [0, 1], [0, -30]); // Moving up and down
      const backgroundColor = interpolateColor(
        progress.value,
        [0, 1],
        [colorFrom, colorTo],
      );

      return {
        backgroundColor,
        transform: [{ translateY }],
        opacity: interpolate(progress.value, [0, 1], [0, 1]), // Fading effect
      };
    });

  const circleStyle1 = createCircleStyle(
    progress1,
    theme.GREY,
    theme.GREEN_COLOR_CONTAINER,
  );
  const circleStyle2 = createCircleStyle(
    progress2,
    theme.GREY,
    theme.GREEN_COLOR_CONTAINER_LIGHT_MEDIUM,
  );
  const circleStyle3 = createCircleStyle(
    progress3,
    theme.GREY,
    theme.GREEN_COLOR_CONTAINER_LIGHT,
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, circleStyle1]} />
      <Animated.View style={[styles.circle, circleStyle2]} />
      <Animated.View style={[styles.circle, circleStyle3]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
    alignSelf: 'center',
    marginTop: normalize(50),
  },
  circle: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: 50,
    backgroundColor: 'grey',
  },
});

export { BouncingCircles };
