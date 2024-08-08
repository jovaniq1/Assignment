import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

import { useToast } from '../Toast/toast-manager';
import { useShowCartIcon } from '../../cartStore';
import theme, { normalize } from '../../theme/theme';
import { CartList } from '../Cart/CartList';
import { mediumHaptic } from '../../utils';

const PinchToAccess = ({ children, showToast: showToast2 }) => {
  const { showToast } = useToast();
  const handleShowCart = useShowCartIcon();

  // show cart details
  const showCartPage = () => {
    mediumHaptic();
    handleShowCart(false);
    if (showToast2) {
      showToast2({
        title: '',
        key: 'cart',
        ToastOffset: theme.HEIGHT * 0.5,
        ToastHeight: 50,
        BaseSafeArea: 0.1,
        ToastStyles: {
          width: theme.WIDTH,
          borderRadius: 120,
          height: theme.HEIGHT * 0.8,
          borderCurve: 'continuous',
        },
        // eslint-disable-next-line react/no-unstable-nested-components
        leading: () => (
          <View style={styles.actionSheet}>
            <View style={styles.line} />
            <CartList showToast={showToast2} />
          </View>
        ),
      });
    } else {
      showToast({
        title: '',
        key: 'cart',
        ToastOffset: theme.HEIGHT * 0.5,
        ToastHeight: 50,
        BaseSafeArea: 0.1,
        ToastStyles: {
          width: theme.WIDTH,
          borderRadius: 120,
          height: theme.HEIGHT * 0.8,
          borderCurve: 'continuous',
        },
        // eslint-disable-next-line react/no-unstable-nested-components
        leading: () => (
          <View style={styles.actionSheet}>
            <View style={styles.line} />
            <CartList showToast={showToast} />
          </View>
        ),
      });
    }
  };

  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: event => {
      scale.value = event.scale;
    },
    onEnd: () => {
      if (scale.value < 1) {
        runOnJS(showCartPage)();
      }
      scale.value = 1; // Reset scale back to 1, directly set without animation
    },
  });

  return (
    <PinchGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={{ flex: 1 }}>
        {/* Ensure this is an Animated.View */}
        {children}
      </Animated.View>
    </PinchGestureHandler>
  );
};

export { PinchToAccess };

const styles = StyleSheet.create({
  actionSheet: {
    alignItems: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    width: theme.WIDTH,
    height: theme.HEIGHT * 0.8,
    bottom: normalize(-20),
    backgroundColor: theme.WHITE,
  },
  line: {
    width: normalize(50),
    height: normalize(5),
    backgroundColor: theme.GREY,
    borderRadius: normalize(5),
    position: 'absolute',
    top: normalize(10),
    alignSelf: 'center',
    zIndex: 100,
  },
});
