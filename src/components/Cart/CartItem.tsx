import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useAtom } from 'jotai';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { cartAtom, useAddToCart, useRemoveFromCart } from '../../cartStore'; // Assuming cartAtom is exported from cartStore
import theme, { normalize } from '../../theme/theme';
import { PressableScale } from '../Toast/components/pressable-scale';
const ListItemHeight = 75;
const itemWidth = theme.WIDTH - 10;
const CartItem = ({ item }) => {
  const handleAddToCart = useAddToCart();
  const handleRemoveFromCart = useRemoveFromCart();

  const increment = () => {
    handleAddToCart(item?.id);
  };

  const decrement = () => {
    handleRemoveFromCart(item?.id);
  };

  return (
    <View style={[styles.container, styles.itemContainer]}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          height: ListItemHeight,
        }}>
        <PressableScale style={{ flex: 1 }} onPress={() => {}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
              justifyContent: 'space-between',
              marginHorizontal: normalize(5),
              marginVertical: normalize(2),
            }}>
            <Image source={{ uri: item.image }} style={[styles.image]} />

            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', marginBottom: normalize(5) }}>
                {item.name}
              </Text>
              <Text style={styles.cost}>{`$${item.price}`}</Text>
            </View>
          </View>
        </PressableScale>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: normalize(5),
            alignContent: 'flex-end',
            alignItems: 'center',
          }}>
          <PressableScale
            onPress={() => {
              decrement();
            }}
            style={{
              alignSelf: 'center',
              borderRadius: normalize(10),
              backgroundColor: theme.GREEN_COLOR_CONTAINER_LIGHT_MEDIUM,
            }}>
            <MaterialCommunityIcons
              name="minus"
              style={styles.buttonAddToCart}
            />
          </PressableScale>

          <View style={styles.added}>
            <Text style={styles.buttonAddToCartText}>{item.added}</Text>
          </View>

          <PressableScale
            onPress={() => {
              increment();
            }}
            style={{
              alignSelf: 'center',
              borderRadius: normalize(10),

              backgroundColor: theme.GREEN_COLOR_CONTAINER_LIGHT_MEDIUM,
            }}>
            <MaterialCommunityIcons
              name="plus"
              style={styles.buttonAddToCart}
            />
          </PressableScale>

          <Text style={styles.cost}>{`$${item.price * item?.added}`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: normalize(10),
    marginVertical: normalize(10),
    backgroundColor: theme.WHITE,
  },

  container: {
    height: ListItemHeight,
    marginHorizontal: normalize(5),
    backgroundColor: theme.WHITE,
    top: 0,
    borderRadius: normalize(15),
    padding: normalize(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cost: {
    width: normalize(50),
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: normalize(10),
    fontSize: normalize(14),
    color: theme.GREEN_COLOR_CONTAINER_LIGHT_MEDIUM,
  },
  added: {
    backgroundColor: theme.GREEN_COLOR_CONTAINER,
    borderRadius: normalize(20),
    height: normalize(25),
    width: normalize(25),
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: normalize(5),

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },

  buttonAddToCart: {
    borderRadius: normalize(10),
    justifyContent: 'center',
    color: theme.WHITE,
    fontSize: normalize(20),
    padding: normalize(5),
    alignItems: 'center',
  },
  buttonAddToCartText: {
    color: theme.WHITE,
    alignSelf: 'center',
    fontSize: normalize(12),
    textAlign: 'center',
    fontWeight: 'bold',
  },

  image: {
    height: '100%',
    aspectRatio: 1,
    left: normalize(-10),

    borderRadius: normalize(15),

    alignSelf: 'center',
    marginRight: normalize(10),
  },
});

export { CartItem };
