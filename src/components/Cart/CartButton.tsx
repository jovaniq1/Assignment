import { StyleSheet, Text, View } from 'react-native';
import { useAtom } from 'jotai';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import theme, { normalize } from '../../theme/theme';
import { cartAtom, useShowCartIcon } from '../../cartStore';
import { PressableScale } from '../Toast/components/pressable-scale';
import { useToast } from '../Toast/toast-manager';

import { CartList } from './CartList';

// shows the cart button
const CartButton = () => {
  const { showToast } = useToast();
  const handleShowCart = useShowCartIcon();

  const [cart] = useAtom(cartAtom);
  // get all items in cart and sum total added
  const total = cart.reduce((acc, item) => acc + item.added, 0);

  // show cart details
  const showCartPage = () => {
    handleShowCart(false);
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
  };

  return (
    <View style={[styles.container]}>
      <PressableScale
        style={styles?.button}
        onPress={() => {
          showCartPage();
        }}>
        <MaterialCommunityIcons name="cart" style={styles.buttonAddToCart} />
        <View style={styles.items}>
          <Text style={styles?.text}>{` ${total}`}</Text>
        </View>
      </PressableScale>
    </View>
  );
};

export { CartButton };
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: normalize(20),
    right: 0,
    padding: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100000,
  },
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
  text: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    textAlign: 'center',
    top: normalize(-3),
    color: 'white',
  },
  items: {
    position: 'absolute',
    top: -5,
    right: 10,
    borderRadius: normalize(20),
    padding: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonAddToCart: {
    borderRadius: normalize(10),
    justifyContent: 'center',
    color: theme.WHITE,
    fontSize: normalize(26),
    padding: normalize(5),
    alignItems: 'center',
    overflow: 'visible',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(60),
    width: normalize(60),
    backgroundColor: theme.BLACK,
    borderRadius: normalize(30),
  },
});
