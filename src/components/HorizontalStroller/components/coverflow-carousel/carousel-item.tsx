import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  interpolateColor,
  withTiming,
  Easing,
  useSharedValue,
  runOnJS,
  useDerivedValue,
  withRepeat,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';

import type { productsProps } from '../../../../constants/constants';
import theme, { normalize } from '../../../../theme/theme';
import { PressableScale } from '../../../Toast/components/pressable-scale';
import { mediumHaptic } from '../../../../utils';

const tolerance = 8;
type CarouselItemProps = {
  index: number;
  scrollOffset: SharedValue<number>;
  itemWidth: number;
  item: productsProps;
  addToCart: (id: number) => void;
  id: number;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

export const CarouselItem: React.FC<CarouselItemProps> = ({
  scrollOffset,
  index,
  itemWidth,
  item,
  addToCart,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const fullContainerHeight = 15 * itemWidth;

  // Tracking the last index to determine swipe direction changes
  const lastIndex = useSharedValue(index);

  const skeletonColor = useSharedValue(0);

  // Start or stop the repeating animation based on index condition
  useEffect(() => {
    skeletonColor.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1, // Repeat indefinitely
      true, // Reverse direction on iterations
    );
    // }
  }, []);

  // Define the range of input values for interpolation based on item index and width
  const inputRange = [
    (index - 3) * itemWidth, // Three items before the current item
    (index - 2) * itemWidth, // Two items before the current item
    (index - 1) * itemWidth, // One item before the current item
    index * itemWidth, // Current item
    (index + 1) * itemWidth, // One item after the current item
    (index + 2) * itemWidth, // Two items after the current item
    (index + 3) * itemWidth, // Three items after the current item
  ];

  const inputRange2 = [
    (index - 2) * itemWidth,
    index * itemWidth,
    (index + 2) * itemWidth,
  ];

  // Define the animated style using useAnimatedStyle hook
  const rAnimatedImageStyle = useAnimatedStyle(() => {
    const newIndex = Math.round(scrollOffset.value / itemWidth);
    if (lastIndex.value !== newIndex) {
      lastIndex.value = newIndex;
      runOnJS(mediumHaptic)();
    }

    const scaleX = interpolate(
      scrollOffset.value,
      inputRange2,
      [1, 1.1, 1],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollOffset.value,
      [(index - 3) * itemWidth, ...inputRange, (index + 3) * itemWidth],
      [0, 1, 1, 1, 1, 1, 1, 1, 0],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollOffset.value,
      inputRange2,
      [itemWidth, 0, itemWidth],
      Extrapolation.CLAMP,
    );

    // Return the animated style object
    return {
      opacity,

      transform: [
        { translateY },
        {
          scaleX,
        },
        {
          scaleY: scaleX,
        },
      ],
    };
  }, [inputRange]);
  const rDataStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [
        (index - 1) * itemWidth,
        (index - 3) * itemWidth, // Three items before the current item
        (index - 2) * itemWidth, // Two items before the current item
        (index - 1) * itemWidth, // One item before the current item
        index * itemWidth - 100, // Current item
        index * itemWidth, // Current item
        index * itemWidth + 100, // Current item
        (index + 1) * itemWidth, // One item after the current item
        (index + 2) * itemWidth, // Two items after the current item
        (index + 3) * itemWidth, // Three items after the current item
        (index + 1) * itemWidth,
      ],
      [0.5, 0.5, 0.5, 0.7, 0.9, 1, 0.9, 0.7, 0.5, 0.5, 0.5],
      // Extrapolation.CLAMP,
    );

    // Return the animated style object
    return {
      opacity,
    };
  }, [inputRange]);

  const rImageScale = useAnimatedStyle(() => {
    const size = itemWidth * 0.8;
    const scaleX = interpolate(
      scrollOffset.value,
      inputRange,
      [0.1, 0.125, 0.2, 1, 0.2, 0.125, 0.1],
      Extrapolation.CLAMP,
    );

    const width = Math.round(size * scaleX);

    return {
      width,
    };
  }, [inputRange]);

  function handleLoadingWithDelay(isScaleOne: boolean) {
    if (isScaleOne) {
      // If scale is 1, set isLoading to true immediately (or keep it true), then set to false after 3 seconds
      setIsLoading(false);
    } else {
      // If scale is not 1, set isLoading to true immediately

      setIsLoading(true);
    }
  }
  useDerivedValue(() => {
    const targetPosition = Math.round(itemWidth * index);
    if (Math.abs(scrollOffset.value - targetPosition) <= tolerance) {
      // Call handleLoadingWithDelay with false when scale reaches 1
      runOnJS(handleLoadingWithDelay)(true);
    } else {
      // Call handleLoadingWithDelay with true when scale is not 1
      runOnJS(handleLoadingWithDelay)(false);
    }
  });

  const rSkeletonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      skeletonColor.value,
      [0, 1],
      [theme.GREY, theme.WHITE], // Interpolating between grey and white
    );
    return { backgroundColor };
  });

  if (isLoading) {
    return (
      <Animated.View
        style={[
          {
            width: itemWidth,
            height: '50%',
          },
          styles.container,
        ]}>
        <Animated.View
          style={[
            rAnimatedImageStyle,
            { overflow: 'hidden', borderRadius: normalize(20) },
          ]}>
          <Animated.View style={[styles.item]}>
            <Animated.View
              style={[
                {
                  backgroundColor: theme.GREY,
                  alignSelf: 'center',
                  borderRadius: normalize(10),

                  height: normalize(itemWidth * 0.7),
                  width: normalize(itemWidth * 0.7),
                },
                rImageScale,
                rSkeletonStyle,
              ]}
            />
            <View
              style={{
                marginHorizontal: normalize(10),
                marginTop: normalize(10),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Animated.View
                  style={[
                    {
                      backgroundColor: theme.GREY,
                      alignSelf: 'flex-start',
                      width: itemWidth * 0.55,
                      height: normalize(20),
                      borderRadius: normalize(5),
                      marginBottom: normalize(5),
                    },
                    rSkeletonStyle,
                  ]}
                />
              </View>

              <Animated.View
                style={[
                  {
                    backgroundColor: theme.GREY,
                    alignSelf: 'flex-start',
                    width: itemWidth * 0.7,
                    height: normalize(20),
                    borderRadius: normalize(5),
                    marginBottom: normalize(5),
                  },
                  rSkeletonStyle,
                ]}
              />
              <Animated.View
                style={[
                  {
                    backgroundColor: theme.GREY,
                    alignSelf: 'flex-start',
                    width: itemWidth * 0.6,
                    height: normalize(20),
                    borderRadius: normalize(5),
                    marginBottom: normalize(5),
                  },
                  rSkeletonStyle,
                ]}
              />
            </View>
            <Animated.View
              style={[
                {
                  backgroundColor: theme.GREY,
                  alignSelf: 'flex-end',
                  marginRight: normalize(10),
                  width: itemWidth * 0.12,
                  height: normalize(40),
                  borderRadius: normalize(5),
                },
                rSkeletonStyle,
              ]}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        {
          width: itemWidth,
          height: '50%',
        },
        styles.container,
      ]}>
      <Animated.View
        style={[
          rAnimatedImageStyle,
          { overflow: 'hidden', borderRadius: normalize(20) },
        ]}>
        <Animated.View style={[styles.item, rDataStyle]}>
          <AnimatedImage
            source={{ uri: item?.image }}
            style={[
              {
                aspectRatio: 1,
                alignSelf: 'center',
                borderRadius: normalize(10),
              },
              rImageScale,
            ]}
            cachePolicy={'memory-disk'}
          />
          <View
            style={{
              marginHorizontal: normalize(10),
              marginTop: normalize(10),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Animated.Text
                style={[
                  styles.title,
                  rDataStyle,
                ]}>{`${item?.name}`}</Animated.Text>
            </View>

            <Animated.Text
              style={[
                styles.text,
                rDataStyle,
              ]}>{`${item?.description}`}</Animated.Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: normalize(10),
              alignContent: 'flex-end',
              bottom: 0,
            }}>
            <View
              style={{
                flex: 1,

                position: 'absolute',
                right: normalize(5),
                bottom: 0,
                flexDirection: 'row',
              }}>
              <PressableScale
                onPress={() => {
                  addToCart(item.id);
                }}
                style={{
                  overflow: 'visible',
                  alignSelf: 'flex-end',
                  borderRadius: normalize(10),

                  backgroundColor: theme.GREEN_COLOR_CONTAINER_LIGHT_MEDIUM,
                }}>
                {Boolean(item.added) && (
                  <View style={styles.added}>
                    <Text style={styles.buttonAddToCartText}>{item.added}</Text>
                  </View>
                )}
                <MaterialCommunityIcons
                  name="cart"
                  style={styles.buttonAddToCart}
                />
              </PressableScale>
              <Text style={styles.cost}>{`$${item.price}`}</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  added: {
    backgroundColor: theme.GREEN_COLOR_CONTAINER,
    borderRadius: normalize(20),

    height: normalize(25),
    width: normalize(25),
    zIndex: 100,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: normalize(25),
    right: normalize(-5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonAddToCartText: {
    color: theme.WHITE,
    alignSelf: 'center',

    fontSize: normalize(12),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonAddToCart: {
    height: normalize(35),
    width: normalize(35),
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    color: theme.WHITE,
    fontSize: normalize(26),
    padding: normalize(5),

    alignItems: 'center',
    overflow: 'visible',
  },
  cost: {
    position: 'absolute',
    right: normalize(1),
    top: normalize(45),
    fontWeight: 'bold',
    fontSize: normalize(14),
    color: theme.GREEN_COLOR_CONTAINER_LIGHT_MEDIUM,
  },

  item: {
    overflow: 'hidden',
    paddingBottom: normalize(20),
    justifyContent: 'center',
    height: '100%',
    width: theme.WIDTH * 0.78,
    backgroundColor: theme.WHITE,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: normalize(5),
  },
  text: {
    fontSize: normalize(14),
    maxWidth: '80%',
    color: 'rgba(0,0,0,0.8)',
  },
});
