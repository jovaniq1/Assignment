import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useAtom } from 'jotai';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import React, { useEffect, useState } from 'react';

import { ListItem } from './components/ListItem/ListItem';
import {
  productsAtom,
  useAddToCart,
  useClearCart,
  useRemoveFromCart,
} from './cartStore';
import type { productsProps } from './constants/constants';
import theme, { normalize } from './theme/theme';
import { HorizontalStroller } from './components/HorizontalStroller';
import { useToast } from './components/Toast/toast-manager';
import { PinchToAccess } from './components/Pinch/PinchToAccess';

// Constants for list item height, margin, and additional measurements
const ListItemHeight = 100;
const Margin = 10;
const FullListItemHeight = ListItemHeight + Margin;

// Calculating total list height based on the number of items
const ListHeight = FullListItemHeight * 15;

// Constants for list margin top and a nice offset
const ListMarginTop = 20;

const NiceOffset = 40;

// Get screen dimensions
const { height: ScreenHeight, width: ScreenWidth } = Dimensions.get('window');

const refreshingHeight = 100;

// Main application component
const App = () => {
  // Reference for animated flat list
  const scrollAnimatedRef = useAnimatedRef<Animated.FlatList<number>>();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const scrollToIndex = useSharedValue(0);
  const handleClearCart = useClearCart();

  const [products] = useAtom(productsAtom);
  const handleAddToCart = useAddToCart();
  const handleRemoveFromCart = useRemoveFromCart();

  // show item details
  const showItemDetails = (id: number) => {
    showToast({
      title: '',
      key: 'see_exercises',
      ToastOffset: theme.HEIGHT * 0.5,
      ToastHeight: 50,
      BaseSafeArea: 0.1,

      ToastStyles: {
        zIndex: 0,
        width: theme.WIDTH,
        height: theme.HEIGHT,
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      leading: () => (
        <View>
          <PinchToAccess showToast={showToast}>
            <HorizontalStroller id={id} scrollToIndex={scrollToIndex} />
          </PinchToAccess>
        </View>
      ),
    });
  };

  const scrollOffset = useScrollViewOffset(scrollAnimatedRef as any);

  const scrollPosition = useSharedValue(0);
  const loadingOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollPosition.value = event.contentOffset.y;
    },
    onEndDrag: event => {
      const threshold = -100; // How far user needs to pull down to trigger refresh
      if (event.contentOffset.y < threshold) {
        runOnJS(setLoading)(true);
        loadingOffset.value = withTiming(refreshingHeight, { duration: 500 }); // Animate FlatList down
      }
    },
  });

  // set loading to false after 2 seconds
  useEffect(() => {
    if (loading) {
      // clears data
      handleClearCart();
      setTimeout(() => {
        setLoading(false);
        loadingOffset.value = withSpring(0); // Move the FlatList back up
      }, 3000);
    }
  }, [loading]);

  const flatListStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: loadingOffset.value }],
    };
  });

  const combinedOpacity = useDerivedValue(() => {
    // Assuming the use of some condition to decide which to use. You might need to introduce some logic here.
    // Let's say we decide based on which of the two is currently not zero or whichever was last updated.

    if (-scrollPosition.value > 0 && loadingOffset.value === 0) {
      return interpolate(
        -scrollPosition.value,
        [0, 100],
        [0, 1],
        Extrapolation.CLAMP,
      );
    } else {
      return interpolate(
        loadingOffset.value,
        [100, 0], // Reverse the range for decreasing effect
        [1, 0],
        Extrapolation.CLAMP,
      );
    }
  });

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    // Compute opacity based on the negative scroll position to a minimum of 0 (not visible) and maximum of 1 (fully visible)
    const scale = interpolate(
      -scrollPosition.value,
      [0, 100], // Assuming 100 is the point at which full opacity should be reached
      [1.2, 1.5],
      Extrapolation.CLAMP,
    );

    return {
      opacity: combinedOpacity.value, // Use spring for smoother transitions
      transform: [{ scale: scale }], // Scale based on opacity for a dynamic effect
    };
  });

  const onCardPress = (item: productsProps, index: number) => {
    showItemDetails(item?.id);
    const ItemWidth = ScreenWidth * 0.8;
    products.findIndex(product => product.id === item?.id) * ItemWidth;
    scrollToIndex.value = index * ItemWidth;
  };

  // Render the app
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="white" />
      <Animated.View style={[styles.refresh, animatedIndicatorStyle]}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={theme.GREEN_COLOR_CONTAINER_LIGHT_MEDIUM}
        />
      </Animated.View>

      <Animated.FlatList
        ref={scrollAnimatedRef}
        onScroll={scrollHandler}
        data={products}
        scrollEventThrottle={16} //60fps
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          marginTop: ListMarginTop,
          backgroundColor: theme.WHITE,
          height: ListHeight + NiceOffset * 1.2,
          marginBottom: 300,
        }}
        style={flatListStyle} // apply the animated style here
        renderItem={({ item, index }) => (
          <ListItem
            addToCart={handleAddToCart}
            handleRemoveFromCart={handleRemoveFromCart}
            onCardPress={onCardPress}
            index={index}
            item={item}
            loading={loading}
            scrollOffset={scrollOffset}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

// Styles for the main application component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: normalize(55),
  },

  refresh: {
    height: refreshingHeight,
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    marginTop: refreshingHeight,
  },
});

// Export the main application component
export { App };
