import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useCallback, useEffect } from 'react';

const { width, height } = Dimensions.get('window');

import { useAtom } from 'jotai';

import { showCartAtom, useShowCartIcon } from '../../../cartStore';

import type { ToastType } from './context';

// Define the props for the Toast component
type ToastProps = {
  index: number;
  toast: ToastType;
  onDismiss: (toastId: number) => void;
  style?: any;
};

// Constants for toast styling
const ToastOffset = 20;
const ToastHeight = 70;
const HideToastOffset = ToastOffset + ToastHeight;
const BaseSafeArea = height * 0.4;

// Define the Toast component
const Toast: React.FC<ToastProps> = ({ toast, index, onDismiss }) => {
  // Get the width of the window using useWindowDimensions hook
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const isActiveToast = toast.id === 0;

  const toastOffset = toast.ToastOffset || ToastOffset;
  const hideToastOffset =
    toast.ToastOffset + toast.ToastHeight || ToastOffset + ToastHeight;
  const baseSafeArea = toast.BaseSafeArea || BaseSafeArea;

  // Shared values for animation

  const initialBottomPosition = isActiveToast
    ? -hideToastOffset
    : baseSafeArea + (toast.id - 1) * toastOffset;

  const bottom = useSharedValue(initialBottomPosition);

  useEffect(() => {
    bottom.value = withTiming(baseSafeArea + toast.id * toastOffset);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isSwiping = useSharedValue(false);
  const [showCart] = useAtom(showCartAtom);
  const handleShowCart = useShowCartIcon();

  //handles when to show cart
  const checkCartVisibility = () => {
    if (!showCart) {
      handleShowCart(true);
    }
  };

  // Callback to dismiss the toast with animation
  const dismissItemDown = useCallback(() => {
    'worklet';
    translateY.value = withTiming(windowHeight, undefined, isFinished => {
      if (isFinished) {
        runOnJS(onDismiss)(toast.id);
      }
    });
  }, [onDismiss, toast.id, translateY, windowHeight]);
  // Callback to dismiss the toast with animation
  const dismissItem = useCallback(() => {
    'worklet';
    translateX.value = withTiming(-windowWidth, undefined, isFinished => {
      if (isFinished) {
        runOnJS(onDismiss)(toast.id);
      }
    });
  }, [onDismiss, toast.id, translateX, , windowWidth]);

  // Gesture handler for swipe interactions
  const gesture = Gesture.Pan()
    .enabled(isActiveToast)
    .onBegin(() => {
      isSwiping.value = true;
    })
    .onUpdate(event => {
      // translateX.value = event.translationX;
      // do not allow to swipe up
      if (event.translationY < 0) {
        return;
      }
      translateY.value = event.translationY;
    })
    .onEnd(event => {
      if (event.translationY > 180) {
        dismissItemDown();
        runOnJS(checkCartVisibility)();
      } else {
        translateY.value = withTiming(0);
      }
    })
    .onFinalize(() => {
      isSwiping.value = false;
    });

  // Autodismiss the last toast after a delay (if it's active)
  useEffect(() => {
    if (!toast.autodismiss || !isActiveToast) {
      return;
    }
    const timeout = setTimeout(() => {
      dismissItemDown();
    }, 2500);
    return () => {
      clearTimeout(timeout);
    };
  }, [dismissItemDown, isActiveToast, toast.autodismiss]);

  // Animated styles for the toast container
  const rToastStyle = useAnimatedStyle(() => {
    const rOpacity = interpolate(translateY.value, [0, windowHeight], [1, 0]);

    return {
      bottom: bottom.value,
      zIndex: 3000 - toast.id,
      // opacity: withTiming(rOpacity),
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  }, [toast]);

  // Animated styles for the visible container (opacity)
  const rVisibleContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(toast.id <= 1 ? 1 : 0),
    };
  }, [toast.id]);

  // Render the Toast component
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        key={index}
        style={[
          {
            zIndex: 100 - toast.id,
            borderCurve: 'continuous',
            height: toast.ToastScreenHeight || 70,
          },
          styles.container,
          toast?.ToastStyles,
          rToastStyle,
        ]}>
        <Animated.View style={styles.textContainer}>
          <Animated.View style={[rVisibleContainerStyle, styles.rowCenter]}>
            {Boolean(toast.leading) && <>{toast.leading?.()}</>}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

// Styles for the Toast component
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 20,
  },
  rowCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    rowGap: 2,
  },
});

// Export the Toast component for use in other files
export { Toast };
