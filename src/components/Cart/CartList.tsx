import React from 'react';
import { View, ScrollView, Vibration, StyleSheet, Text } from 'react-native';
import { useAtom } from 'jotai';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

import {
  cartAtom,
  showCartAtom,
  useClearCart,
  useShowCartIcon,
} from '../../cartStore';
import theme, { normalize } from '../../theme/theme';
import { PressableScale } from '../Toast/components/pressable-scale';

import { CartItem } from './CartItem'; // Import CartItem component
import AnimatedButton from './CheckoutAnimation';
import { BouncingCircles } from './BouncingCircles';

const CartList = ({ showToast }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [cart] = useAtom(cartAtom);
  const handleShowCart = useShowCartIcon();

  // animation for opacity
  const opacity = useSharedValue(1);
  const handleClearCart = useClearCart();

  const total = cart.reduce((acc, item) => acc + item.added, 0);
  const totalCost = cart.reduce(
    (acc, item) => acc + item.added * item.price,
    0,
  );

  const showCompletedAnimation = () => {
    // check if total cost is greater than 0
    if (totalCost <= 0) {
      return;
    }
    setIsLoading(true);
    opacity.value = withTiming(0, { duration: 1000 }, () => {
      runOnJS(handleClearCart)();
    });

    // show cart button again
    setTimeout(() => {
      showToast({
        title: '',
        key: 'cartw',
        ToastOffset: theme.HEIGHT * 0.5,
        ToastHeight: 50,
        BaseSafeArea: 0.1,
        autodismiss: true,
        ToastStyles: {
          zIndex: 1000,
          width: theme.WIDTH,
          borderRadius: 120,
          height: theme.HEIGHT * 0.8,
          borderCurve: 'continuous',
          alignItems: 'center',

          justifyContent: 'center',
        },
        leading: () => <AnimatedButton />,
      });
      Vibration.vibrate(5000);
    }, 5000);
    setTimeout(() => {
      handleShowCart(true);
    }, 7500);
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View
      style={{
        marginTop: normalize(60),
        width: '95%',
        height: '100%',
        marginHorizontal: normalize(20),
        marginVertical: normalize(20),
      }}>
      <Text
        style={{
          fontSize: normalize(20),
          alignSelf: 'center',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Cart
      </Text>

      <Animated.Text
        style={[
          {
            alignSelf: 'flex-start',
            fontSize: normalize(20),
            fontWeight: 'bold',

            marginTop: normalize(20),
            marginBottom: normalize(20),
          },
          rStyle,
        ]}>
        Total Items: {total}
      </Animated.Text>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {isLoading && <BouncingCircles />}
        <Animated.View style={[rStyle]}>
          {cart.map(item => (
            <CartItem key={item?.id} item={item} />
          ))}
        </Animated.View>
      </ScrollView>
      <View style={styles.total}>
        <Animated.Text
          style={[
            {
              alignSelf: 'flex-end',
              fontSize: normalize(20),
              fontWeight: 'bold',
              color: theme.GREEN_COLOR_CONTAINER_LIGHT_MEDIUM,
            },
            rStyle,
          ]}>
          Total: {`$${totalCost}`}
        </Animated.Text>
        <PressableScale
          onPress={() => {
            showCompletedAnimation();
          }}
          style={styles.button}>
          <Text style={styles.buttonAddToCartText}>
            {isLoading ? 'Loading' : 'Buy'}
          </Text>

          <MaterialCommunityIcons name="cart" style={styles.buttonAddToCart} />
        </PressableScale>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonAddToCartText: {
    color: theme.WHITE,
    alignSelf: 'center',
    fontSize: normalize(18),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: normalize(5),
    marginVertical: normalize(10),
    marginHorizontal: normalize(20),
    backgroundColor: theme.BLACK,
    borderRadius: normalize(30),
  },
  buttonAddToCart: {
    height: 40,
    width: 40,
    borderRadius: 10,
    justifyContent: 'center',
    color: theme.WHITE,
    fontSize: normalize(26),
    padding: 5,

    alignItems: 'center',
    overflow: 'visible',
  },

  total: { marginBottom: normalize(120) },
});

export { CartList };
